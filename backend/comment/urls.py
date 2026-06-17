from django.urls import path
from comment import views

urlpatterns = [
    path("all", view=views.CommentAPI.as_view({"get": "list"}), name="all"),
    path("create", view=views.CommentAPI.as_view({"post": "create"}), name="all"),
]
