from django.db.models.signals import post_save
from django.dispatch import receiver
from pengaduan.models import Pengaduan
from pihak_kampus.models import PihakKampusPengaduan
from riwayat_pengaduan.models import RiwayatPengaduan

@receiver(post_save, sender=Pengaduan)
def buat_riwayat_pengaduan(sender, instance, created, **kwargs):
    if instance.verifikasi == 'Diterima' and not instance.riwayat.exists():
        RiwayatPengaduan.objects.create(pengaduan=instance, status=instance.status)


@receiver(post_save, sender=PihakKampusPengaduan)
def update_riwayat_pengaduan(sender, instance, **kwargs):
    RiwayatPengaduan.objects.create(pengaduan=instance.pengaduan, status=instance.status_kampus)
