# pihak_kampus/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PihakKampus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nama_instansi = models.CharField(default="UMS", max_length=100)
