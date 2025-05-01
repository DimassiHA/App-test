from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser ,Client ,ServiceOwner, ServicePicture , EventType , Event
from django.contrib.auth.hashers import make_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = user.user_type
        token['is_superuser'] = user.is_superuser
        token['is_app_admin'] = user.user_type in ['admin', 'superuser']
        return token

class CustomTokenObtainPairSerializer(MyTokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = user.user_type
        
        if user.user_type == 'service_owner':
            try:
                service_owner = user.service_owner_profile
                token['service_owner_status'] = service_owner.status
                if service_owner.status == 'rejected':
                    token['rejection_reason'] = service_owner.rejection_reason
            except ServiceOwner.DoesNotExist:
                pass
                
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        if user.user_type == 'service_owner':
            try:
                service_owner = user.service_owner_profile
                if service_owner.status == 'pending':
                    raise serializers.ValidationError(
                        'Your account is pending approval. Please wait for admin approval.'
                    )
                elif service_owner.status == 'rejected':
                    rejection_reason = service_owner.rejection_reason or "No reason provided"
                    raise serializers.ValidationError(
                        f'Your account has been rejected. Reason: {rejection_reason}. Please contact support.'
                    )
            except ServiceOwner.DoesNotExist:
                raise serializers.ValidationError('Service owner profile not found')
        
        data['user_type'] = user.user_type
        return data


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'phone_number', 'region', 'birth_date', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user_type = validated_data.get('user_type', 'client')

        # Create the user
        user = CustomUser.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()

        return user
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.region = validated_data.get('region', instance.region)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.save()
        return instance

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
    user = CustomUserBaseSerializer()
    service_pictures = ServicePictureSerializer(many=True, read_only=True)
    event_types = EventTypeSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceOwner
        fields = ['id', 'user', 'business_name', 'profile_picture', 
                 'description', 'service_pictures', 'event_types', 'status']


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
    event_types = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=EventType.objects.all(),
        required=True
    )

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'username', 'email', 'password',
            'phone_number', 'region', 'birth_date', 'profile_picture',
            'business_name', 'description', 'service_pictures', 'event_types'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate_event_types(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("At least one event type is required.")
        return value

    def create(self, validated_data):
        print("Received data:", validated_data.keys())
        profile_picture = validated_data.pop('profile_picture', None)
        business_name = validated_data.pop('business_name')
        description = validated_data.pop('description')
        service_pictures = validated_data.pop('service_pictures')
        event_types = validated_data.pop('event_types')
        user = CustomUser.objects.create_user(**validated_data, user_type='service_owner')
        service_owner = ServiceOwner.objects.create(
            user=user,
            profile_picture=profile_picture,
            business_name=business_name,
            description=description,
            status='pending'
        )
        service_owner.event_types.set(event_types)
        
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
            
            if user.user_type == 'service_owner':
                try:
                    service_owner = user.service_owner_profile
                    if service_owner.status == 'pending':
                        raise serializers.ValidationError(
                            'Your account is pending approval. Please wait for admin approval.'
                        )
                    elif service_owner.status == 'rejected':
                        rejection_reason = service_owner.rejection_reason or "No reason provided"
                        raise serializers.ValidationError(
                            f'Your account has been rejected. Reason: {rejection_reason}. Please contact support.'
                        )
                except ServiceOwner.DoesNotExist:
                    raise serializers.ValidationError('Service owner profile not found')
                
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



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'location', 'description', 
                 'event_type', 'budget', 'guests', 'created_at']
        read_only_fields = ['client']

    def create(self, validated_data):
        # Automatically set the client to the current user
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)