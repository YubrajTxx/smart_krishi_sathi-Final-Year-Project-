from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'type', 'crop', 'date', 'status', 'reminder_time', 'notified', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']
