# admin_panel/admin.py
from django.contrib import admin
from .models import AdminVerifikasi, AdminManajemenAkun

@admin.register(AdminVerifikasi)
class AdminVerifikasiAdmin(admin.ModelAdmin):
    list_display = (
        'get_pengaduan_id',
        'get_pelapor_username', 
        'get_pengaduan_kategori', 
        'status_verifikasi', 
        'admin_yang_memverifikasi_username', # Menampilkan admin yang melakukan verifikasi
        'waktu_verifikasi'
    )
    list_filter = ('status_verifikasi', 'pengaduan__kategori') # Filter berdasarkan status dan kategori pengaduan
    search_fields = (
        'pengaduan__judul', 
        'pengaduan__deskripsi', 
        'pengaduan__pelapor__user__username', # Cari berdasarkan username pelapor
        'admin_yang_memverifikasi__username' # Cari berdasarkan username admin yang memverifikasi
    )
    readonly_fields = ('waktu_verifikasi',) # Waktu verifikasi tidak bisa diubah manual

    fieldsets = (
        (None, {
            'fields': ('pengaduan_info', 'status_verifikasi', 'catatan_admin')
        }),
        ('Detail Verifikator (Otomatis/Manual)', {
            'fields': ('admin_yang_memverifikasi', 'waktu_verifikasi'),
            'classes': ('collapse',), # Bisa disembunyikan defaultnya
        }),
    )
    # Menampilkan info pengaduan sebagai readonly field di form admin
    readonly_fields = ('pengaduan_info', 'waktu_verifikasi')


    def get_pengaduan_id(self, obj):
        return obj.pengaduan.id
    get_pengaduan_id.short_description = 'ID Pengaduan'
    get_pengaduan_id.admin_order_field = 'pengaduan__id'

    def get_pelapor_username(self, obj):
        if obj.pengaduan and obj.pengaduan.pelapor and hasattr(obj.pengaduan.pelapor, 'user') and obj.pengaduan.pelapor.user:
            return obj.pengaduan.pelapor.user.username
        elif obj.pengaduan and obj.pengaduan.pelapor and hasattr(obj.pengaduan.pelapor, 'nama'):
             return obj.pengaduan.pelapor.nama
        return "-"
    get_pelapor_username.short_description = 'Pelapor'
    get_pelapor_username.admin_order_field = 'pengaduan__pelapor__user__username' # Memungkinkan sorting

    def get_pengaduan_kategori(self, obj):
        if obj.pengaduan:
            if hasattr(obj.pengaduan, 'get_kategori_display'):
                return obj.pengaduan.get_kategori_display()
            elif hasattr(obj.pengaduan.kategori, 'nama'):
                return obj.pengaduan.kategori.nama
            return str(obj.pengaduan.kategori)
        return "-"
    get_pengaduan_kategori.short_description = 'Kategori Pengaduan'
    get_pengaduan_kategori.admin_order_field = 'pengaduan__kategori' # Memungkinkan sorting

    def admin_yang_memverifikasi_username(self, obj):
        if obj.admin_yang_memverifikasi:
            return obj.admin_yang_memverifikasi.username
        return "Belum ada"
    admin_yang_memverifikasi_username.short_description = 'Diverifikasi Oleh'
    admin_yang_memverifikasi_username.admin_order_field = 'admin_yang_memverifikasi__username'

    def pengaduan_info(self, obj):
        # Menampilkan link ke pengaduan terkait atau informasi ringkas
        from django.utils.html import format_html
        from django.urls import reverse

        if obj.pengaduan:
            link = reverse("admin:pengaduan_pengaduan_change", args=[obj.pengaduan.pk])
            return format_html('<b><a href="{}">{} (ID: {})</a></b><br>Pelapor: {}<br>Deskripsi: {}...', 
                               link, 
                               obj.pengaduan.judul if hasattr(obj.pengaduan, 'judul') else "Pengaduan",
                               obj.pengaduan.pk,
                               self.get_pelapor_username(obj),
                               obj.pengaduan.deskripsi[:50] if hasattr(obj.pengaduan, 'deskripsi') else ""
                              )
        return "Tidak ada pengaduan terkait."
    pengaduan_info.short_description = 'Info Pengaduan'

    def save_model(self, request, obj, form, change):
        """
        Saat menyimpan dari admin, set admin_yang_memverifikasi ke user yang sedang login
        jika field tersebut belum diisi atau jika status verifikasi berubah dan bukan 'Belum Diverifikasi'.
        """
        if not obj.admin_yang_memverifikasi and obj.status_verifikasi != 'Belum Diverifikasi':
            obj.admin_yang_memverifikasi = request.user
        elif change and 'status_verifikasi' in form.changed_data and obj.status_verifikasi != 'Belum Diverifikasi':
            # Jika status diubah dari admin dan bukan lagi 'Belum Diverifikasi'
            obj.admin_yang_memverifikasi = request.user
        super().save_model(request, obj, form, change)

@admin.register(AdminManajemenAkun)
class AdminManajemenAkunAdmin(admin.ModelAdmin):
    list_display = ('get_admin_username', 'aksi', 'get_user_dikelola_username', 'waktu_aksi')
    list_filter = ('aksi',)
    search_fields = ('admin__username', 'user_yang_dikelola__username', 'catatan_admin')
    readonly_fields = ('waktu_aksi',)

    def get_admin_username(self, obj):
        return obj.admin.username
    get_admin_username.short_description = 'Admin Pelaksana'
    get_admin_username.admin_order_field = 'admin__username'

    def get_user_dikelola_username(self, obj):
        return obj.user_yang_dikelola.username
    get_user_dikelola_username.short_description = 'User Dikelola'
    get_user_dikelola_username.admin_order_field = 'user_yang_dikelola__username'

    def save_model(self, request, obj, form, change):
        """
        Saat menyimpan dari admin, set field 'admin' ke user yang sedang login
        jika objek baru atau field 'admin' belum diisi.
        """
        if not obj.pk or not obj.admin: # Jika objek baru atau admin belum diset
            obj.admin = request.user
        super().save_model(request, obj, form, change)
