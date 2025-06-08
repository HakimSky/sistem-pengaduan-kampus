# File: riwayat_pengaduan/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RiwayatPengaduanViewSet, RiwayatByUserView

router = DefaultRouter()
# Daftarkan dengan path KOSONG
router.register(r'', RiwayatPengaduanViewSet, basename='riwayat-pengaduan')

urlpatterns = [
    path('', include(router.urls)),
    path('by-user/<int:user_id>/', RiwayatByUserView.as_view(), name='riwayat-by-user'),
]