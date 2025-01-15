from rest_framework import serializers
from .models import UserCreateProfile

class Verify2FASerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(regex=r'^\d{6}$', max_length=6)



class UserCreateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCreateProfile
        fields = ['user', 'avatar', 'username', 'name', 'surname', 'email']
        extra_kwargs = {
            'avatar': {'required': False},  # Eğer boş olabilecek alanlar varsa
            'username': {'required': False},
            'name': {'required': False},
            'surname': {'required': False},
            'email': {'required': False},
        }
