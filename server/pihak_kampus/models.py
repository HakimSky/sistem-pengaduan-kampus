from django.db import models

class PihakKampus(models.Model):
    nama_kampus = models.CharField(max_length=255, default="UMS")
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nama_kampus} - {self.department} - {self.position}"