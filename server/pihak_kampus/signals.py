from django.db.models.signals import post_save
from django.dispatch import receiver
from pihak_kampus.models import PihakKampusPengaduan
from riwayat_pengaduan.models import RiwayatPengaduan

@receiver(post_save, sender=PihakKampusPengaduan)
def update_riwayat_pengaduan(sender, instance, **kwargs):
    RiwayatPengaduan.objects.create(pengaduan=instance.pengaduan, status=instance.status_kampus)