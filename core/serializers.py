from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PatientProfile, SchemeResult, MedicalReport, AIAnalysis, Subscription, HospitalStaff, ReportAccessLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = '__all__'

class SchemeResultSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    
    class Meta:
        model = SchemeResult
        fields = '__all__'

class MedicalReportSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalReport
        fields = '__all__'
    
    def get_file_url(self, obj):
        if obj.report_file:
            return obj.report_file.url
        return None

class AIAnalysisSerializer(serializers.ModelSerializer):
    report_title = serializers.CharField(source='report.title', read_only=True)
    
    class Meta:
        model = AIAnalysis
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    is_active_sub = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = '__all__'
    
    def get_is_active_sub(self, obj):
        return obj.is_active()

class SchemeCheckRequestSerializer(serializers.Serializer):
    age = serializers.IntegerField(min_value=1, max_value=120)
    district = serializers.CharField(max_length=100)
    economic_status = serializers.ChoiceField(choices=['APL', 'BPL'])
    has_ration_card = serializers.BooleanField()
    has_aadhaar = serializers.BooleanField()
    disease_type = serializers.CharField(max_length=50)
    language = serializers.CharField(max_length=20, default='English')

class ReportAnalysisRequestSerializer(serializers.Serializer):
    report_id = serializers.IntegerField()
    language = serializers.CharField(max_length=20, default='English')

class HospitalStaffSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = HospitalStaff
        fields = ['id', 'username', 'staff_name', 'hospital_name', 'department', 'license_number', 'is_verified', 'created_at']
        read_only_fields = ['is_verified']

class HospitalReportUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    scan_type = serializers.CharField(max_length=50)
    hospital_name = serializers.CharField(max_length=255, required=False)
    test_date = serializers.DateField(required=False)
    report_file = serializers.FileField()
    # Patient mapping fields
    patient_phone = serializers.CharField(max_length=15)
    patient_aadhaar_last4 = serializers.CharField(max_length=4, required=False)

class OTPVerificationSerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6)

class OTPRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)

class ReportAccessLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='accessed_by_user.username', read_only=True)
    report_title = serializers.CharField(source='report.title', read_only=True)
    
    class Meta:
        model = ReportAccessLog
        fields = ['id', 'username', 'report_title', 'access_type', 'otp_verified', 'access_granted', 'accessed_at']
