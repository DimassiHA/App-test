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


USER_TYPES = (
    ('client', 'Client'),
    ('service_owner', 'Service Owner'),
    )

class CustomUser(AbstractUser):
    phone_number = models.IntegerField(null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_app_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = CustomUserManager()
    def __str__(self):
        return self.username
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='client')

class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile")
    gender = models.CharField(max_length=10, choices=(('male', 'Male'), ('female', 'Female')))
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    def __str__(self):
        return f"Client: {self.user.username}"
class ServiceOwner(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="service_owner_profile")
    business_name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='service_owner_profiles/', null=True, blank=True)
    description= models.TextField()

    def __str__(self):
        return f"Service Owner: {self.user.username} - {self.business_name}"

class ServicePicture(models.Model):
    service_owner = models.ForeignKey(ServiceOwner, on_delete=models.CASCADE, related_name="service_pictures")
    image = models.ImageField(upload_to='service_pictures/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Service Picture {self.id} for {self.service_owner.business_name}"
 
class AdminUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="admin_profile")
    admin_id = models.AutoField(primary_key=True)
    def __str__(self):
        return f"Admin: {self.user.username}"

