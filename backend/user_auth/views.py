# django
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.contrib.auth.hashers import check_password, make_password

# django rest framework 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ParseError
from rest_framework.permissions import IsAuthenticated
# from rest_framework.permissions import IsAuthenticated

# serializers 
from .serializers import UserSignUpSerializer, UserProfileSerializer

# simple jwt 
from rest_framework_simplejwt.tokens import RefreshToken


# models
from .models import User, Profile

# logging
import logging
logger = logging.getLogger(__name__)



# user signup view (user registration view)
class SignUpView(APIView):
    def post(self, request):
        try:
            
            serializer = UserSignUpSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "User registration successful"},
                    status=status.HTTP_201_CREATED
                )
             
            # Handle validation errors
            error_messages = []
            for field, errors in serializer.errors.items():
                for error in errors:
                    if field == 'email' and 'unique' in str(error).lower():
                        error_messages.append("Email already exists")
                    elif field == 'password' and 'min_length' in str(error).lower():
                        error_messages.append("Password must be at least 8 characters long")
                    else:
                        error_messages.append(f"{field.capitalize()}: {error}")
            
            return Response(
                {"message": error_messages}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except IntegrityError:
            return Response(
                {"message": "User with this information already exists"},
                status=status.HTTP_409_CONFLICT
            )
        except Exception as e:
            print(e)
            logger.error(f"Error in user registration: {str(e)}")
            return Response(
                {"message": "An error occurred during registration"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class LoginView(APIView):
    def post(self, request):
        try:
            # Extract credentials
            email = request.data.get('email')
            password = request.data.get('password')
            
            # Validate required fields
            if not email or not password:
                raise ParseError('Email and password are required')
            
            # Check if user exists 
            try:
                User.objects.get(email=email)    
            except User.DoesNotExist:
                raise AuthenticationFailed('Invalid email address')
            
            # Authenticate user
            user = authenticate(email=email, password=password)
            if user is None:
                raise AuthenticationFailed("Invalid password")
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            refresh["username"] = str(user.username)
            
            # Prepare response
            content = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'username': user.username
                }
            }
            return Response(content, status=status.HTTP_200_OK)
            
        except (ParseError, AuthenticationFailed) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            
            logger.error(f"Login error: {str(e)}")
            return Response(
                {'error': 'An error occurred during login'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            serializer = UserProfileSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response(
                {'error': 'An error occurred during fatching data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    # update profile (edit profile)
    def put(self, request):
        user = request.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        
        if 'username' in request.data:
            if User.objects.filter(username=request.data['username']).exclude(id=user.id).exists():
                 return Response(
                    {'error': 'Username already taken'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.username = request.data['username']
        
        if 'email' in request.data:
            if User.objects.filter(email=request.data['email']).exclude(id=user.id).exists():
                return Response(
                    {'error': 'Email already registered'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.email = request.data['email']
         # Handle profile picture
        profile = Profile.objects.get(user=user)
        if 'profile_pic' in request.FILES:
            profile.profile_pic = request.FILES['profile_pic']
            profile.save()
        
        
        user.save()
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_pic': profile.profile_pic.url if profile.profile_pic else None,
            }, 
            status=status.HTTP_200_OK)
    
    
    # update password
    def patch(self, request):
        user = request.user
        
        # Verify request data
        if not all(k in request.data for k in ('current_password', 'new_password')):
            return Response(
                {'error': 'Current password and new password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check current password
        if len(request.data['new_password']) < 8:
            return Response(
                {'error': 'Password should at least 8 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not check_password(request.data['current_password'], user.password):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update password
        user.password = make_password(request.data['new_password'])
        user.save()
        
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)



