from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView 
from django.contrib import admin


from api.views import MyTokenObtainPairView, PasswordResetRequestView, PasswordResetVerifyView,CustomTokenObtainPairView


from api.views import AdminLoginView , CreateUserView , ClientRegistrationView , ServiceOwnerRegistrationView , UserListView ,CustomLoginView

<<<<<<< HEAD
=======
from api.views import AdminLoginView , CreateUserView , ClientRegistrationView , ServiceOwnerRegistrationView , UserListView ,CustomLoginView
>>>>>>> 40b57697b360fb3144ed53da7046ccd07eb78fd6


urlpatterns = [

    path('api/', include('api.urls')),
    path("Admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path('api/Admin/create-user/', CreateUserView.as_view(), name='create-user'),
    path('api/Admin/users/', UserListView.as_view(), name='user-list'),
    path('api/password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/custom-token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/register/client/', ClientRegistrationView.as_view(), name='client_register'),
    path('api/register/service-owner/', ServiceOwnerRegistrationView.as_view(), name='service_owner_register'),
    path('api/login/',CustomLoginView.as_view(),name='login'),
<<<<<<< HEAD

=======
>>>>>>> 40b57697b360fb3144ed53da7046ccd07eb78fd6
]
