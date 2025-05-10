from django.db import models

class Login(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)  # Disarankan untuk menggunakan hashing dalam penyimpanan password

    def __str__(self):
        return self.username

class Register(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True)
    number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Sama seperti di Login, password sebaiknya di-hash

    def __str__(self):
        return self.username