from django.urls import path
from .views import PostView, UpvoteView

urlpatterns = [
    path("posts/", PostView.as_view(), name="post-list"),
    path("upvote/<int:post_id>/", UpvoteView.as_view(), name="post-upvote"),
]
