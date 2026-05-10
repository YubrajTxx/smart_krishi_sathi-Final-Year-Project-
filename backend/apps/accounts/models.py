from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True) 
    role = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('farmer', 'Farmer')], default='farmer')
    district = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=10, default='en')
    phone = models.CharField(max_length=20, blank=True, unique=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    banner_image = models.ImageField(upload_to='banners/', null=True, blank=True)
    timezone = models.CharField(max_length=100, default='Asia/Kathmandu')
    date_format = models.CharField(max_length=20, default='DD/MM/YYYY')
    
    def save(self, *args, **kwargs):
        if self.role == 'admin':
            self.is_staff = True
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email or self.username

# Removed FarmerProfile as per strict schema request
