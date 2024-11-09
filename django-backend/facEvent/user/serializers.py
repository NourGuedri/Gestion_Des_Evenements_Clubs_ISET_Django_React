from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from club.serializers import ClubSerializer

from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = serializers.SerializerMethodField()
    managed_clubs = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs)

        if 'context' in kwargs and 'only_names' in kwargs['context']:
            self.fields = {
                'first_name': self.fields['first_name'],
                'last_name': self.fields['last_name']
            }


    def validate(self, data):
        # CHECK IF username is composed of 8 numbers
        username = data.get('username')
        if not username.isdigit() or len(username) != 8:
            # raise an error {"username": "Username must be 8 digits."}
            raise serializers.ValidationError({"username": "CIN is not valid"})
        
        
        # Check if passwords match
        password = data.get('password')
        confirm_password = self.context['request'].data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    # when getting data of the user , we also get a profile object
    def get_profile(self, obj):
        try:
            profile = Profile.objects.get(user=obj.id)
            return ProfileSerializer(profile).data
        except Profile.DoesNotExist:
            return None

    # when getting data of the user , we also get a list of clubs managed by the user(each Club has a field called manager which is a user 
    def get_managed_clubs(self, obj):
        managed_clubs = obj.club_set.all()
        return ClubSerializer(managed_clubs, many=True).data
        
        


    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    # def create(self, validated_data):
    #     email = validated_data.get('email')
    #     # get the user object
    #     try:
    #         user = User.objects.get(id=validated_data.get('user').id)
    #     except User.DoesNotExist:
    #         raise serializers.ValidationError("Invalid user ID.")
        
    #     # set the email of the user
    #     user.email = email
    #     user.save()
        
    #     return Profile.objects.create(user=user, **validated_data)