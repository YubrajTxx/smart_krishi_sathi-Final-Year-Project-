from rest_framework import serializers
from .models import Crop, CropGuide

class CropGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropGuide
        fields = '__all__'

class CropSerializer(serializers.ModelSerializer):
    guides = CropGuideSerializer(many=True, read_only=True)
    
    class Meta:
        model = Crop
        fields = '__all__'
