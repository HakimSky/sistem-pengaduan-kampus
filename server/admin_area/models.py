# admin_area/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
