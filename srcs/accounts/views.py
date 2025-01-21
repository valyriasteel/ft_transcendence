from .models import UserCreateProfile, TwoFactorAuth
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.conf import settings
import requests
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout
from .serializers import Verify2FASerializer, UserCreateProfileSerializer
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.db import IntegrityError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import logging

# Logger oluştur ve seviyesini ayarla
logging.basicConfig(level=logging.INFO)

# Dosya handler'ı oluştur
file_handler = logging.FileHandler("app.log")
file_handler.setLevel(logging.INFO)

# Formatter oluştur ve handler'a ekle
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Logger'ın root seviyesine handler'ı ekle
logger = logging.getLogger()
logger.addHandler(file_handler)

class LoginIntra42View(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            url = f"{settings.OAUTH_AUTHORIZE}?client_id={settings.SOCIAL_AUTH_42_KEY}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
            return Response({'url': url, "flag": True}, status = 200)
        except Exception as e:
            return Response(
            {"error": "An unexpected error occurred.", "details": str(e), "flag": False},
            status=200
        )
    


class CallbackIntra42View(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=200)

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
            logging.info(settings.REDIRECT_URI)
            token_response.raise_for_status()
            access_token = token_response.json().get('access_token')
        except (requests.RequestException, ValueError) as e:
            return Response({'error': 'Failed to get token', 'details': str(e)}, status=200)

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
            return Response({'error': 'Failed to fetch user data', 'details': str(e)}, status=200)

        try:
            user, user_created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': user_data.get('first_name'),
                    'last_name': user_data.get('last_name'),
                }
            )

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
            return Response({'error': 'Database integrity error', 'details': str(e)}, status=200)

        self.send_2fa_code(profile)

        try:
            scheme = "https"
            host = request.get_host()
            frontend_url = f"{scheme}://{host}:4443/"
            logging.info(f"Redirecting to: {frontend_url}")
            response = redirect(frontend_url)
            response.set_cookie('callback_complete', 'true', max_age=20)
            return response
        except Exception as e:
            return Response(
                {'error': 'Failed to redirect to frontend', 'details': str(e)},status=200)

    def send_2fa_code(self, profile):
        try:
            code = get_random_string(length=6, allowed_chars='0123456789')

            expires_at = timezone.now() + timedelta(minutes=5)

            hashed_code = make_password(code)
            two_factor_auth, created = TwoFactorAuth.objects.update_or_create(
            user=profile.user,
            defaults={
                'code': hashed_code,
                'expires_at': expires_at,
            }
        )
            try:
                send_mail(
                    'Your 2FA Code',
                    f'Your verification code is: {code}',
                    'no-reply@example.com',
                    [profile.email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response(
                    {'error': 'Failed to send 2FA code', 'details': str(e)},status=200)
        except Exception as e:
            return Response({"error": "An unexpected error occurred while sending the 2FA code.", "details": str(e)},status=200,
        )

class Verify2FAView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = Verify2FASerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(
                {'error': 'Failed to validate 2FA code', 'details': str(e), "flag": False},
                status=200
            )

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        
        try:
            user_profile = UserCreateProfile.objects.get(email=email)
        except UserCreateProfile.DoesNotExist:
            return Response({'error': 'User not found', "flag": False}, status=200)

        
        user = user_profile.user

        
        try:
            two_factor_record = TwoFactorAuth.objects.get(user=user)
        except TwoFactorAuth.DoesNotExist:
            return Response({'error': '2FA code not found', "flag": False}, status=200)

        try:
            if two_factor_record.expires_at < timezone.now():
                two_factor_record.delete() 
                return Response({'error': '2FA code expired', "flag": False}, status=200)
        except Exception as e:
            return Response(
                {'error': 'An error occurred during 2FA verification', 'details': str(e), "flag": False},status=200)
        
        try:
            if check_password(code, two_factor_record.code):
                try:
                    two_factor_record.delete()
                except Exception as e:
                    return Response(
                        {'error': 'Failed to delete 2FA record', 'details': str(e), "flag": False},
                        status=200
                    )

                try:
                    # JWT token oluştur ve cookie ayarlarını yap
                    refresh = RefreshToken.for_user(user)
                    myToken = str(refresh.access_token)
                    myRefreshToken = str(refresh)

                    table = Response({
                        'access': myToken,
                        'refresh': myRefreshToken,
                        "flag": True
                    },status=200)
                    table.set_cookie(
                        "accessToken", myToken,
                        httponly=True,
                        secure=True,
                        samesite="Strict",
                    )
                    table.set_cookie(
                        "refreshToken", myRefreshToken,
                        httponly=True,
                        secure=True,
                        samesite="Strict",
                    )

                    return table
                except Exception as e:
                    return Response(
                        {'error': 'Failed to generate tokens or set cookies', 'details': str(e), "flag": False},
                        status=200
                    )

            return Response({'error': 'Invalid code', "flag": False}, status=200)
        except Exception as e:
            return Response(
                {'error': 'An error occurred during 2FA verification', 'details': str(e), "flag": False},
                status=200
            )


class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        refresh_token = request.COOKIES.get('refreshToken')

        logout(request)
        request.session.flush()

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                return Response(
                    {'error': 'Failed to blacklist refresh token.', 'flag': False}, status=200)

        try:
            response = Response(
                {'message': 'Successfully logged out.', "flag": True},
                status=200
            )
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')
        except Exception as e:
            return Response(
                {'error': 'Failed to clear cookies.', 'details': str(e), "flag": False},
                status=200
            )

        return response

class GetProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if not request.user.is_authenticated:
                return Response({'error': 'No valid token provided', 'status': 'error'}, status=200)
            user_profile = UserCreateProfile.objects.get(user=request.user)
            serializer = UserCreateProfileSerializer(user_profile)
            
            return Response({
                'status': 'success',
                'message': 'Authentication successful',
                'user': serializer.data
            })
        except UserCreateProfile.DoesNotExist:
            return Response({
                'status': 'error',
                'error': 'User profile not found'
            }, status = 200)
        except Exception as e:
            return Response({
                'status': 'error',
                'error': str(e)
            }, status = 200)


class TestApiView(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request):
        access_token = request.COOKIES.get('accessToken')
        refresh_token = request.COOKIES.get('refreshToken')

        if not refresh_token:
            response = Response({"error": "Refresh token is missing.", "flag": False}, status=200)
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')
            return response

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError as e:
            response = Response({"message": "Refresh token is invalid or expired", "flag": False}, status=200)
            response.delete_cookie('refreshToken')
            response.delete_cookie('accessToken')
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')
            return response
        except InvalidToken as e:
            response = Response({"message": "Refresh token is invalid or expired", "flag": False}, status=200)
            response.delete_cookie('refreshToken')
            response.delete_cookie('accessToken')
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')

        if not access_token:
            try:
                new_access_token = str(refresh.access_token)
            except (TokenError, InvalidToken) as e:
                return Response(
                    {'error': 'Failed to generate new access token.', 'details': str(e), "flag": False},
                    status=200
                )
        
            try:
                response = Response({
                    'message': 'Token is generating...',
                    'access': new_access_token,
                    'flag': True,
                })
                response.set_cookie(
                    "accessToken", new_access_token,
                    httponly=True,
                    secure=True,
                    samesite="Strict"
                )
                return response
            except Exception as e:
                return Response(
                    {'error': 'Failed to set cookies.', 'details': str(e), "flag": False},
                    status=200
                )
        
        try:
            auth = JWTAuthentication()
            validated_token = auth.get_validated_token(access_token)
            auth.get_user(validated_token)
            response = Response({
                'message': 'Token is valid!',
                'flag': True,
            })
            return response

        except InvalidToken as e:
            if 'accesstoken' in str(e).lower():
                new_access_token = str(refresh.access_token)
                response = Response({
                    'message': 'Token is expired, generating new token...',
                    'access': new_access_token,
                    'flag': True,
                })
                response.set_cookie(
                    "accessToken", new_access_token,
                    httponly=True,
                    secure=True,
                    samesite="Strict"
                )
                return response
        except TokenError as e:
            new_access_token = str(refresh.access_token)
            response = Response({
                'message': 'Token values is invalid, generating new token...',
                'access': new_access_token,
                'flag': True,
            })
            response.set_cookie(
                "accessToken", new_access_token,
                httponly=True,
                secure=True,
                samesite="Strict"
            )
            return response

        except Exception as e:
            response = Response({"error": "An unexpected error occurred.", 'flag': False}, status=200)
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')
            return response
