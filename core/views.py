from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from datetime import datetime, timedelta
import PyPDF2
import io

from .models import (
    PatientProfile, SchemeResult, MedicalReport, 
    AIAnalysis, Subscription, KARNATAKA_DISTRICTS,
    DISEASE_TYPES, SCAN_TYPES, ECONOMIC_STATUS
)
from .serializers import (
    PatientProfileSerializer, SchemeResultSerializer,
    MedicalReportSerializer, AIAnalysisSerializer,
    SubscriptionSerializer, SchemeCheckRequestSerializer,
    ReportAnalysisRequestSerializer
)
from .gemini_service import gemini_service


# ============= TEMPLATE VIEWS =============
def home_view(request):
    """Landing page"""
    return render(request, 'home.html')

def scheme_checker_view(request):
    """Scheme eligibility checker page"""
    context = {
        'districts': KARNATAKA_DISTRICTS,
        'disease_types': DISEASE_TYPES,
        'economic_status': ECONOMIC_STATUS
    }
    
    # If user is authenticated, try to get their patient profile
    if request.user.is_authenticated:
        try:
            patient_profile = request.user.patient_profile
            context['patient_profile'] = patient_profile
        except:
            # User is authenticated but doesn't have a patient profile
            pass
    
    return render(request, 'scheme_checker.html', context)

def report_vault_view(request):
    """Secure medical report vault with OTP verification"""
    return render(request, 'report_vault_secure.html')

def report_analysis_view(request):
    """AI report analysis page"""
    return render(request, 'report_analysis.html')

def premium_view(request):
    """Premium subscription page"""
    return render(request, 'premium.html')

def login_view(request):
    """Dual role login page"""
    return render(request, 'login.html')

@ensure_csrf_cookie
def hospital_dashboard_view(request):
    """Hospital staff dashboard for report upload"""
    # Make sure CSRF cookie is set
    from django.middleware.csrf import get_token
    csrf_token = get_token(request)
    response = render(request, 'hospital_dashboard.html', {'csrf_token': csrf_token})
    return response

def register_view(request):
    """User registration page"""
    return render(request, 'register.html')


# ============= API ENDPOINTS =============

