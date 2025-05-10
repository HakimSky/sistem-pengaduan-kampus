from django.db import models

class WargaKampus(models.Model):
    nama = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    no_hp = models.CharField(max_length=15)
    program_studi = models.CharField(max_length=100)
    jenis_kelamin = models.CharField(max_length=10, choices=[('Laki-laki', 'Laki-laki'), ('Perempuan', 'Perempuan')])

    def __str__(self):
        return self.nama
