from rest_framework import viewsets
from rest_framework.permissions import BasePermission
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer


class IsAppAdmin(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_app_admin)
    
class IsSuperuser(BasePermission):
    """
    Custom permission to only allow superusers to access the view.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)
class CreateUserView(APIView):
    permission_classes = [IsSuperuser]

    def post(self, request):
        # Prevent non-superusers from creating admin accounts
        if request.data.get("is_app_admin") and not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can create admin accounts."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Pass the request object to the serializer context
        serializer = CustomUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken

class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user and user.is_app_admin:  # Ensure the user is an app admin
            refresh = RefreshToken.for_user(user)
            # Add custom claims to the token payload
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