from django.db import models
from warga_kampus.models import User
from pengaduan.models import Pengaduan

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    jabatan = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.jabatan}"

class VerifikasiPengaduan(models.Model):
    pengaduan = models.OneToOneField(Pengaduan, on_delete=models.CASCADE)
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    tanggal_verifikasi = models.DateTimeField(auto_now_add=True)
    catatan = models.TextField(blank=True)
    status_verifikasi = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Verifikasi {self.pengaduan.judul} oleh {self.admin.username}"