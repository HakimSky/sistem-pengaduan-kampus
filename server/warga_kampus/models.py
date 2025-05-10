from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class User(AbstractUser):
    ROLE_CHOICES = (
        ('warga_kampus', 'Warga Kampus'),
        ('pihak_kampus', 'Pihak Kampus'),
        ('admin', 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    nim = models.CharField(max_length=20, blank=True, null=True, unique=True)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Nomor telepon harus dalam format: '+628123456789'. Maksimal 15 digit."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class WargaKampusProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fakultas = models.CharField(max_length=100)
    program_studi = models.CharField(max_length=100)
    angkatan = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.user.username} - {self.program_studi}"