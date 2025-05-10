from django.urls import path
from .views import (
    KategoriPengaduanListAPIView,
    PengaduanListAPIView, PengaduanDetailAPIView
)

urlpatterns = [
    path('kategori/', KategoriPengaduanListAPIView.as_view(), name='kategori-list'),
    path('', PengaduanListAPIView.as_view(), name='pengaduan-list'),
    path('<int:pk>/', PengaduanDetailAPIView.as_view(), name='pengaduan-detail'),
]