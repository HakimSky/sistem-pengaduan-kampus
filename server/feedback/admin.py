# feedback/admin.py
from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("pengaduan", "rating", "komentar")
    search_fields = ("pengaduan__kategori", "pengaduan__pelapor__username", "komentar")
    list_filter = ("rating",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Filter feedback yang pengaduannya sudah diverifikasi dan selesai
        return qs.filter(
            pengaduan__verifikasi="Verifikasi",
            pengaduan__status="Selesai"
        )
