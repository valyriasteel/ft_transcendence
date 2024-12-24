from rest_framework import serializers
from .models import UserCreateProfile

class Verify2FASerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(regex=r'^\d{6}$', max_length=6)
