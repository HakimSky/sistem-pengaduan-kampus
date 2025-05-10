from django.contrib import admin
from .models import Notifikasi

@admin.register(Notifikasi)
class NotifikasiAdmin(admin.ModelAdmin):
    list_display = ('penerima', 'jenis', 'status_baca', 'waktu_dikirim')
    list_filter = ('jenis', 'status_baca')
    search_fields = ('penerima__nama',)