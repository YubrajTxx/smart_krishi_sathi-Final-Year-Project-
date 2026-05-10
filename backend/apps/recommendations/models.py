from django.db import models
from django.conf import settings


class RecommendationLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Soil nutrients
    nitrogen   = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium  = models.FloatField(null=True, blank=True)
    ph         = models.FloatField(null=True, blank=True)

    # Climate
    temperature = models.FloatField(null=True, blank=True)
    humidity    = models.FloatField(null=True, blank=True)
    rainfall    = models.FloatField(null=True, blank=True)

    # Location & farming
    zone       = models.CharField(max_length=50, null=True, blank=True)
    season     = models.CharField(max_length=50, null=True, blank=True)
    irrigation = models.CharField(max_length=50, null=True, blank=True)
    soil_type  = models.CharField(max_length=50, null=True, blank=True)

    # Results (top-3 crops with scores)
    recommended_crops = models.JSONField()

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Prediction by {self.user.email} on {self.date:%Y-%m-%d %H:%M}"
