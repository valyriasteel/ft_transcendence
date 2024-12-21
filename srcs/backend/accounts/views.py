from django.shortcuts import render
from .models import UserCreateProfile, TwoFactorAuth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import requests
from django.utils.crypto import get_random_string
from requests.exceptions import RequestException
from django.core.exceptions import ObjectDoesNotExist
import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from datetime import timedelta


# Utility function to decode the JWT token and get the user
def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = UserCreateProfile.objects.filter(id=payload['user_id']).first()
        return user
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token expired')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token')


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
        except RequestException:
            return Response({'error': 'Failed to get token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            access_token = token_response.json().get('access_token')
        except ValueError:
            return Response({'error': 'Failed to parse token response'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch user data
        try:
            user_response = requests.get(settings.USER_URL, headers={'Authorization': f'Bearer {access_token}'})
            user_response.raise_for_status()
        except RequestException:
            return Response({'error': 'Failed to fetch user data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_data = user_response.json()
            username = user_data.get('login')
            email = user_data.get('email')
        except ValueError:
            return Response({'error': 'Failed to parse user data response'}, status=status.HTTP_400_BAD_REQUEST)

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

        # Save the 2FA code in the database
        TwoFactorAuth.objects.create(
            email=email,
            code=code,
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
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        token = request.data.get('token')  # Token received for validation

        # Token validation
        if token:
            try:
                user = get_user_from_token(token)  # Check if the token is valid
            except AuthenticationFailed:
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve 2FA code from the database
        try:
            two_factor_record = TwoFactorAuth.objects.get(email=email)
        except TwoFactorAuth.DoesNotExist:
            return Response({'error': '2FA code not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the code is expired
        if two_factor_record.is_expired():
            return Response({'error': '2FA code expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the code
        if two_factor_record.code == code:
            two_factor_record.delete()  # Delete the record after successful validation

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

        return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the refresh token to log out the user
            token = RefreshToken(refresh_token)
            token.blacklist()  # Requires django-redis or appropriate blacklist configuration
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to logout', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
