from django.db import models


class Comment(models.Model):
    author = models.CharField(default="Anonymous", max_length=20)
    message = models.CharField(max_length=200)
    time = models.DateTimeField(auto_now_add=True)
