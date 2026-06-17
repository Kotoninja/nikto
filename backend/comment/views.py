# from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from comment.models import Comment
from comment.serializers import CommentSerializer
from rest_framework import status


class CommentAPI(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def preform_create(self, serializer: CommentSerializer):
        serializer.save()

    def list(self, request):
        comments = self.get_queryset()
        serializer = self.get_serializer(comments, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            self.preform_create(serializer)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
