from .models import UserCreateProfile, TwoFactorAuth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.conf import settings
import requests
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
from rest_framework.throttling import UserRateThrottle
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout
from .serializers import Verify2FASerializer, UserCreateProfileSerializer
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db import IntegrityError
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views import View
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import logging

logging.basicConfig(
    filename='app.log',  # Specify the log file name
    level=logging.DEBUG,  # Set the logging level (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
)
logging.basicConfig(level=logging.INFO)

# Throttle for 2FA verification
class Verify2FAThrottle(UserRateThrottle):
    rate = '5/min'


class LoginIntra42View(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        url = f"{settings.OAUTH_AUTHORIZE}?client_id={settings.SOCIAL_AUTH_42_KEY}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
        return Response({'url': url})


class CallbackIntra42View(APIView):
    permission_classes = [AllowAny]
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
        except (requests.RequestException, ValueError) as e:
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
        except (requests.RequestException, ValueError) as e:
            return Response({'error': 'Failed to fetch user data', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        try:
            # Retrieve or create the actual User instance
            user, user_created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': user_data.get('first_name'),
                    'last_name': user_data.get('last_name'),
                }
            )

            # Retrieve or create the UserCreateProfile instance
            profile, profile_created = UserCreateProfile.objects.get_or_create(
                user=user,
                defaults={
                    'avatar': user_data.get('image').get('versions').get('large'),
                    'username': username,
                    'name': user_data.get('first_name'),
                    'surname': user_data.get('last_name'),
                    'email': email,
                }
            )
        except IntegrityError as e:
            return Response({'error': 'Database integrity error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send 2FA code to email
        self.send_2fa_code(profile)

        # Kullanıcıyı doğrulama sayfasına yönlendir (Dinamik URL)
        scheme = request.scheme
        host = request.get_host()
        frontend_url = f"{scheme}://{host}/"
        response = redirect(frontend_url)
        response.set_cookie('callback_complete', 'true', max_age=20)  # 20 saniyelik geçici cookie
        return response

    def send_2fa_code(self, profile):
        # Generate a 6-digit code for 2FA
        code = get_random_string(length=6, allowed_chars='0123456789')

        # Set expiration time (5 minutes from now)
        expires_at = timezone.now() + timedelta(minutes=5)

        # Hash the code before saving
        hashed_code = make_password(code)
        two_factor_auth, created = TwoFactorAuth.objects.update_or_create(
        user=profile.user,  # Ensure it's linked to the correct User
        defaults={
            'code': hashed_code,
            'expires_at': expires_at,
        }
    )

        # Send the 2FA code to the user's email
        send_mail(
            'Your 2FA Code',
            f'Your verification code is: {code}',
            'no-reply@example.com',
            [profile.email],
            fail_silently=False,
        )


class Verify2FAView(APIView):
    throttle_classes = [Verify2FAThrottle]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = Verify2FASerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        # Retrieve the user profile
        try:
            user_profile = UserCreateProfile.objects.get(email=email)
        except UserCreateProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the related User instance
        user = user_profile.user

        # Retrieve 2FA code from the database
        try:
            two_factor_record = TwoFactorAuth.objects.get(user=user)  # Now relates to User
        except TwoFactorAuth.DoesNotExist:
            return Response({'error': '2FA code not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the code is expired
        if two_factor_record.expires_at < timezone.now():
            two_factor_record.delete()  # Delete the expired record
            return Response({'error': '2FA code expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the code
        if check_password(code, two_factor_record.code):
            two_factor_record.delete()  # Delete the record after successful validation

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)  # Use the actual User instance here

            myToken = str(refresh.access_token)
            myRefreshToken = str(refresh)

            table = Response({
                'access': myToken,
                'refresh': myRefreshToken
            })
            table.set_cookie(
                "accessToken", myToken,  # Insert the actual token here
                httponly=True,  # Prevent JavaScript access
                secure=True,  # Use HTTPS in production
                samesite="Strict",  # Restrict cross-site sharing
            )
            table.set_cookie(
                "refreshToken", myRefreshToken,  # Insert the actual refresh token here
                httponly=True,  # Prevent JavaScript access
                secure=True,  # Use HTTPS in production
                samesite="Strict",  # Restrict cross-site sharing
            )

            return table

        return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    print("buraya girdim")
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')
        print("Received refresh token:", refresh_token)  # Debug: Check the value of refresh token

        # Refresh token'ı HTTP-only cookie'den alıyoruz
        refresh_token = request.COOKIES.get('refreshToken')
        
        # Logout işlemi
        logout(request)
        request.session.flush()

        # Cookie'leri silme
        response = Response(
            {'message': 'Successfully logged out.'},
            status=status.HTTP_200_OK
        )
        
        # Cookie'lerin silindiğinden emin olalım
        response.delete_cookie('accessToken')
        response.delete_cookie('refreshToken')
        print("Çıkış işlemi başarılı")  # Debug: Çıkış mesajı
        return response

class TokenCheckView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self, request):
        try:
            # Token kontrolü
            if not request.user.is_authenticated:
                return Response({'error': 'No valid token provided'}, status=status.HTTP_401_UNAUTHORIZED)

    
            return Response({
                'status': 'success',
                'message': 'Authentication successful',
            })
        except UserCreateProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetProfileView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self, request):
        try:
            # Token kontrolü
            if not request.user.is_authenticated:
                return Response({'error': 'No valid token provided'}, status=status.HTTP_401_UNAUTHORIZED)

            user_profile = UserCreateProfile.objects.get(user=request.user)
            serializer = UserCreateProfileSerializer(user_profile)
            
            return Response({
                'status': 'success',
                'message': 'Authentication successful',
                'user': serializer.data
            })
        except UserCreateProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

logger = logging.getLogger(__name__)

class TestApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get tokens from cookies
        access_token = request.COOKIES.get('accessToken')
        refresh_token = request.COOKIES.get('refreshToken')

        if not refresh_token:
            logger.warning("No refresh token provided.")
            response = Response({"error": "Refresh token is missing.", "flag": 'no_refresh'}, status=401)
            response.delete_cookie('accessToken')
            return response
        try:
            refresh = RefreshToken(refresh_token)
        except TokenError as e:
            logger.error(f"Token validation failed: {str(e)}")
            response = Response({"message": "Refresh token is invalid or expired", "flag": 'invalid_refresh'}, status=401)
            response.delete_cookie('refreshToken')
            response.delete_cookie('accessToken')
            return response
        
        # Handle missing tokens
        if not access_token:
            logger.warning("No access token provided.")
            new_access_token = str(refresh.access_token)
            response = Response({
                'message': 'Token is generating...',
                'access': new_access_token,
                'flag': 'new_token',
            })
            response.set_cookie(
                "accessToken", new_access_token,
                httponly=True,
                secure=True,
                samesite="Strict"
            )
            logger.info("Generating access token...")
            return response
        
        try:
            # Verify access token
            auth = JWTAuthentication()
            validated_token = auth.get_validated_token(access_token)  # This will raise if invalid or expired

            # Optionally, retrieve user associated with token
            user = auth.get_user(validated_token)

            logger.info(f"User {user.username} authenticated successfully.")

            # Return new access token in the response
            response = Response({
                'message': 'Token is valid!',
                'flag': 'all_ok',
            })
            return response

        except InvalidToken as e:
            logger.info(str(e).lower())
            if 'accesstoken' in str(e).lower():
                new_access_token = str(refresh.access_token)
                response = Response({
                    'message': 'Token is expired, generating new token...',
                    'access': new_access_token,
                    'flag': 'new_token',
                })
                response.set_cookie(
                    "accessToken", new_access_token,
                    httponly=True,
                    secure=True,
                    samesite="Strict"
                )
                return response
        except TokenError as e:
            logger.info("buraya girdim invalid token")
            new_access_token = str(refresh.access_token)
            response = Response({
                'message': 'Token values is invalid, generating new token...',
                'access': new_access_token,
                'flag': 'new_token',
            })
            response.set_cookie(
                "accessToken", new_access_token,
                httponly=True,
                secure=True,
                samesite="Strict"
            )
            return response

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            response = Response({"error": "An unexpected error occurred."}, status=500)
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
            return response

class IndexRender(View):
    def get(self, request):  # Use the appropriate HTTP method (GET)
        return render(request, 'index.html')
    