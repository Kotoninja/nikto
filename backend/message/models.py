from django.db import models


class Message(models.Model):
    username = models.CharField(default="Anonymous", max_length=20)
    text = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    