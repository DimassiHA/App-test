from django.contrib import admin
from .models import CustomUser, Client , AdminUser

admin.site.register(CustomUser)
admin.site.register(Client)
admin.site.register(AdminUser)
