from django.contrib import admin
from .models import RiwayatPengaduan

@admin.register(RiwayatPengaduan)
class RiwayatPengaduanAdmin(admin.ModelAdmin):
    list_display = ('pengaduan', 'status', 'waktu_perubahan')
    list_filter = ('status',)
    search_fields = ('pengaduan__kategori',)