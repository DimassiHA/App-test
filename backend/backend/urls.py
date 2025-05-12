from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView 
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from api.views import (
    MyTokenObtainPairView, PasswordResetRequestView, PasswordResetVerifyView,
    CustomTokenObtainPairView, ServiceOwnerAdminViewSet, EventTypeViewSet, 
    EventViewSet, ServiceOwnerFilterView, AdminLoginView, CreateUserView,
    ClientRegistrationView, ServiceOwnerRegistrationView, UserListView,
    CustomLoginView, UserProfileView, UserDetailView, ClientEventTypeListView
)

router = DefaultRouter()
router.register(r'admin/event-types', EventTypeViewSet, basename='event-types')
router.register(r'events', EventViewSet, basename='events')

urlpatterns = [
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
    
    # Authentication URLs
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/custom-token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', CustomLoginView.as_view(), name='login'),
    
    # Admin URLs
    path("api/Admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path('api/Admin/create-user/', CreateUserView.as_view(), name='create-user'),
    path('api/Admin/users/', UserListView.as_view(), name='user-list'),
    
    # Service Owner URLs
    path('api/service-owners/filter/', ServiceOwnerFilterView.as_view(), name='service-owners-filter'),
    path('api/register/service-owner/', ServiceOwnerRegistrationView.as_view(), name='service_owner_register'),
    
    # Client URLs
    path('api/register/client/', ClientRegistrationView.as_view(), name='client_register'),
    path('api/event-types/', ClientEventTypeListView.as_view(), name='client-event-types'),
    
    # Common URLs
    path('api/password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Router URLs (keep at bottom to avoid conflicts)
    path('api/', include(router.urls)),
]