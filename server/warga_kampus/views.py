from rest_framework import viewsets
from .models import WargaKampus
from .serializers import WargaKampusSerializer

class WargaKampusViewSet(viewsets.ModelViewSet):
    queryset = WargaKampus.objects.all()
    serializer_class = WargaKampusSerializer