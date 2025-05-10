from django.db import models
from pengaduan.models import Pengaduan

class PihakKampus(models.Model):
    nama_kampus = models.CharField(max_length=255, default="UMS")
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nama_kampus} - {self.department} - {self.position}"

class PihakKampusPengaduan(models.Model):
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE)
    pihak_kampus = models.ForeignKey(PihakKampus, on_delete=models.CASCADE)
    status_kampus = models.CharField(max_length=10, choices=[
        ('Menunggu', 'Menunggu'),
        ('Diproses', 'Diproses'),
        ('Selesai', 'Selesai'),
    ], default='Menunggu')

    def __str__(self):
        return f"{self.pengaduan.kategori} - {self.status_kampus}"