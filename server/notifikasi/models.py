from django.db import models
from warga_kampus.models import WargaKampus

class Notifikasi(models.Model):
    penerima = models.ForeignKey(WargaKampus, on_delete=models.CASCADE, related_name="notifikasis")
    jenis = models.CharField(max_length=50, choices=[
        ('Pengaduan', 'Pengaduan'),
        ('Verifikasi', 'Verifikasi'),
        ('Sistem', 'Sistem'),
    ])
    pesan = models.TextField()
    status_baca = models.BooleanField(default=False)  # False = belum dibaca, True = sudah dibaca
    waktu_dikirim = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.penerima.nama} - {self.jenis} - {'Sudah Dibaca' if self.status_baca else 'Belum Dibaca'}"