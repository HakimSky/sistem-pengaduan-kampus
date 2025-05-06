# pengaduan/models.py
from django.db import models
from warga_kampus.models import WargaKampus
from pihak_kampus.models import PihakKampus
from django.contrib.auth import get_user_model

KATEGORI_CHOICES = [
    ('fasilitas', 'Fasilitas Kampus'),
    ('keamanan', 'Keamanan & Lingkungan'),
    ('kebersihan', 'Kebersihan & Kesehatan'),
]

STATUS_CHOICES = [
    ('belum', 'Belum Diproses'),
    ('proses', 'Dalam Proses'),
    ('selesai', 'Selesai'),
]

class Pengaduan(models.Model):
    warga_kampus = models.ForeignKey(WargaKampus, on_delete=models.CASCADE)
    kategori = models.CharField(max_length=20, choices=KATEGORI_CHOICES)
    judul = models.CharField(max_length=255)
    uraian = models.TextField()
    tanggal_kejadian = models.DateField()
    lokasi_kejadian = models.CharField(max_length=255)
    pihak_terlapor = models.CharField(default="UMS", max_length=100)
    bukti_pendukung = models.TextField(blank=True)
    file_lampiran = models.FileField(upload_to='lampiran/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='belum')
    tanggal_dibuat = models.DateTimeField(auto_now_add=True)
    diverifikasi = models.BooleanField(default=False)

class Notifikasi(models.Model):
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE, related_name="notifikasi")
    penerima_user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    pesan = models.TextField()
    waktu_dikirim = models.DateTimeField(auto_now_add=True)
    sudah_dibaca = models.BooleanField(default=False)
