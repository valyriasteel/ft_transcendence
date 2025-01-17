from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
import jwt
from django.conf import settings
import logging

logging.basicConfig(
    filename='app.log',  # Specify the log file name
    level=logging.DEBUG,  # Set the logging level (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('accessToken')
        if not token:
            return None  # No token found, skip authentication

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=decoded_token["user_id"])
        except jwt.ExpiredSignatureError:
            return None
            #raise AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            return None
           # raise AuthenticationFailed('Invalid token')

        return (user, None)