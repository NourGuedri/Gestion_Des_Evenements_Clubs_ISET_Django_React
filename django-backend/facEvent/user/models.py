from django.db import models
from django.contrib.auth.models import User
import random
from django.utils import timezone


# Create your models here.
class VerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code(self):
        # Delete the old code if it exists
        VerificationCode.objects.filter(user=self.user).delete()
        print("generate code")

        # Generate a new random 6-digit code
        self.code = str(random.randint(10000,99999 ))
        self.save()

    def is_valid(self, user):
        # Check if the code is less than 10 minutes old and the user is the same
        return (timezone.now() - self.created_at).total_seconds() < 600 and self.user == user
    
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=100,unique=True)
    phone_number = models.CharField(max_length=15,unique=True,blank=False,null=False)
    verified = models.BooleanField(default=False, blank=False, null=False)
    is_admin = models.BooleanField(default=False)
    university = models.CharField(max_length=100, blank=False, null=False)
    department = models.CharField(max_length=100, blank=False, null=False)
    group = models.CharField(max_length=10, blank=False, null=False)
    
    def __str__(self):
        return self.user.username