from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Permission
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from datetime import timedelta
import random



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
        extra_fields.setdefault('user_type', 'superuser')
        return self.create_user(username, email, password, **extra_fields)


USER_TYPES = (
    ('client', 'Client'),
    ('service_owner', 'Service Owner'),
    ('admin', 'Admin'),
    ('superuser', 'Superuser'),
)

class CustomUser(AbstractUser):
    phone_number = models.IntegerField(null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_superuser = models.BooleanField(default=False)
    objects = CustomUserManager()
    def __str__(self):
        return self.username
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='client')
    @property
    def is_app_admin(self):
        return self.user_type in ['admin', 'superuser']

class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile")
    gender = models.CharField(max_length=10, choices=(('male', 'Male'), ('female', 'Female')))
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    def __str__(self):
        return f"Client: {self.user.username}"

class EventType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ServiceOwner(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="service_owner_profile")
    business_name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='service_owner_profiles/', null=True, blank=True)
    description= models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)
    event_types = models.ManyToManyField(EventType)
    min_budget = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Minimum price for this service"
    )
    max_budget = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Maximum price for this service"
    )
    max_capacity = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Maximum number of people served (if applicable)"
    )

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
class PasswordResetTokenManager(models.Manager):
    def create_token(self, user):
        # Clean up expired tokens first
        self.filter(expires_at__lte=timezone.now()).delete()
        token = self.create(
            user=user,
            expires_at=timezone.now() + timedelta(minutes=15)
        )
        return token

class PasswordResetToken(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    objects = PasswordResetTokenManager()

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = str(random.randint(100000, 999999))
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)


class Event(models.Model):
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')
    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.ForeignKey(EventType, on_delete=models.SET_NULL, null=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    guests = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.date}"


