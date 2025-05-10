from django.contrib import admin
from .models import KategoriPengaduan, Pengaduan, LampiranPengaduan

class LampiranPengaduanInline(admin.TabularInline):
    model = LampiranPengaduan
    extra = 1

class PengaduanAdmin(admin.ModelAdmin):
    list_display = ('judul', 'pelapor', 'kategori', 'status', 'prioritas', 'tanggal_dibuat')
    list_filter = ('status', 'kategori', 'prioritas', 'tanggal_dibuat')
    search_fields = ('judul', 'uraian', 'pelapor__username')
    inlines = [LampiranPengaduanInline]
    readonly_fields = ('tanggal_dibuat', 'tanggal_diperbarui', 'tanggal_verifikasi', 'tanggal_penanganan', 'tanggal_selesai')
    
    fieldsets = (
        (None, {
            'fields': ('judul', 'pelapor', 'kategori', 'uraian')
        }),
        ('Detail Kejadian', {
            'fields': ('tanggal_kejadian', 'lokasi')
        }),
        ('Status dan Penanganan', {
            'fields': ('status', 'prioritas', 'pihak_terkait', 'penangan')
        }),
        ('Timestamps', {
            'fields': ('tanggal_dibuat', 'tanggal_diperbarui', 'tanggal_verifikasi', 'tanggal_penanganan', 'tanggal_selesai'),
            'classes': ('collapse',)
        }),
    )

admin.site.register(KategoriPengaduan)
admin.site.register(Pengaduan, PengaduanAdmin)