from django.db import models
from .models import WargaKampus

class Pengaduan(models.Model):
    STATUS_CHOICES = [
        ('Menunggu', 'Menunggu'),
        ('Diproses', 'Diproses'),
        ('Selesai', 'Selesai'),
    ]

    VERIFIKASI_CHOICES = [
        ('Belum Diverifikasi', 'Belum Diverifikasi'),
        ('Diterima', 'Diterima'),
        ('Ditolak', 'Ditolak'),
    ]

    pelapor = models.ForeignKey(WargaKampus, on_delete=models.CASCADE)
    kategori = models.CharField(max_length=100)
    deskripsi = models.TextField()
    gambar = models.ImageField(upload_to="pengaduan_images/", null=True, blank=True)
    lokasi = models.CharField(max_length=255)
    tanggal_kejadian = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Menunggu')
    verifikasi = models.CharField(max_length=20, choices=VERIFIKASI_CHOICES, default='Belum Diverifikasi')

    def __str__(self):
        return f"{self.kategori} - {self.verifikasi} - {self.status}"