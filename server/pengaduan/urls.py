from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PengaduanViewSet

router = DefaultRouter()
router.register(r'pengaduan', PengaduanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]