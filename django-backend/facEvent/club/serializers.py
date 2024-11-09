from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Club, Membership
class ClubSerializer(serializers.ModelSerializer):
    # method field that has the list of memberships
    members = serializers.SerializerMethodField()
    manager = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = '__all__'
        
    def get_members(self, obj):
        # get context full 
        print(self.context)
        if self.context.get('full') == True:
            memberships = Membership.objects.filter(club=obj, state='ACTIVE')
            print(memberships) 
            return MembershipSerializer(memberships, many=True).data
        else:
            # get membership of the club and count()
            return obj.membership_set.filter(state='ACTIVE').count()
    
    def get_manager(self, obj):
        return obj.manager.first_name + ' ' + obj.manager.last_name

    def update(self, instance, validated_data):
        # Update the manager if it's in the validated data
        if 'manager' in validated_data:
            instance.manager = validated_data['manager']
            instance.save()
        return super().update(instance, validated_data)
        
        
class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Membership
        fields = '__all__'
        
    def get_user(self, obj):
        from user.serializers import UserSerializer  # local import to avoid circular import
        return UserSerializer(obj.user).data
