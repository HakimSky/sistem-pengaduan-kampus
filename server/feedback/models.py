from django.db import models
from pengaduan.models import Pengaduan
from warga_kampus.models import User

class Feedback(models.Model):
    RATING_CHOICES = (
        (1, 'Sangat Tidak Puas'),
        (2, 'Tidak Puas'),
        (3, 'Netral'),
        (4, 'Puas'),
        (5, 'Sangat Puas'),
    )
    
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks_diberikan')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    komentar = models.TextField()
    tanggal_dibuat = models.DateTimeField(auto_now_add=True)
    tanggal_diperbarui = models.DateTimeField(auto_now=True)
    dibaca = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Feedback untuk {self.pengaduan.judul} oleh {self.user.username}"
    
    class Meta:
        verbose_name_plural = 'Feedback'