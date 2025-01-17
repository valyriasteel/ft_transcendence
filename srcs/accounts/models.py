from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class UserCreateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')  # Relation to the User model
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

class TwoFactorAuth(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Now relates to User instead of UserCreateProfile
    code = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.localtime(timezone.now()) > self.expires_at

    def __str__(self):
        return f"2FA for {self.user.username}"
