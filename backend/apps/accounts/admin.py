from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'name', 'role', 'district', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser', 'district')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('name', 'role', 'district', 'language')}),
    )

    def save_model(self, request, obj, form, change):
        # Ensure username is always the same as email for login consistency
        if obj.email:
            obj.username = obj.email
        super().save_model(request, obj, form, change)

admin.site.register(User, CustomUserAdmin)
