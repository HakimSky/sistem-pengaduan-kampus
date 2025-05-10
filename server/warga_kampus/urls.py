from django.urls import path
from .views import (
    UserListAPIView, UserDetailAPIView,
    WargaKampusProfileListAPIView, WargaKampusProfileDetailAPIView
)

urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),
    path('profiles/', WargaKampusProfileListAPIView.as_view(), name='profile-list'),
    path('profiles/<int:pk>/', WargaKampusProfileDetailAPIView.as_view(), name='profile-detail'),
]