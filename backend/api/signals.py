from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AdminUser

@receiver(post_save, sender=AdminUser)
def assign_admin_permissions(sender, instance, created, **kwargs):
    if created:
        instance.assign_permissions()
