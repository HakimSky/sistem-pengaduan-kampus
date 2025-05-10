from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AdminProfileListAPIView, VerifikasiPengaduanViewSet  # Ganti yang diimport

router = DefaultRouter()
router.register(r'verifikasi', VerifikasiPengaduanViewSet, basename='verifikasi')

urlpatterns = [
    path('profiles/', AdminProfileListAPIView.as_view(), name='admin-profile-list'),
] + router.urls