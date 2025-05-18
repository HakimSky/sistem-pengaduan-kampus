from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RiwayatPengaduanViewSet

router = DefaultRouter()
router.register(r'riwayat-pengaduan', RiwayatPengaduanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]