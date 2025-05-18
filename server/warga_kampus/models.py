from django.db import models
from django.contrib.auth.models import User

class WargaKampus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nama = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    no_hp = models.CharField(max_length=15)
    program_studi = models.CharField(max_length=100)
    jenis_kelamin = models.CharField(max_length=10, choices=[('Laki-laki', 'Laki-laki'), ('Perempuan', 'Perempuan')])

    def __str__(self):
        return self.nama
