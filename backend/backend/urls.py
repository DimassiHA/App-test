from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView 
from django.contrib import admin
from rest_framework.routers import DefaultRouter


from api.views import MyTokenObtainPairView, PasswordResetRequestView, PasswordResetVerifyView,CustomTokenObtainPairView , ServiceOwnerAdminViewSet


from api.views import AdminLoginView , CreateUserView , ClientRegistrationView , ServiceOwnerRegistrationView , UserListView ,CustomLoginView,UserProfileView, UserDetailView


router = DefaultRouter()


urlpatterns = [

    #MAIN URLS
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/custom-token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
    #ADMIN URLS
    path("api/Admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path('api/Admin/create-user/', CreateUserView.as_view(), name='create-user'),
    path('api/Admin/users/', UserListView.as_view(), name='user-list'),
    path('api/admin/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('api/admin/service-owners/', ServiceOwnerAdminViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='service-owner-list'),
    path('api/admin/service-owners/<int:pk>/', ServiceOwnerAdminViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='service-owner-detail'),
    path('api/admin/service-owners/<int:pk>/approve/', ServiceOwnerAdminViewSet.as_view({
        'patch': 'approve'
    }), name='service-owner-approve'),
    path('api/admin/service-owners/<int:pk>/reject/', ServiceOwnerAdminViewSet.as_view({
        'patch': 'reject'
    }), name='service-owner-reject'),

    #CLIENT URLS
    path('api/register/client/', ClientRegistrationView.as_view(), name='client_register'),

    #SERVICE_OWNER URLS
    path('api/register/service-owner/', ServiceOwnerRegistrationView.as_view(), name='service_owner_register'),

    #COMMUN URLS
    path('api/password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('api/login/',CustomLoginView.as_view(),name='login'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
]