from django.db.models.signals import post_save
from django.dispatch import receiver
from pengaduan.models import Pengaduan
from riwayat_pengaduan.models import RiwayatPengaduan

@receiver(post_save, sender=Pengaduan)
def buat_riwayat_pengaduan(sender, instance, **kwargs):
    if instance.verifikasi == 'Diterima':  # Hanya pengaduan yang diverifikasi
        RiwayatPengaduan.objects.create(pengaduan=instance, status=instance.status)