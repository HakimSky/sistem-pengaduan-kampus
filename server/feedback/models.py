from django.db import models
from pengaduan.models import Pengaduan  # Menghubungkan dengan model Pengaduan

class Feedback(models.Model):
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE, related_name="feedbacks")
    rating = models.IntegerField(choices=[(1, "Tidak Puas"), (2, "Kurang Puas"), (3, "Cukup"), (4, "Puas"), (5, "Sangat Puas")])
    komentar = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pengaduan.status != "Selesai":
            raise ValueError("Feedback hanya bisa diberikan untuk pengaduan yang sudah selesai.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Feedback {self.rating} untuk Pengaduan {self.pengaduan.id}"