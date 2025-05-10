from django.urls import path
from .views import FeedbackListAPIView, FeedbackDetailAPIView

urlpatterns = [
    path('', FeedbackListAPIView.as_view(), name='feedback-list'),
    path('<int:pk>/', FeedbackDetailAPIView.as_view(), name='feedback-detail'),
]