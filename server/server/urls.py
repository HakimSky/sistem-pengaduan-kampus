from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from django.conf.urls.static import static

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'warga-kampus': request.build_absolute_uri('/api/warga-kampus/'),
        'pihak-kampus': request.build_absolute_uri('/api/pihak-kampus/'),
        'pengaduan': request.build_absolute_uri('/api/pengaduan/'),
        'notifikasi': request.build_absolute_uri('/api/notifikasi/'),
        'riwayat-pengaduan': request.build_absolute_uri('/api/riwayat-pengaduan/'),
        'login': request.build_absolute_uri('/api/login/'),
        'feedback': request.build_absolute_uri('/api/feedback/'),
        'admin': request.build_absolute_uri('/api/admin/'),
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),  # Menampilkan daftar API saat /api/ dikunjungi
    path('api/warga-kampus/', include('warga_kampus.urls')),
    path('api/pihak-kampus/', include('pihak_kampus.urls')),
    path('api/pengaduan/', include('pengaduan.urls')),
    path('api/notifikasi/', include('notifikasi.urls')),
    path('api/riwayat-pengaduan/', include('riwayat_pengaduan.urls')),
    path('api/login/', include('login.urls')),
    path('api/feedback/', include('feedback.urls')),
    path('api/admin/', include('admin_panel.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)