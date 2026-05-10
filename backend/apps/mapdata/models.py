from django.db import models

class LocationStat(models.Model):
    province = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    land_type = models.CharField(max_length=100)
    avg_temp = models.FloatField()
    avg_rainfall = models.FloatField()
    
    def __str__(self):
        return f"{self.district} ({self.province})"
