#Creating a custom authentication system where users can login using email,phone nulber or username (in the same field)
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from .models import CustomUser

class EmailOrPhoneNumberBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if username is an email
            if "@" in username:  
                user = CustomUser.objects.get(email=username)
            # Check if username is a phone number 
            elif username.isdigit():
                user = CustomUser.objects.get(phone_number=username)
            else:
                # Otherwise, treat as regular username
                user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return None
        
        # Check if the password is correct
        if user.check_password(password):
            return user
        return None
