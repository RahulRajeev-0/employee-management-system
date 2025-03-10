# django
from django.contrib.auth import authenticate
from django.db import IntegrityError

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
from .models import User

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
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
