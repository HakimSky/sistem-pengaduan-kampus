# Generated by Django 5.2 on 2025-06-01 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pengaduan', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pengaduan',
            name='kategori',
            field=models.CharField(choices=[('Jalan rusak', 'Jalan rusak'), ('Lantai rusak', 'Lantai rusak'), ('Fasilitas umum', 'Fasilitas umum'), ('Sampah', 'Sampah'), ('Lainnya', 'Lainnya')], default='Lainnya', max_length=100),
        ),
        migrations.AlterField(
            model_name='pengaduan',
            name='status',
            field=models.CharField(choices=[('Menunggu', 'Menunggu'), ('Diproses', 'Diproses'), ('Selesai', 'Selesai')], default='Menunggu', editable=False, max_length=20),
        ),
        migrations.AlterField(
            model_name='pengaduan',
            name='verifikasi',
            field=models.CharField(choices=[('Belum Diverifikasi', 'Belum Diverifikasi'), ('Diterima', 'Diterima'), ('Ditolak', 'Ditolak')], default='Belum Diverifikasi', editable=False, max_length=25),
        ),
    ]
