from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
import jwt
from django.conf import settings

class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('accessToken')

        if not token:
            return None  # No token found, skip authentication

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=decoded_token["user_id"])
            print(f"Authenticated user ID: {user.id}")
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        return (user, None)