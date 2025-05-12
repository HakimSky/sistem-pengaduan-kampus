from django.db import models
from pengaduan.models import Pengaduan

class RiwayatPengaduan(models.Model):
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE, related_name="riwayat")
    status = models.CharField(max_length=10, choices=[
        ('Menunggu', 'Menunggu'),
        ('Diproses', 'Diproses'),
        ('Selesai', 'Selesai')
    ])
    waktu_perubahan = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pengaduan.kategori} - {self.status} - {self.waktu_perubahan}"