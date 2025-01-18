from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import User
import jwt
from django.conf import settings

class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('accessToken')
        if not token:
            return None

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=decoded_token["user_id"])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

        return (user, None)