from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from pengaduan.models import Pengaduan
from notifikasi.models import Notifikasi
from pihak_kampus.models import PihakKampusPengaduan

# Helper function untuk mengirim email (sudah benar)
def send_notification_email(notif_instance):
    recipient = notif_instance.penerima
    if not recipient.user.email:
        return

    context = {
        'username': recipient.user.username,
        'jenis_notif': notif_instance.jenis,
        'pesan_notif': notif_instance.pesan,
    }
    html_content = render_to_string('notification_email.html', context)
    text_content = strip_tags(html_content)
    email_subject = f"[EL-Lapor] Notifikasi Baru: {notif_instance.jenis}"
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [recipient.user.email]

    email_message = EmailMultiAlternatives(subject=email_subject, body=text_content, from_email=from_email, to=to_email)
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()


# --- FUNGSI SINYAL PENGADUAN YANG DIGABUNGKAN ---
@receiver(post_save, sender=Pengaduan)
def handle_pengaduan_notifikasi(sender, instance, created, **kwargs):
    """
    Satu fungsi untuk menangani semua notifikasi yang berasal dari model Pengaduan.
    """
    # 1. Jika pengaduan BARU DIBUAT
    if created:
        notif = Notifikasi.objects.create(
            penerima=instance.pelapor, 
            jenis="Pengaduan",
            pesan=f"Pengaduan '{instance.kategori}' Anda telah kami terima dan sedang menunggu verifikasi."
        )
        send_notification_email(notif)
        return # Keluar dari fungsi karena tidak mungkin langsung diverifikasi

    # 2. Jika pengaduan DIUPDATE (bukan baru dibuat)
    if not created:
        # Cek apakah status verifikasi adalah "Diterima"
        if instance.verifikasi == "Diterima":
            # Cek apakah notifikasi verifikasi untuk pengaduan ini belum pernah dikirim
            if not Notifikasi.objects.filter(penerima=instance.pelapor, jenis="Verifikasi", pesan__icontains=f"Pengaduan '{instance.kategori}' telah diverifikasi").exists():
                notif = Notifikasi.objects.create(
                    penerima=instance.pelapor, 
                    jenis="Verifikasi",
                    pesan=f"Pengaduan '{instance.kategori}' telah diverifikasi dan diteruskan ke pihak terkait."
                )
                send_notification_email(notif)

# --- FUNGSI SINYAL UNTUK PENGADUAN SELESAI (TETAP SAMA) ---
@receiver(post_save, sender=PihakKampusPengaduan)
def buat_notifikasi_selesai(sender, instance, **kwargs):
    if instance.status_kampus == "Selesai":
        # Cek untuk menghindari duplikat
        if not Notifikasi.objects.filter(penerima=instance.pengaduan.pelapor, jenis="Sistem", pesan__icontains=f"Pengaduan '{instance.pengaduan.kategori}' telah selesai diproses").exists():
            notif = Notifikasi.objects.create(
                penerima=instance.pengaduan.pelapor, 
                jenis="Sistem",
                pesan=f"Kabar baik! Pengaduan '{instance.pengaduan.kategori}' Anda telah selesai diproses."
            )
            send_notification_email(notif)
