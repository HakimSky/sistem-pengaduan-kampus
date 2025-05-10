from django.apps import AppConfig


class RiwayatPengaduanConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'riwayat_pengaduan'

    def ready(self):
        import notifikasi.signals  # Menghubungkan signals saat app di-load

