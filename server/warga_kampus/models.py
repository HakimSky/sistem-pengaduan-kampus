from django.db import models
from login.models import CustomUser  # Import model pengguna

class WargaKampus(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # Hubungkan ke akun pengguna
    nama = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    no_hp = models.CharField(max_length=15)
    program_studi = models.CharField(max_length=100)
    tanggal_lahir = models.DateField(null=True, blank=True)
    jenis_kelamin = models.CharField(max_length=10, choices=[('Laki-laki', 'Laki-laki'), ('Perempuan', 'Perempuan')])

    def __str__(self):
        return self.nama