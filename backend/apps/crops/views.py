from rest_framework import viewsets, permissions
from .models import Crop
from .serializers import CropSerializer

class CropViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for crops.
    """
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [permissions.AllowAny]
