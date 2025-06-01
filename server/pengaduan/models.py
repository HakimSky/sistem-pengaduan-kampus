# pengaduan/models.py
from django.db import models
from warga_kampus.models import WargaKampus # Pastikan path ini benar

class Pengaduan(models.Model):
    KATEGORI_CHOICES = [
        ('Jalan rusak', 'Jalan rusak'),
        ('Lantai rusak', 'Lantai rusak'),
        ('Fasilitas umum', 'Fasilitas umum'),
        ('Sampah', 'Sampah'),
        ('Lainnya', 'Lainnya'),
        # Tambahkan pilihan lain jika ada
    ]

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
    kategori = models.CharField(
        max_length=100,
        choices=KATEGORI_CHOICES, # Menentukan pilihan yang valid
        default='Lainnya' # Opsional: tentukan nilai default jika perlu
    )
    deskripsi = models.TextField()
    gambar = models.ImageField(upload_to="pengaduan_images/", null=True, blank=True)
    lokasi = models.CharField(max_length=255)
    tanggal_kejadian = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Menunggu', editable=False) # max_length disesuaikan
    verifikasi = models.CharField(max_length=25, choices=VERIFIKASI_CHOICES, default='Belum Diverifikasi', editable=False) # max_length disesuaikan

    def __str__(self):
        return f"{self.get_kategori_display()} - {self.verifikasi} - {self.status}" # Gunakan get_kategori_display()