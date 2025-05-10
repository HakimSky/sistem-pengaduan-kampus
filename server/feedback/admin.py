from django.contrib import admin
from .models import Feedback

class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('pengaduan', 'user', 'rating', 'tanggal_dibuat', 'dibaca')
    list_filter = ('rating', 'dibaca', 'tanggal_dibuat')
    search_fields = ('pengaduan__judul', 'user__username', 'komentar')
    readonly_fields = ('tanggal_dibuat', 'tanggal_diperbarui')
    
    fieldsets = (
        (None, {
            'fields': ('pengaduan', 'user', 'rating', 'komentar')
        }),
        ('Status', {
            'fields': ('dibaca',)
        }),
        ('Timestamps', {
            'fields': ('tanggal_dibuat', 'tanggal_diperbarui'),
            'classes': ('collapse',)
        }),
    )

admin.site.register(Feedback, FeedbackAdmin)