from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PihakKampusViewSet, PihakKampusPengaduanViewSet

router = DefaultRouter()
router.register(r'pihak-kampus', PihakKampusViewSet)
router.register(r'pihak-kampus-pengaduan', PihakKampusPengaduanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]