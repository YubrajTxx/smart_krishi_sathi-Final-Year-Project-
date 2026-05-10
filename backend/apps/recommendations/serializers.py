from rest_framework import serializers
from .models import RecommendationLog


class PredictionInputSerializer(serializers.Serializer):
    # Soil nutrients
    nitrogen    = serializers.FloatField(min_value=0,   max_value=200)
    phosphorus  = serializers.FloatField(min_value=0,   max_value=200)
    potassium   = serializers.FloatField(min_value=0,   max_value=200)
    ph          = serializers.FloatField(min_value=0,   max_value=14)

    # Climate
    temperature = serializers.FloatField(min_value=-10, max_value=60)
    humidity    = serializers.FloatField(min_value=0,   max_value=100)
    rainfall    = serializers.FloatField(min_value=0,   max_value=5000)

    # Location & farming (must match ordinal encoder categories exactly)
    zone        = serializers.ChoiceField(choices=['Hill', 'Himal', 'Terai'])
    season      = serializers.ChoiceField(choices=['Monsoon', 'Post Monsoon', 'Pre Monsoon', 'Spring', 'Winter'])
    irrigation  = serializers.ChoiceField(choices=['Borewell', 'Canal', 'Drip', 'Pond', 'Pump', 'Rainfed', 'River Lift', 'Sprinkler'])
    soil_type   = serializers.ChoiceField(choices=['Alluvial', 'Clay', 'Clay Loam', 'Loam', 'Sandy', 'Sandy Loam', 'Silt', 'Silty Clay'])


class RecommendationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationLog
        fields = '__all__'
        read_only_fields = ['user', 'recommended_crops', 'date']
