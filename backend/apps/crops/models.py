from django.db import models

class Crop(models.Model):
    crop_name_en = models.CharField(max_length=100)
    crop_name_np = models.CharField(max_length=100, blank=True)
    season = models.CharField(max_length=100)
    water_requirement = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image_path = models.ImageField(upload_to='crops/', blank=True, null=True)

    def __str__(self):
        return self.crop_name_en

class CropGuide(models.Model):
    crop_id = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='guides')
    soil_preparation = models.TextField()
    sowing_method = models.TextField()
    disease_info = models.TextField()
    harvest_time = models.CharField(max_length=100)

    def __str__(self):
        return f"Guide for {self.crop_id.crop_name_en}"
