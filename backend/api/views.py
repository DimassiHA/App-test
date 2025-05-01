from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import BasePermission, AllowAny ,IsAuthenticated
from django.core.mail import send_mail
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import status
from .models import CustomUser , PasswordResetToken, EventType , Event
from .serializers import  MyTokenObtainPairSerializer, PasswordResetRequestSerializer, PasswordResetVerifySerializer,CustomTokenObtainPairSerializer , EventSerializer
import logging
from django.conf import settings

from .serializers import CustomUserSerializer ,ClientRegisterSerializer,ServiceOwnerRegisterSerializer,ClientProfileSerializer,ServiceOwnerProfileSerializer , EventTypeSerializer

from rest_framework import status , generics

from .models import CustomUser , Client , ServiceOwner
from .serializers import  MyTokenObtainPairSerializer
import logging
from .serializers import CustomUserSerializer ,ClientRegisterSerializer,ServiceOwnerRegisterSerializer, LoginSerializer
from .backends import EmailOrPhoneNumberBackend
from django.contrib.auth import login




class ClientRegistrationView(CreateAPIView):
    serializer_class = ClientRegisterSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        client = user.client_profile
        response_serializer = ClientProfileSerializer(client)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class ServiceOwnerRegistrationView(CreateAPIView):
    serializer_class = ServiceOwnerRegisterSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        service_owner = user.service_owner_profile
        response_serializer = ServiceOwnerProfileSerializer(service_owner)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class IsAppAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.user_type in ['admin', 'superuser'])
class IsSuperuser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.user_type == 'superuser')

class CreateUserView(APIView):
    permission_classes = [IsSuperuser]

    def post(self, request):
        # Prevent non-superusers from creating admin/superuser accounts
        requested_type = request.data.get('user_type')
        if requested_type in ['admin', 'superuser'] and not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can create admin/superuser accounts."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



logger = logging.getLogger(__name__)
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user and user.is_app_admin:
            refresh = RefreshToken.for_user(user)
            refresh['is_superuser'] = user.is_superuser
            refresh['is_app_admin'] = user.is_app_admin
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "is_superuser": user.is_superuser,  # Include is_superuser in the response
                    "is_app_admin": user.is_app_admin,  # Include is_app_admin in the response
                }
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials or not an admin"}, status=status.HTTP_401_UNAUTHORIZED)




class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.query_params.get('role', None)
        users = CustomUser.objects.all()

        if role:
            if role == "superuser":
                users = users.filter(user_type='superuser')
            elif role == "admin":
                users = users.filter(user_type='admin')
            elif role == "client":
                users = users.filter(user_type='client')  # Explicit clients only
            elif role == "service_owner":
                users = users.filter(user_type='service_owner')  # Explicit service owners

        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)



class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = CustomUser.objects.get(email=email)

                # Delete any existing tokens for this user first
                PasswordResetToken.objects.filter(user=user).delete()

                # Create a new token (automatically generates a new code via save())
                token = PasswordResetToken.objects.create(user=user)

                # Send email with verification code
                send_mail(
                    'Password Reset Verification Code',
                    f'Your verification code is: {token.token}\nThis code will expire in 15 minutes.',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )

                return Response({"message": "Verification code sent to your email"}, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']

            try:
                user = CustomUser.objects.get(email=email)
                reset_token = PasswordResetToken.objects.filter(
                    user=user,
                    token=token,
                    is_used=False,
                    expires_at__gte=timezone.now()
                ).first()

                if reset_token:
                    user.set_password(new_password)
                    user.save()
                    reset_token.is_used = True
                    reset_token.save()
                    return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
            except CustomUser.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return Response({
                    'user_type': user.user_type,
                    'message': 'Login successful',
                })


            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        if user.user_type == 'client':
            try:
                profile = user.client_profile
                serializer = ClientProfileSerializer(profile)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Client.DoesNotExist:
                return Response({'error': 'Client profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        elif user.user_type == 'service_owner':
            try:
                profile = user.service_owner_profile
                if profile.status != 'approved':
                    return Response(
                        {"error": "Your account is pending approval"}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                serializer = ServiceOwnerProfileSerializer(profile)
                return Response(serializer.data)
            except ServiceOwner.DoesNotExist:
                return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            serializer = CustomUserSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)

            # Ensure users can only edit their own profile
            if user.id != request.user.id:
                return Response(
                    {"error": "You can only edit your own profile"},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = CustomUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




class ApproveServiceOwnerView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        try:
            service_owner = ServiceOwner.objects.get(user_id=user_id)
            service_owner.status = 'approved'
            service_owner.save()
            return Response({"status": "approved"}, status=status.HTTP_200_OK)
        except ServiceOwner.DoesNotExist:
            return Response({"error": "Service owner not found"}, status=status.HTTP_404_NOT_FOUND)

# views.py
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet

class ServiceOwnerAdminViewSet(ModelViewSet):
    queryset = ServiceOwner.objects.all()
    serializer_class = ServiceOwnerProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        service_owner = self.get_object()
        service_owner.status = 'approved'
        service_owner.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        service_owner = self.get_object()
        service_owner.status = 'rejected'
        service_owner.rejection_reason = request.data.get('reason', '')
        service_owner.save()
        return Response({'status': 'rejected'})

    def get_queryset(self):
        status = self.request.query_params.get('status')
        queryset = super().get_queryset()
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer
    permission_classes = [IsAuthenticated, IsAppAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(client=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the client to the current user
        serializer.save(client=self.request.user)

class ClientEventTypeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"User: {request.user}")
        print(f"Auth header: {request.headers.get('Authorization')}")
        print(f"Authenticated: {request.user.is_authenticated}") 
        event_types = EventType.objects.all()
        serializer = EventTypeSerializer(event_types, many=True)
        return Response(serializer.data)

class ServiceOwnerFilterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        event_type_id = request.query_params.get('event_type')
        if not event_type_id:
            return Response(
                {"error": "event_type parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            service_owners = ServiceOwner.objects.filter(
                event_types__id=event_type_id,
                status='approved'
            ).select_related('user').prefetch_related('event_types')

            serializer = ServiceOwnerProfileSerializer(service_owners, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
