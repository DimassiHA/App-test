from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Permission
from django.db import models
from django.contrib.contenttypes.models import ContentType
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_app_admin', True)
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
    phone_number = models.IntegerField(null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_app_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    def __str__(self):
        return self.username


class AdminUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="admin_profile")
    admin_id = models.AutoField(primary_key=True)
    def __str__(self):
        return f"Admin: {self.user.username}"

class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile")
    gender = models.CharField(max_length=10, choices=(('male', 'Male'), ('female', 'Female')))
    def __str__(self):
        return f"Client: {self.user.username}"

 