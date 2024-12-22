from django.shortcuts import render
from .models import UserCreateProfile, TwoFactorAuth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.conf import settings
import requests
from django.utils.crypto import get_random_string
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from datetime import timedelta
from rest_framework.throttling import UserRateThrottle
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout


# Utility function to decode the JWT token and get the user
def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        user = UserCreateProfile.objects.get(id=payload['user_id'])
        return user
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token expired')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token')
    except UserCreateProfile.DoesNotExist:
        raise AuthenticationFailed('User not found')


# Serializer for 2FA validation
class Verify2FASerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(regex=r'^\d{6}$', max_length=6)
    token = serializers.CharField()


# Throttle for 2FA verification
class Verify2FAThrottle(UserRateThrottle):
    rate = '5/min'


class LoginIntra42View(APIView):
    def get(self, request):
        url = f"{settings.OAUTH_AUTHORIZE}?client_id={settings.SOCIAL_AUTH_42_KEY}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
        return Response({'url': url})


class CallbackIntra42View(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Exchange code for access token
        try:
            token_response = requests.post(
                settings.TOKEN_URL,
                data={
                    'grant_type': 'authorization_code',
                    'client_id': settings.SOCIAL_AUTH_42_KEY,
                    'client_secret': settings.SOCIAL_AUTH_42_SECRET,
                    'code': code,
                    'redirect_uri': settings.REDIRECT_URI,
                }
            )
            token_response.raise_for_status()
            access_token = token_response.json().get('access_token')
        except (RequestException, ValueError) as e:
            return Response({'error': 'Failed to get token', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch user data
        try:
            user_response = requests.get(
                settings.USER_URL,
                headers={'Authorization': f'Bearer {access_token}'}
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            username = user_data.get('login')
            email = user_data.get('email')
        except (RequestException, ValueError) as e:
            return Response({'error': 'Failed to fetch user data', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        user, created = UserCreateProfile.objects.get_or_create(
            username=username,
            defaults={
                'avatar': user_data.get('image_url'),
                'name': user_data.get('first_name'),
                'surname': user_data.get('last_name'),
                'email': email,
            }
        )

        # Send 2FA code to email
        self.send_2fa_code(email)
        
        if created:
            return Response({'message': 'User created and 2FA code sent to email.'})
        else:
            return Response({'message': '2FA code sent to email.'})

    def send_2fa_code(self, email):
        # Generate a 6-digit code for 2FA
        code = get_random_string(length=6, allowed_chars='0123456789')

        # Set expiration time (5 minutes from now)
        expires_at = timezone.now() + timedelta(minutes=5)

        # Hash the code before saving
        hashed_code = make_password(code)
        TwoFactorAuth.objects.create(
            email=email,
            code=hashed_code,
            expires_at=expires_at
        )

        # Send the 2FA code to the user's email
        send_mail(
            'Your 2FA Code',
            f'Your verification code is: {code}',
            'no-reply@example.com',
            [email],
            fail_silently=False,
        )


class Verify2FAView(APIView):
    throttle_classes = [Verify2FAThrottle]

    def post(self, request):
        serializer = Verify2FASerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        token = serializer.validated_data['token']

        # Token validation
        try:
            user = get_user_from_token(token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        # Retrieve 2FA code from the database
        try:
            two_factor_record = TwoFactorAuth.objects.get(email=email)
        except TwoFactorAuth.DoesNotExist:
            return Response({'error': '2FA code not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the code is expired
        if two_factor_record.expires_at < timezone.now():
            return Response({'error': '2FA code expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the code
        if check_password(code, two_factor_record.code):
            two_factor_record.delete()  # Delete the record after successful validation

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

        return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')  # request.body yerine request.data kullanılıyor.
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Refresh token'ı blacklist'e ekle
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {'error': 'Invalid or expired refresh token.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred.', 'details': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Kullanıcı oturumunu sonlandır
        logout(request)
        request.session.flush()

        # Çerezleri temizle
        for cookie in ['sessionid', 'access_token', 'refresh_token']:
            request.COOKIES.pop(cookie, None)  # Çerez varsa temizle.

        response = Response(
            {'message': 'Successfully logged out.'}, 
            status=status.HTTP_200_OK
        )
        response.delete_cookie('sessionid')
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response