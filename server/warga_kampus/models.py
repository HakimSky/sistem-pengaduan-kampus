# warga_kampus/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class WargaKampus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    no_hp = models.CharField(max_length=20)
    alamat = models.TextField()
    nim = models.CharField(max_length=30, unique=True)
