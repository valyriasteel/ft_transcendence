from rest_framework import serializers
from .models import UserCreateProfile

class UserCreateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCreateProfile
        fields = ['avatar', 'username', 'name', 'surname', 'email']
