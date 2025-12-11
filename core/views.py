from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
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
@permission_classes([IsAuthenticated])
def get_medical_reports(request):
    """
    Get all medical reports for authenticated user
    """
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_medical_report(request):
    """
    API endpoint to analyze medical report using Gemini AI
    OPTIMIZED: Added caching to avoid redundant processing
    """
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
        
        # Look for existing analysis in the same language
        existing_analysis = AIAnalysis.objects.filter(
            report=report,
            language=language,
            created_at__gte=timezone.now() - timedelta(hours=24)  # Cache for 24 hours
        ).first()
        
        if existing_analysis:
            # Return cached analysis
            analysis_serializer = AIAnalysisSerializer(existing_analysis)
            return Response({
                'success': True,
                'data': analysis_serializer.data,
                'cached': True
            }, status=status.HTTP_200_OK)
        
        # Extract text from report file
        if not report.report_file or not os.path.exists(report.report_file.path):
            return Response({
                'success': False,
                'error': 'Report file not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Process PDF with optimizations for 5-second limit
        report_text = extract_text_from_pdf(report.report_file.path)
        
        if not report_text:
            return Response({
                'success': False,
                'error': 'Could not extract text from report'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Preprocess text to optimize for AI analysis speed
        processed_text = preprocess_medical_text(report_text)
        
        # Process with Gemini AI using threading and timeout
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
@permission_classes([IsAuthenticated])
def get_subscription_status(request):
    """
    Get subscription status for authenticated user
    """
    subscription, created = Subscription.objects.get_or_create(user=request.user)
    serializer = SubscriptionSerializer(subscription)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_to_premium(request):
    """
    Upgrade user to premium subscription
    """
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

