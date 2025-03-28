from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView 
from django.contrib import admin


from api.views import MyTokenObtainPairView

from api.views import AdminLoginView , CreateUserView , ClientRegistrationView , ServiceOwnerRegistrationView , UserListView ,CustomLoginView


urlpatterns = [

    path('api/', include('api.urls')),
    path("Admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path('api/Admin/create-user/', CreateUserView.as_view(), name='create-user'),
    path('api/Admin/users/', UserListView.as_view(), name='user-list'),
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/register/client/', ClientRegistrationView.as_view(), name='client_register'),
    path('api/register/service-owner/', ServiceOwnerRegistrationView.as_view(), name='service_owner_register'),
    path('api/login/',CustomLoginView.as_view(),name='login'),
]
