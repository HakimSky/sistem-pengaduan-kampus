from django.db import models
from django.contrib.auth.models import User, settings
from pengaduan.models import Pengaduan

class AdminVerifikasi(models.Model):
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ✅ Pakai AUTH_USER_MODEL
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE)
    status_verifikasi = models.CharField(max_length=20, choices=[
        ('Belum Diverifikasi', 'Belum Diverifikasi'),
        ('Diterima', 'Diterima'),
        ('Ditolak', 'Ditolak')
    ])
    catatan_admin = models.TextField(null=True, blank=True)  # Komentar tambahan dari admin
    waktu_verifikasi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin.username} - {self.status_verifikasi} - {self.pengaduan.kategori}"
    
class AdminManajemenAkun(models.Model):
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ✅ Pakai AUTH_USER_MODEL
    pengguna = models.ForeignKey(User, on_delete=models.CASCADE, related_name="akun_dikelola")
    aksi = models.CharField(max_length=50, choices=[
        ('Hapus Akun', 'Hapus Akun'),
        ('Ubah Peran', 'Ubah Peran')
    ])
    waktu_aksi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin.username} - {self.aksi} - {self.pengguna.username}"