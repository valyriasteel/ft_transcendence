from django.db import models
from django.utils import timezone

class UserCreateProfile(models.Model):
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)  # Profil fotoğrafı
    username = models.CharField(max_length=150, unique=True)  # Kullanıcı adı (benzersiz)
    name = models.CharField(max_length=50)  # Ad (first name)
    surname = models.CharField(max_length=50)  # Soyad (last name)
    email = models.EmailField(unique=True)  # E-posta (benzersiz)

    def __str__(self):
        return self.username

class TwoFactorAuth(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    expires_at = models.DateTimeField(null=True)

    def is_expired(self):
        return timezone.localtime(timezone.now()) > self.expires_at

    def __str__(self):
        return f"2FA code for {self.email}"
