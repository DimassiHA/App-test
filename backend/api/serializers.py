from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'phone_number', 'region', 'birth_date', 'is_app_admin']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_app_admin': {'read_only': True},  # Prevent non-superusers from setting this field
        }

    def create(self, validated_data):
        # Access the request object from the context
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request object not found in context.")

        # Only superusers can set is_app_admin
        if request.user.is_superuser:
            validated_data['is_app_admin'] = validated_data.get('is_app_admin', False)
        else:
            validated_data['is_app_admin'] = False 

        user = CustomUser.objects.create_user(**validated_data)
        return user