from django.urls import path

from message import views

app_name = "message"

urlpatterns = [
    path("all", view=views.MessageAPI.as_view({"get": "list"}), name="all"),
    path("create", view=views.MessageAPI.as_view({"post": "create"}), name="create"),
]
