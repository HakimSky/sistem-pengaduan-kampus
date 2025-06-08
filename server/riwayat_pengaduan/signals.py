# riwayat_pengaduan/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from pengaduan.models import Pengaduan
from pihak_kampus.models import PihakKampusPengaduan
from riwayat_pengaduan.models import RiwayatPengaduan

@receiver(post_save, sender=Pengaduan)
def buat_riwayat_awal(sender, instance, created, **kwargs):
    # Sinyal ini hanya untuk membuat riwayat saat pengaduan diterima
    if instance.verifikasi == 'Diterima':
        # get_or_create mencegah duplikasi jika sinyal terpicu lebih dari sekali
        RiwayatPengaduan.objects.get_or_create(
            pengaduan=instance,
            defaults={'status': instance.status} # status awal biasanya 'Menunggu' atau 'Diproses'
        )

@receiver(post_save, sender=PihakKampusPengaduan)
def update_status_riwayat(sender, instance, **kwargs):
    # Gunakan update_or_create untuk MENGUPDATE riwayat yang sudah ada
    # atau membuatnya jika belum ada.
    RiwayatPengaduan.objects.update_or_create(
        pengaduan=instance.pengaduan,
        defaults={'status': instance.status_kampus}
    )