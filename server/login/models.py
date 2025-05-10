from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Warga Kampus', 'Warga Kampus'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Warga Kampus')

class Login(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # ✅ Pakai CustomUser
    last_login = models.DateTimeField(auto_now=True)  # Tambahkan untuk melacak login terakhir

    def __str__(self):
        return self.user.username

class Register(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Gunakan hashing

    def __str__(self):
        return self.user.username