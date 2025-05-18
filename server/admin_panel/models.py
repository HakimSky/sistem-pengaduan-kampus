from django.db import models
from django.contrib.auth.models import User
from pengaduan.models import Pengaduan

class AdminVerifikasi(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE)  # User yang berperan sebagai admin
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE)
    status_verifikasi = models.CharField(max_length=20, choices=[
        ('Belum Diverifikasi', 'Belum Diverifikasi'),
        ('Diterima', 'Diterima'),
        ('Ditolak', 'Ditolak')
    ])
    catatan_admin = models.TextField(null=True, blank=True)  # Komentar tambahan dari admin
    waktu_verifikasi = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # update field 'verifikasi' pada objek pengaduan yang terkait
        self.pengaduan.verifikasi = self.status_verifikasi
        self.pengaduan.save()

    def __str__(self):
        return f"{self.admin.username} - {self.status_verifikasi} - {self.pengaduan.kategori}"
    
class AdminManajemenAkun(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    user_yang_dikelola = models.ForeignKey(User, on_delete=models.CASCADE, related_name='akun_dikelola')
    aksi = models.CharField(max_length=50, choices=[
        ('Nonaktifkan Akun', 'Nonaktifkan Akun'),
        ('Aktifkan Akun', 'Aktifkan Akun'),
        ('Hapus Akun', 'Hapus Akun')
    ])
    waktu_aksi = models.DateTimeField(auto_now_add=True)
    catatan_admin = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Jalankan aksi manajemen akun
        if self.aksi == 'Hapus Akun':
            self.user_yang_dikelola.delete()
        elif self.aksi == 'Nonaktifkan Akun':
            self.user_yang_dikelola.is_active = False
            self.user_yang_dikelola.save()
        elif self.aksi == 'Aktifkan Akun':
            self.user_yang_dikelola.is_active = True
            self.user_yang_dikelola.save()

    def __str__(self):
        return f"{self.admin.username} - {self.aksi} - {self.user_yang_dikelola.username}"
