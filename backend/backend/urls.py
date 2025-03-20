from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from api.views import AdminLoginView , CreateUserView

urlpatterns = [

    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path("admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path('api/admin/create-user/', CreateUserView.as_view(), name='create-user'),
]
