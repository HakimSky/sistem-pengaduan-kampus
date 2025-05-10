from django.db.models.signals import post_save
from django.dispatch import receiver
from pengaduan.models import Pengaduan
from .models import Notifikasi

@receiver(post_save, sender=Pengaduan)
def buat_notifikasi_pengaduan(sender, instance, created, **kwargs):
    if created:
        Notifikasi.objects.create(
            penerima=instance.pelapor, 
            jenis="Pengaduan",
            pesan=f"Pengaduan '{instance.kategori}' telah dibuat dan sedang menunggu verifikasi."
        )