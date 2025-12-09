from django.contrib import admin
from .models import PatientProfile, SchemeResult, MedicalReport, AIAnalysis, Subscription, HospitalStaff, ReportAccessLog

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'district', 'economic_status', 'disease_type', 'created_at']
    list_filter = ['district', 'economic_status', 'disease_type']
    search_fields = ['user__username', 'user__email', 'district']
    date_hierarchy = 'created_at'

@admin.register(SchemeResult)
class SchemeResultAdmin(admin.ModelAdmin):
    list_display = ['patient', 'scheme_name', 'scheme_type', 'eligibility_score', 'created_at']
    list_filter = ['scheme_type', 'language_output']
    search_fields = ['patient__user__username', 'scheme_name']
    date_hierarchy = 'created_at'

@admin.register(MedicalReport)
class MedicalReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'patient', 'scan_type', 'hospital_name', 'uploaded_date', 'is_analyzed']
    list_filter = ['scan_type', 'is_analyzed', 'uploaded_date']
    search_fields = ['title', 'patient__user__username', 'hospital_name']
    date_hierarchy = 'uploaded_date'

@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ['report', 'risk_level', 'language', 'analyzed_at']
    list_filter = ['risk_level', 'language']
    search_fields = ['report__title', 'patient_summary']
    date_hierarchy = 'analyzed_at'

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_premium', 'status', 'start_date', 'end_date', 'amount_paid', 'ai_analysis_count']
    list_filter = ['is_premium', 'status']
    search_fields = ['user__username', 'user__email', 'payment_id']
    date_hierarchy = 'start_date'

@admin.register(HospitalStaff)
class HospitalStaffAdmin(admin.ModelAdmin):
    list_display = ['staff_name', 'hospital_name', 'license_number', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'hospital_name']
    search_fields = ['staff_name', 'hospital_name', 'license_number']
    actions = ['verify_staff']
    
    def verify_staff(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, "Selected staff verified successfully.")
    verify_staff.short_description = "Verify selected hospital staff"

@admin.register(ReportAccessLog)
class ReportAccessLogAdmin(admin.ModelAdmin):
    list_display = ['accessed_by_user', 'report', 'access_type', 'otp_verified', 'access_granted', 'accessed_at']
    list_filter = ['access_type', 'access_granted', 'otp_verified']
    search_fields = ['accessed_by_user__username', 'report__title']
    date_hierarchy = 'accessed_at'
    readonly_fields = ['accessed_at']
