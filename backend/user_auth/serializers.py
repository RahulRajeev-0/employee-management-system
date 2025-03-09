from rest_framework import serializers

# models

from .models import Profile, User




# user details serializer 
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ("password",)


class UserSignUpSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):  # Corrected variable name
        password = validated_data.pop('password', None)
        
        # Use the User model directly instead of self.Meta.model
        instance = User(**validated_data)
        
        if password is not None:
            instance.set_password(password)
            instance.save()
            return instance
        else:
            raise serializers.ValidationError({
                "password": "password is not valid"
            })

