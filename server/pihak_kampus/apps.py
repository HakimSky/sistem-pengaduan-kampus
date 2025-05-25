from django.apps import AppConfig


class PihakKampusConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pihak_kampus'

    def ready(self):
        import pihak_kampus.signals  # Menghubungkan signals saat app di-load
