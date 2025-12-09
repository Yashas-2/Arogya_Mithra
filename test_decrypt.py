import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arogyamitra.settings')
django.setup()

from core.models import MedicalReport
from cryptography.fernet import Fernet

# Get the first report
report = MedicalReport.objects.first()
if not report:
    print("No reports found")
    sys.exit(1)

print(f"Report ID: {report.id}")
print(f"Report Title: {report.title}")
print(f"File Path: {report.report_file.path}")
print(f"Is Encrypted: {report.is_encrypted}")
print(f"Encryption Key: {report.encrypted_file_key}")

if report.is_encrypted and report.encrypted_file_key:
    try:
        # Try to decrypt
        f = Fernet(report.encrypted_file_key.encode())
        with open(report.report_file.path, 'rb') as file:
            encrypted_content = file.read()
        print(f"Encrypted content length: {len(encrypted_content)}")
        
        decrypted_content = f.decrypt(encrypted_content)
        print(f"Decrypted content length: {len(decrypted_content)}")
        print("Decryption successful!")
    except Exception as e:
        print(f"Decryption failed: {str(e)}")
else:
    print("Report is not encrypted or missing encryption key")