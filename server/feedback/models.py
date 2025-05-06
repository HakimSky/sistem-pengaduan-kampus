# feedback/models.py
from django.db import models
from pengaduan.models import Pengaduan
from warga_kampus.models import WargaKampus

class Feedback(models.Model):
    pengaduan = models.OneToOneField(Pengaduan, on_delete=models.CASCADE)
    warga_kampus = models.ForeignKey(WargaKampus, on_delete=models.CASCADE)
    komentar = models.TextField()
    rating = models.IntegerField()  # Skala 1-5
    tanggal_dibuat = models.DateTimeField(auto_now_add=True)
