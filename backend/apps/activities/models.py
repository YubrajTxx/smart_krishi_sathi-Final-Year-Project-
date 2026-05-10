from django.db import models
from django.conf import settings

class Activity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=50) # Planting, Irrigation, etc.
    crop = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=20, default='Planned') # Planned, Pending, Completed
    reminder_time = models.DateTimeField(null=True, blank=True)
    notified = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.crop} ({self.user.email})"
