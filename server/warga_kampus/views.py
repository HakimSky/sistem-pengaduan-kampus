from rest_framework import viewsets
from .models import WargaKampus
from .serializers import WargaKampusSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class WargaKampusViewSet(viewsets.ModelViewSet):
    queryset = WargaKampus.objects.all()
    serializer_class = WargaKampusSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = WargaKampus.objects.get(user=request.user)
        serializer = WargaKampusSerializer(profile)
        return Response(serializer.data)