# SECURE VIEWS - Hospital Staff Upload & Patient OTP Verification
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from datetime import datetime
from django.utils import timezone
import os
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    PatientProfile, MedicalReport, HospitalStaff, 
    ReportAccessLog, Subscription
)
from .serializers import (
    HospitalStaffSerializer, HospitalReportUploadSerializer,
    OTPVerificationSerializer, OTPRequestSerializer,
    MedicalReportSerializer, ReportAccessLogSerializer
)


def get_client_ip(request):
    """Extract client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


# ============= REGISTRATION APIs =============

@api_view(['POST'])
@permission_classes([AllowAny])
def register_patient(request):
    """
    Register a new patient user
    """
    required_fields = ['username', 'email', 'password', 'full_name', 'phone_number', 'age', 'district', 'economic_status', 'disease_type']
    
    for field in required_fields:
        if not request.data.get(field):
            return Response({
                'success': False,
                'error': f'{field} is required'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if user already exists
        if User.objects.filter(username=request.data['username']).exists():
            return Response({
                'success': False,
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=request.data['email']).exists():
            return Response({
                'success': False,
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=request.data['username'],
            email=request.data['email'],
            password=request.data['password'],
            first_name=request.data['full_name']
        )
        
        # Create patient profile
        patient_profile = PatientProfile.objects.create(
            user=user,
            age=int(request.data['age']),
            district=request.data['district'],
            economic_status=request.data['economic_status'],
            has_ration_card=request.data.get('has_ration_card', False),
            has_aadhaar=request.data.get('has_aadhaar', False),
            aadhaar_last4=request.data.get('aadhaar_last4', ''),
            disease_type=request.data['disease_type'],
            phone_number=request.data['phone_number']
        )
        
        # Create subscription
        Subscription.objects.create(user=user)
        
        return Response({
            'success': True,
            'message': 'Patient registered successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_hospital_staff(request):
    """
    Register a new hospital staff user
    """
    required_fields = ['username', 'email', 'password', 'staff_name', 'hospital_name', 'license_number']
    
    for field in required_fields:
        if not request.data.get(field):
            return Response({
                'success': False,
                'error': f'{field} is required'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if user already exists
        if User.objects.filter(username=request.data['username']).exists():
            return Response({
                'success': False,
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=request.data['email']).exists():
            return Response({
                'success': False,
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=request.data['username'],
            email=request.data['email'],
            password=request.data['password']
        )
        
        # Create hospital staff profile
        hospital_staff = HospitalStaff.objects.create(
            user=user,
            staff_name=request.data['staff_name'],
            hospital_name=request.data['hospital_name'],
            department=request.data.get('department', ''),
            license_number=request.data['license_number'],
            is_verified=False  # Admin verification required
        )
        
        return Response({
            'success': True,
            'message': 'Hospital staff registered successfully. Awaiting admin verification.'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============= AUTHENTICATION APIs =============

@api_view(['POST'])
@permission_classes([AllowAny])
def patient_login(request):
    """Patient login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user and hasattr(user, 'patient_profile'):
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'role': 'PATIENT',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'name': user.get_full_name() or user.username
            }
        })
    
    return Response({
        'success': False,
        'error': 'Invalid credentials or not a registered patient'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def hospital_staff_login(request):
    """Hospital staff login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user and hasattr(user, 'hospital_staff'):
        if not user.hospital_staff.is_verified:
            return Response({
                'success': False,
                'error': 'Your account is pending verification by admin'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'role': 'HOSPITAL_STAFF',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'staff_name': user.hospital_staff.staff_name,
                'hospital_name': user.hospital_staff.hospital_name
            }
        })
    
    return Response({
        'success': False,
        'error': 'Invalid credentials or not authorized hospital staff'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_logout(request):
    """Logout endpoint for both roles"""
    logout(request)
    return Response({'success': True, 'message': 'Logged out successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """Refresh JWT token"""
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'success': False, 'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return Response({'success': True, 'token': access_token})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


# ============= HOSPITAL STAFF - REPORT UPLOAD =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def hospital_upload_report(request):
    """
    Hospital staff uploads encrypted report mapped to patient
    SECURITY: Only verified hospital staff can upload
    """
    # RBAC Check
    if not hasattr(request.user, 'hospital_staff'):
        return Response({
            'success': False,
            'error': 'Unauthorized. Only hospital staff can upload reports.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if not request.user.hospital_staff.is_verified:
        return Response({
            'success': False,
            'error': 'Your account is not verified yet.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = HospitalReportUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # Find patient by phone number
    try:
        patient = PatientProfile.objects.get(phone_number=data['patient_phone'])
    except PatientProfile.DoesNotExist:
        # Log failed attempt
        ReportAccessLog.objects.create(
            report=None,
            accessed_by_user=request.user,
            access_type='UPLOAD_ATTEMPT',
            ip_address=get_client_ip(request),
            access_granted=False
        )
        return Response({
            'success': False,
            'error': f"No patient found with phone number {data['patient_phone']}"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Verify Aadhaar last 4 if provided
    if data.get('patient_aadhaar_last4'):
        if patient.aadhaar_last4 != data['patient_aadhaar_last4']:
            # Log failed attempt
            ReportAccessLog.objects.create(
                report=None,
                accessed_by_user=request.user,
                access_type='UPLOAD_ATTEMPT',
                ip_address=get_client_ip(request),
                access_granted=False
            )
            return Response({
                'success': False,
                'error': 'Aadhaar verification failed'
            }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Read and encrypt file
        uploaded_file = data['report_file']
        file_content = uploaded_file.read()
        
        # Create report instance
        report = MedicalReport(
            patient=patient,
            title=data['title'],
            scan_type=data['scan_type'],
            hospital_name=data.get('hospital_name', request.user.hospital_staff.hospital_name),
            test_date=data.get('test_date'),
            file_size=len(file_content),
            uploaded_by_staff=request.user.hospital_staff,
            patient_phone_match=data['patient_phone'],
            patient_aadhaar_match=data.get('patient_aadhaar_last4'),
            is_encrypted=True,
            requires_otp=True
        )
        
        # Encrypt file content
        encrypted_content = report.encrypt_file(file_content)
        
        # Save encrypted file
        filename = f"encrypted_{uploaded_file.name}"
        report.report_file.save(filename, ContentFile(encrypted_content), save=False)
        report.save()
        
        # Log upload
        ReportAccessLog.objects.create(
            report=report,
            accessed_by_user=request.user,
            access_type='UPLOAD',
            ip_address=get_client_ip(request),
            access_granted=True
        )
        
        return Response({
            'success': True,
            'message': 'Report uploaded and encrypted successfully',
            'data': {
                'report_id': report.id,
                'patient_name': patient.user.get_full_name() or patient.user.username,
                'title': report.title,
                'patient_phone': patient.phone_number[-4:].rjust(len(patient.phone_number), '*')  # Mask phone for security
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Upload failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hospital_upload_history(request):
    """Get upload history for logged-in hospital staff"""
    if not hasattr(request.user, 'hospital_staff'):
        return Response({
            'success': False,
            'error': 'Unauthorized'
        }, status=status.HTTP_403_FORBIDDEN)
    
    reports = MedicalReport.objects.filter(
        uploaded_by_staff=request.user.hospital_staff
    ).select_related('patient__user')[:50]
    
    data = [{
        'id': r.id,
        'title': r.title,
        'patient_name': r.patient.user.get_full_name() or 'Patient',
        'scan_type': r.scan_type,
        'uploaded_date': r.uploaded_date,
        'is_analyzed': r.is_analyzed
    } for r in reports]
    
    return Response({'success': True, 'data': data})


# ============= PATIENT - OTP VERIFICATION & REPORT ACCESS =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_otp(request):
    """
    Patient requests OTP to view their reports
    SECURITY: OTP sent to registered phone number
    """
    if not hasattr(request.user, 'patient_profile'):
        return Response({
            'success': False,
            'error': 'Only patients can request OTP'
        }, status=status.HTTP_403_FORBIDDEN)
    
    patient = request.user.patient_profile
    otp = patient.generate_otp()
    
    # TODO: Send OTP via SMS (integrate with SMS gateway)
    # For demo, return OTP in response (REMOVE IN PRODUCTION)
    
    return Response({
        'success': True,
        'message': f'OTP sent to {patient.phone_number[-4:].rjust(10, "X")}',
        'demo_otp': otp  # REMOVE IN PRODUCTION
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_otp(request):
    """Verify OTP before granting report access"""
    if not hasattr(request.user, 'patient_profile'):
        return Response({
            'success': False,
            'error': 'Unauthorized'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = OTPVerificationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    patient = request.user.patient_profile
    otp = serializer.validated_data['otp_code']
    
    # Debug logging
    print(f"Verifying OTP: {otp}")
    print(f"Stored OTP: {patient.otp_code}")
    print(f"OTP Created at: {patient.otp_created_at}")
    
    if patient.verify_otp(otp):
        # Store OTP verification in session
        request.session['otp_verified'] = True
        request.session['otp_verified_at'] = timezone.now().isoformat()
        request.session.save()  # Explicitly save the session
        
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"OTP verified successfully for patient {patient.id}")
        
        return Response({
            'success': True,
            'message': 'OTP verified successfully. You can now access your reports.'
        })
    
    return Response({
        'success': False,
        'error': 'Invalid or expired OTP'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_get_reports(request):
    """
    Get patient's own reports
    SECURITY: Always allowed, but OTP required to view/download
    """
    if not hasattr(request.user, 'patient_profile'):
        return Response({
            'success': False,
            'error': 'Unauthorized'
        }, status=status.HTTP_403_FORBIDDEN)
    
    patient = request.user.patient_profile
    reports = MedicalReport.objects.filter(patient=patient)
    
    # Debug logging
    otp_verified = request.session.get('otp_verified', False)
    print(f"Session OTP verified: {otp_verified}")
    
    data = [{
        'id': r.id,
        'title': r.title,
        'scan_type': r.scan_type,
        'hospital_name': r.hospital_name,
        'uploaded_date': r.uploaded_date,
        'is_analyzed': r.is_analyzed,
        'requires_otp': r.requires_otp,
        'can_view': otp_verified or not r.requires_otp
    } for r in reports]
    
    return Response({
        'success': True,
        'data': data,
        'otp_verified': otp_verified
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_view_report(request, report_id):
    """
    View specific report (decrypted)
    SECURITY: OTP verification required, access logged, patient ownership verified
    """
    if not hasattr(request.user, 'patient_profile'):
        return Response({
            'success': False,
            'error': 'Unauthorized'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Ensure the report belongs to the requesting patient
    try:
        report = MedicalReport.objects.get(id=report_id, patient=request.user.patient_profile)
    except MedicalReport.DoesNotExist:
        # Log unauthorized access attempt
        ReportAccessLog.objects.create(
            report=None,
            accessed_by_user=request.user,
            access_type='UNAUTHORIZED_ACCESS_ATTEMPT',
            ip_address=get_client_ip(request),
            access_granted=False
        )
        return Response({
            'success': False,
            'error': 'Report not found or you do not have permission to access this report'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check OTP verification
    otp_verified = request.session.get('otp_verified', False)
    otp_verified_at = request.session.get('otp_verified_at', None)
    
    # Debug logging
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Viewing report {report_id} for patient {request.user.patient_profile.id}, OTP verified: {otp_verified}, Verified at: {otp_verified_at}")
    
    # Validate OTP is not expired (5 minutes validity)
    if report.requires_otp and otp_verified and otp_verified_at:
        from datetime import datetime
        otp_time = datetime.fromisoformat(otp_verified_at)
        time_diff = timezone.now() - otp_time
        if time_diff.total_seconds() > 300:  # 5 minutes
            # OTP expired
            request.session['otp_verified'] = False
            otp_verified = False
    
    if report.requires_otp and not otp_verified:
        # Log failed access attempt
        ReportAccessLog.objects.create(
            report=report,
            accessed_by_user=request.user,
            access_type='VIEW',
            ip_address=get_client_ip(request),
            otp_verified=False,
            access_granted=False
        )
        
        return Response({
            'success': False,
            'error': 'OTP verification required to view this report',
            'requires_otp': True
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Log successful access
    ReportAccessLog.objects.create(
        report=report,
        accessed_by_user=request.user,
        access_type='VIEW',
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:200],
        otp_verified=otp_verified,
        access_granted=True
    )
    
    # Decrypt and serve the file
    if report.is_encrypted:
        logger.info(f"Attempting to decrypt report {report.id}")
        decrypted_content = report.decrypt_file()
        if decrypted_content:
            logger.info(f"Successfully decrypted report {report.id}, content length: {len(decrypted_content)}")
            # Serve the decrypted file
            from django.http import HttpResponse
            response = HttpResponse(decrypted_content, content_type='application/pdf')
            response['Content-Disposition'] = f'inline; filename="{report.title}.pdf"'
            return response
        else:
            # Log more details for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to decrypt report {report.id} for patient {request.user.patient_profile.id}")
            return Response({
                'success': False,
                'error': 'Failed to decrypt report. The file may be corrupted or the encryption key is invalid.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        # For non-encrypted files, use the existing approach
        serializer = MedicalReportSerializer(report)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': '✓ Verified Safe — Visible only to You'
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_access_logs(request):
    """View access logs for patient's reports"""
    if not hasattr(request.user, 'patient_profile'):
        return Response({
            'success': False,
            'error': 'Unauthorized'
        }, status=status.HTTP_403_FORBIDDEN)
    
    logs = ReportAccessLog.objects.filter(
        report__patient=request.user.patient_profile
    ).select_related('accessed_by_user', 'report')[:100]
    
    serializer = ReportAccessLogSerializer(logs, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })
