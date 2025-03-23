from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Add custom fields to both Access & Refresh tokens
        token['is_superuser'] = user.is_superuser
        token['is_app_admin'] = user.is_app_admin

        return token
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'phone_number', 'region', 'birth_date', 'is_app_admin']
        extra_kwargs = {
            'password': {'write_only': True},
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