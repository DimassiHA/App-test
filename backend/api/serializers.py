from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser ,Client ,ServiceOwner, ServicePicture
from django.contrib.auth.hashers import make_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom fields to both Access & Refresh tokens
        token['is_superuser'] = user.is_superuser
        token['is_app_admin'] = user.is_app_admin

        return token

class CustomTokenObtainPairSerializer(MyTokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = user.user_type
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_type'] = self.user.user_type
        return data
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
    
class CustomUserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'phone_number', 'region', 'birth_date']

class ClientProfileSerializer(serializers.ModelSerializer):
    user = CustomUserBaseSerializer()
    class Meta:
        model = Client
        fields = ['user', 'gender', 'profile_picture']


class CustomUserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'phone_number', 'region', 'birth_date']
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create(**validated_data)
        user.password = make_password(password)
        user.save()
        return user

class ServicePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePicture
        fields = ['image', 'uploaded_at'] 
class ServiceOwnerProfileSerializer(serializers.ModelSerializer):
    user = CustomUserBaseSerializer()  # Nested serializer for user fields
    service_pictures = ServicePictureSerializer(many=True, read_only=True)  # Serialize related service pictures

    class Meta:
        model = ServiceOwner
        fields = ['user', 'business_name', 'profile_picture', 'description', 'service_pictures']


class ClientRegisterSerializer(serializers.ModelSerializer):
    gender = serializers.ChoiceField(choices=(('male', 'Male'), ('female', 'Female')),write_only=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name','username', 'email', 'password', 'phone_number',"region","birth_date","gender",'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        gender = validated_data.pop('gender')  # Extract gender for Client model
        profile_picture = validated_data.pop('profile_picture', None)
        user = CustomUser.objects.create_user(**validated_data, user_type='client')
        Client.objects.create(user=user, gender=gender , profile_picture=profile_picture)  # Create associated Client profile
        return user

class ServiceOwnerRegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    business_name = serializers.CharField()
    description = serializers.CharField()
    service_pictures = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True
    )
    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'username', 'email', 'password', 
            'phone_number', 'region', 'birth_date', 'profile_picture', 
            'business_name', 'description', 'service_pictures'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate_service_pictures(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("At least one service picture is required.")
        return value

    def create(self, validated_data):
        profile_picture = validated_data.pop('profile_picture', None)
        business_name = validated_data.pop('business_name')
        description = validated_data.pop('description')
        service_pictures = validated_data.pop('service_pictures')
        
        # Create the User and ServiceOwner
        user = CustomUser.objects.create_user(**validated_data, user_type='service_owner')
        service_owner = ServiceOwner.objects.create(
            user=user, 
            profile_picture=profile_picture, 
            business_name=business_name,
            description=description
        ) 
        # Save service pictures
        for picture in service_pictures:
            ServicePicture.objects.create(service_owner=service_owner, image=picture)
        
        return user
class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        
        try:
            user = CustomUser.objects.get(username=username)  
            if not user.check_password(password):
                raise serializers.ValidationError('Invalid password')
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('User does not exist')

        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

class PasswordResetChangeSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)