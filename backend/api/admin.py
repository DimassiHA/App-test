from django.contrib import admin
from .models import CustomUser, Client , AdminUser ,ServiceOwner ,ServicePicture , PasswordResetToken , EventType

admin.site.register(CustomUser)
admin.site.register(Client)
admin.site.register(AdminUser)
admin.site.register(ServiceOwner)
admin.site.register(ServicePicture)
admin.site.register(PasswordResetToken)
admin.site.register(EventType)

