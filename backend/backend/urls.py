from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import EventViewSet
from django.contrib import admin
from django.urls import path, include

router = DefaultRouter()
router.register(r'events', EventViewSet)  # Your API endpoint

urlpatterns = [
    path('/', include(router.urls)),
    path("admin/", admin.site.urls),

]

