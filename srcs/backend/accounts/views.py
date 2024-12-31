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
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from .serializers import Verify2FASerializer
from django.contrib.auth.models import User

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
                    'avatar': user_data.get('image_url'),
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

        if profile_created:
            return Response({'message': 'User profile created and 2FA code sent to email.'})
        else:
            return Response({'message': '2FA code sent to email.'})

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
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

        return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Blacklist the refresh token
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

        # Logout the user
        logout(request)
        request.session.flush()

        # Clear cookies
        for cookie in ['sessionid', 'access_token', 'refresh_token']:
            request.COOKIES.pop(cookie, None)

        response = Response(
            {'message': 'Successfully logged out.'},
            status=status.HTTP_200_OK
        )
        response.delete_cookie('sessionid')
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response