from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('pengaduan', 'rating', 'komentar')
    list_filter = ('rating',)
    search_fields = ('pengaduan__kategori',)