@api_view(['POST'])
def check_scheme_eligibility(request):
    """
    API endpoint to check scheme eligibility using Gemini AI
    """
    serializer = SchemeCheckRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    patient_data = serializer.validated_data
    
    try:
        # Call Gemini AI service
        result = gemini_service.check_scheme_eligibility(patient_data)
        
        # Save result if user is authenticated
        if request.user.is_authenticated:
            try:
                patient_profile = request.user.patient_profile
            except PatientProfile.DoesNotExist:
                # Create patient profile
                patient_profile = PatientProfile.objects.create(
                    user=request.user,
                    age=patient_data['age'],
                    district=patient_data['district'],
                    economic_status=patient_data['economic_status'],
                    has_ration_card=patient_data['has_ration_card'],
                    has_aadhaar=patient_data['has_aadhaar'],
                    disease_type=patient_data['disease_type']
                )
            
            # Save scheme result
            SchemeResult.objects.create(
                patient=patient_profile,
                scheme_name=result['scheme_name'],
                scheme_type=result['scheme_type'],
                eligibility_score=result['eligibility_score'],
                why_eligible=result['why_eligible'],
                required_documents=result['required_documents'],
                apply_steps=result['apply_steps'],
                language_output=result['language_output']
            )
        
        return Response({
            'success': True,
            'data': result
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_medical_report(request):
    """
    DEPRECATED - Report upload moved to Hospital Staff portal only
    Patients cannot upload reports directly for security
    """
    return Response({
        'success': False,
        'error': 'Report upload is only available through Hospital/Lab Staff portal',
        'message': 'For security and verification, reports must be uploaded by authorized hospital staff'
    }, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def get_medical_reports(request):
    """
    Get all medical reports for authenticated user
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'error': 'Authentication required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        patient_profile = request.user.patient_profile
        reports = MedicalReport.objects.filter(patient=patient_profile)
        serializer = MedicalReportSerializer(reports, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except PatientProfile.DoesNotExist:
        return Response({
            'success': True,
            'data': []
        }, status=status.HTTP_200_OK)

def extract_text_from_pdf(file_path):
    """
    Extract text content from PDF file using multiple approaches
    OPTIMIZED: More aggressive limits for 5-second processing
    """
    import os
    import concurrent.futures
    import time
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"PDF file not found: {file_path}")
        return None
    
    # Try multiple extraction methods in parallel for faster results
    methods = [
        _extract_with_pypdf2,
        _extract_with_pymupdf
        # Removed OCR (_extract_with_pytesseract) as it's too slow for 5-second requirement
    ]
    
    # Use ThreadPoolExecutor with timeout for parallel processing
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        # Submit all methods
        future_to_method = {executor.submit(method, file_path): method for method in methods}
        
        # Check for results with a 3-second timeout
        for future in concurrent.futures.as_completed(future_to_method, timeout=3):
            method = future_to_method[future]
            try:
                text = future.result(timeout=1.5)  # 1.5 second timeout per method
                if text and len(text.strip()) > 30:  # Lowered minimum viable text
                    print(f"Successfully extracted text using {method.__name__}")
                    return text.strip()
            except concurrent.futures.TimeoutError:
                print(f"Method {method.__name__} timed out")
            except Exception as e:
                print(f"Method {method.__name__} failed: {str(e)}")
                continue
    
    return None

def _extract_with_pypdf2(file_path):
    """Extract text using PyPDF2 - More aggressive optimization"""
    import PyPDF2
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ''
        # Limit to first 3 pages for faster processing
        pages_to_process = min(3, len(pdf_reader.pages))
        for i in range(pages_to_process):
            page = pdf_reader.pages[i]
            extracted = page.extract_text()
            if extracted:
                text += extracted
            # Early exit if we have enough text (lowered threshold)
            if len(text.strip()) > 200:
                break
        return text

def _extract_with_pymupdf(file_path):
    """Extract text using PyMuPDF (fitz) - More aggressive optimization"""
    import fitz  # PyMuPDF
    doc = fitz.open(file_path)
    text = ''
    # Limit to first 3 pages for faster processing
    pages_to_process = min(3, len(doc))
    for page_num in range(pages_to_process):
        page = doc.load_page(page_num)
        text += page.get_text()
        # Early exit if we have enough text (lowered threshold)
        if len(text.strip()) > 200:
            break
    doc.close()
    return text

def preprocess_medical_text(text):
    """
    Preprocess medical text to identify key sections for faster AI analysis
    """
    if not text:
        return ""
    
    # Split text into lines for processing
    lines = text.split('\n')
    
    # Look for common medical report section headers
    key_sections = [
        'patient', 'report', 'test', 'result', 'value', 'range', 'normal',
        'diagnosis', 'findings', 'conclusion', 'summary', 'recommendation',
        'ರೋಗಿ', 'ವರದಿ', 'ಪರೀಕ್ಷೆ', 'ಫಲಿತಾಂಶ', 'ಮೌಲ್ಯ', 'ಶ್ರೇಣಿ', 'ಸಾಮಾನ್ಯ',
        'ನಿದಾನ', 'ಹುಡುಕಾಟ', 'ತೀರ್ಮಾನ', 'ಸಾರಾಂಶ', 'ಶಿಫಾರಸು'
    ]
    
    # Filter lines that contain key medical terms
    filtered_lines = []
    for line in lines:
        line_lower = line.lower().strip()
        # Skip empty lines or lines with only special characters
        if not line_lower or len(line_lower) < 3:
            continue
            
        # Include lines that contain key medical terms
        if any(keyword in line_lower for keyword in key_sections):
            filtered_lines.append(line)
        # Also include lines that look like test results (contain numbers and units)
        elif any(char.isdigit() for char in line) and len(line.strip()) > 10:
            filtered_lines.append(line)
    
    # Join filtered lines and truncate to essential content
    processed_text = '\n'.join(filtered_lines[:50])  # Limit to first 50 relevant lines
    
    # If we didn't find enough relevant content, return a portion of the original text
    if len(processed_text) < 100:
        processed_text = text[:1000]  # But limit to 1000 characters max
        
    return processed_text

@api_view(['POST'])
def analyze_medical_report(request):
    """
    API endpoint to analyze medical report using Gemini AI
    OPTIMIZED: Added caching to avoid redundant processing
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'error': 'Authentication required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check subscription limits
    subscription, created = Subscription.objects.get_or_create(user=request.user)
    
    if not subscription.can_analyze_report():
        return Response({
            'success': False,
            'error': 'Analysis limit reached. Upgrade to Premium for unlimited analysis.',
            'upgrade_required': True
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ReportAnalysisRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    report_id = serializer.validated_data['report_id']
    language = serializer.validated_data.get('language', 'English')
    
    try:
        report = get_object_or_404(MedicalReport, id=report_id, patient__user=request.user)
        
        # Check if we already have a recent analysis for this report+language combination
        # This avoids re-processing the same report unnecessarily
        from django.utils import timezone
        from datetime import timedelta
        
        # Look for existing analysis within last 24 hours for same language
        existing_analysis = AIAnalysis.objects.filter(
            report=report,
            language=language,
            analyzed_at__gte=timezone.now() - timedelta(hours=24)
        ).first()
        
        if existing_analysis:
            # Return cached analysis
            analysis_serializer = AIAnalysisSerializer(existing_analysis)
            return Response({
                'success': True,
                'data': analysis_serializer.data,
                'cached': True  # Indicate this is a cached result
            }, status=status.HTTP_200_OK)
        
        # First decrypt the PDF
        print(f"Decrypting PDF: {report.report_file.path}")
        decrypted_content = report.decrypt_file()
        
        if not decrypted_content:
            print(f"Failed to decrypt PDF: {report.report_file.path}")
            return Response({
                'success': False,
                'error': 'Could not decrypt the PDF file. The file might be corrupted or the encryption key is invalid.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save decrypted content to a temporary file for text extraction
        import tempfile
        import os
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp_file:
            tmp_file.write(decrypted_content)
            tmp_file_path = tmp_file.name
        
        try:
            # Extract text from decrypted PDF
            print(f"Attempting to extract text from decrypted PDF: {tmp_file_path}")
            report_text = extract_text_from_pdf(tmp_file_path)
            print(f"Text extraction result length: {len(report_text) if report_text else 0}")
            
            if not report_text:
                print(f"Failed to extract text from decrypted PDF: {tmp_file_path}")
                return Response({
                    'success': False,
                    'error': 'Could not extract text from PDF. The PDF might be scanned images, password-protected, or corrupted. Try uploading a different PDF file.'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            # Preprocess the text to identify key medical content
            print("Preprocessing medical text to identify key sections")
            processed_text = preprocess_medical_text(report_text)
            print(f"Preprocessed text length: {len(processed_text)}")
            
            # Use preprocessed text for AI analysis
            report_text = processed_text
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
        
        # Call Gemini AI service with timeout
        import concurrent.futures
        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(gemini_service.analyze_medical_report, report_text, language)
                # Set timeout to 4 seconds to ensure response within 5 seconds
                analysis_result = future.result(timeout=4)
        except concurrent.futures.TimeoutError:
            return Response({
                'success': False,
                'error': 'Analysis took too long. Showing sample results.',
                'sample': True
            }, status=status.HTTP_200_OK)
        
        # Save analysis
        ai_analysis, created = AIAnalysis.objects.update_or_create(
            report=report,
            defaults={
                'patient_summary': analysis_result['patient_summary'],
                'abnormal_findings': analysis_result['abnormal_findings'],
                'risk_level': analysis_result['risk_level'],
                'lifestyle_recommendations': analysis_result['lifestyle_recommendations'],
                'doctor_visit_suggestion': analysis_result['doctor_visit_suggestion'],
                'language': language
            }
        )
        
        # Mark report as analyzed
        report.is_analyzed = True
        report.save()
        
        # Update subscription count
        if created:
            subscription.ai_analysis_count += 1
            subscription.save()
        
        analysis_serializer = AIAnalysisSerializer(ai_analysis)
        
        return Response({
            'success': True,
            'data': analysis_serializer.data,
            'cached': False
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_subscription_status(request):
    """
    Get subscription status for authenticated user
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'error': 'Authentication required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    subscription, created = Subscription.objects.get_or_create(user=request.user)
    serializer = SubscriptionSerializer(subscription)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def upgrade_to_premium(request):
    """
    Upgrade user to premium subscription
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'error': 'Authentication required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    payment_id = request.data.get('payment_id')
    
    try:
        subscription, created = Subscription.objects.get_or_create(user=request.user)
        subscription.is_premium = True
        subscription.status = 'active'
        subscription.end_date = datetime.now() + timedelta(days=30)
        subscription.payment_id = payment_id
        subscription.save()
        
        return Response({
            'success': True,
            'message': 'Successfully upgraded to Premium!',
            'data': SubscriptionSerializer(subscription).data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============= HELPER FUNCTIONS =============

