from django.urls import path
from .views import (
    DepartmentListAPIView, DepartmentDetailAPIView,
    PihakKampusProfileListAPIView, PihakKampusProfileDetailAPIView
)

urlpatterns = [
    path('departments/', DepartmentListAPIView.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetailAPIView.as_view(), name='department-detail'),
    path('profiles/', PihakKampusProfileListAPIView.as_view(), name='pihak-kampus-profile-list'),
    path('profiles/<int:pk>/', PihakKampusProfileDetailAPIView.as_view(), name='pihak-kampus-profile-detail'),
]