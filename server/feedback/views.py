from rest_framework import generics, permissions
from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackListAPIView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'warga_kampus':
            return Feedback.objects.filter(user=user)
        elif user.role == 'pihak_kampus':
            return Feedback.objects.filter(pengaduan__penangan=user)
        return Feedback.objects.none()

class FeedbackDetailAPIView(generics.RetrieveAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]