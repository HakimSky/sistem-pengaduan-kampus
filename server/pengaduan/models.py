from django.db import models
from warga_kampus.models import User
from pihak_kampus.models import Department
from django.utils import timezone

class KategoriPengaduan(models.Model):
    nama = models.CharField(max_length=100)
    deskripsi = models.TextField()
    
    def __str__(self):
        return self.nama

class Pengaduan(models.Model):
    STATUS_CHOICES = (
        ('menunggu', 'Menunggu Verifikasi'),
        ('diverifikasi', 'Terverifikasi'),
        ('diproses', 'Sedang Diproses'),
        ('selesai', 'Selesai'),
        ('ditolak', 'Ditolak'),
    )
    
    PRIORITY_CHOICES = (
        ('rendah', 'Rendah'),
        ('sedang', 'Sedang'),
        ('tinggi', 'Tinggi'),
    )
    
    judul = models.CharField(max_length=200)
    pelapor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pengaduan_diajukan')
    kategori = models.ForeignKey(KategoriPengaduan, on_delete=models.SET_NULL, null=True)
    uraian = models.TextField()
    tanggal_kejadian = models.DateField()
    lokasi = models.CharField(max_length=200)
    tanggal_dibuat = models.DateTimeField(auto_now_add=True)
    tanggal_diperbarui = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='menunggu')
    prioritas = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='sedang')
    pihak_terkait = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    penangan = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='pengaduan_ditangani')
    tanggal_verifikasi = models.DateTimeField(null=True, blank=True)
    tanggal_penanganan = models.DateTimeField(null=True, blank=True)
    tanggal_selesai = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.judul} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        if self.pk:
            original = Pengaduan.objects.get(pk=self.pk)
            if original.status != self.status:
                if self.status == 'diverifikasi':
                    self.tanggal_verifikasi = timezone.now()
                elif self.status == 'diproses':
                    self.tanggal_penanganan = timezone.now()
                elif self.status == 'selesai':
                    self.tanggal_selesai = timezone.now()
        super().save(*args, **kwargs)

class LampiranPengaduan(models.Model):
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE, related_name='lampiran')
    file = models.FileField(upload_to='lampiran_pengaduan/')
    deskripsi = models.CharField(max_length=255, blank=True)
    tanggal_upload = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Lampiran untuk {self.pengaduan.judul}"