from django.urls import path
from . import views, views_secure

urlpatterns = [
    # Template views
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('hospital-dashboard/', views.hospital_dashboard_view, name='hospital_dashboard'),
    path('scheme-checker/', views.scheme_checker_view, name='scheme_checker'),
    path('report-vault/', views.report_vault_view, name='report_vault'),
    path('report-analysis/', views.report_analysis_view, name='report_analysis'),
    path('premium/', views.premium_view, name='premium'),
    
    # Authentication APIs
    path('api/auth/patient-login/', views_secure.patient_login, name='patient_login'),
    path('api/auth/hospital-login/', views_secure.hospital_staff_login, name='hospital_login'),
    path('api/auth/register-patient/', views_secure.register_patient, name='register_patient'),
    path('api/auth/register-hospital/', views_secure.register_hospital_staff, name='register_hospital'),
    path('api/auth/logout/', views_secure.user_logout, name='user_logout'),
    path('api/auth/refresh-token/', views_secure.refresh_token, name='refresh_token'),
    
    # Hospital Staff APIs (RBAC Protected)
    path('api/hospital/upload-report/', views_secure.hospital_upload_report, name='hospital_upload'),
    path('api/hospital/upload-history/', views_secure.hospital_upload_history, name='hospital_history'),
    
    # Patient OTP & Report Access APIs (RBAC Protected)
    path('api/patient/request-otp/', views_secure.request_otp, name='request_otp'),
    path('api/patient/verify-otp/', views_secure.verify_otp, name='verify_otp'),
    path('api/patient/reports/', views_secure.patient_get_reports, name='patient_reports'),
    path('api/patient/report/<int:report_id>/', views_secure.patient_view_report, name='patient_view_report'),
    path('api/patient/access-logs/', views_secure.patient_access_logs, name='patient_access_logs'),
    
    # Legacy/Existing APIs
    path('api/check-eligibility/', views.check_scheme_eligibility, name='api_check_eligibility'),
    path('api/upload-report/', views.upload_medical_report, name='api_upload_report'),  # DEPRECATED
    path('api/reports/', views.get_medical_reports, name='api_get_reports'),
    path('api/analyze-report/', views.analyze_medical_report, name='api_analyze_report'),
    path('api/subscription/', views.get_subscription_status, name='api_subscription_status'),
    path('api/upgrade-premium/', views.upgrade_to_premium, name='api_upgrade_premium'),
]
