from rest_framework import viewsets

from rest_framework.permissions import BasePermission, AllowAny ,IsAuthenticated

from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status , generics 
from .models import CustomUser , Client , ServiceOwner
from .serializers import  MyTokenObtainPairSerializer
import logging
from .serializers import CustomUserSerializer ,ClientRegisterSerializer,ServiceOwnerRegisterSerializer, LoginSerializer
from .backends import EmailOrPhoneNumberBackend
from django.contrib.auth import login


class ClientRegistrationView(generics.CreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientRegisterSerializer
    permission_classes = [AllowAny]

class ServiceOwnerRegistrationView(generics.CreateAPIView):
    queryset = ServiceOwner.objects.all()
    serializer_class = ServiceOwnerRegisterSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class IsAppAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_app_admin)
    
class IsSuperuser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

class CreateUserView(APIView):
    permission_classes = [IsSuperuser]

    def post(self, request):

        if request.data.get("is_app_admin") and not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can create admin accounts."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CustomUserSerializer(data=request.data, context={'request': request})
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
                users = users.filter(is_superuser=True)
            elif role == "admin":
                users = users.filter(is_app_admin=True)
            elif role == "client":
                users = users.filter(is_superuser=False, is_app_admin=False)

        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

class CustomLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Use the custom authentication backend for authentication
            backend = EmailOrPhoneNumberBackend()

            user = backend.authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return Response({
                    'user_type': user.user_type,
                    'message': 'Login successful',
                })
            
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

