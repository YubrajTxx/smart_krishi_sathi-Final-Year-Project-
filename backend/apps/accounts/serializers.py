from rest_framework import serializers
from django.contrib.auth import get_user_model


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'password', 'role', 'district', 'language', 'phone', 'profile_image', 'banner_image', 'timezone', 'date_format']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'email': {'error_messages': {'unique': 'This email is already in use.'}},
            'phone': {'error_messages': {'unique': 'This phone number is already in use.'}}
        }

    def validate_password(self, value):
        import re
        if len(value) < 10:
            raise serializers.ValidationError("Password must be at least 10 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        return user
