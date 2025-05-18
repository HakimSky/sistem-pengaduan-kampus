from django.db import models
from django.contrib.auth.models import User

class Login(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    password = models.CharField(max_length=255)  # Password harus disimpan dengan hashing

    def __str__(self):
        return self.user.username

class Register(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True)
    number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Sama seperti di Login, password sebaiknya di-hash

    def __str__(self):
        return self.username