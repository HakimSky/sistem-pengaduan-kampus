from django.apps import AppConfig


class NotifikasiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifikasi'

    def ready(self):
        import notifikasi.signals  # Menghubungkan signals saat app di-load

