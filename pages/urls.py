from django.urls import path
from . import views

urlpatterns = [
    path('', views.Index, name='Home'),
    path('firstBoard.html', views.FirstBoard, name='first'),
    path('GetMovesOne', views.GetMovesOne, name='getMovesOne'),
    path('GetUserMoveOne', views.GetUserMoveOne, name='PutUserMoveOne'),
    path('BotMoveOne', views.BotMoveOne, name='botOne'),
    path('secondBoard.html', views.SecondBoard, name='second'),
    path('GetMovesTwo', views.GetMovesTwo, name='getMovesTwo'),
    path('GetUserMoveTwo', views.GetUserMoveTwo, name='PutUserMoveTwo'),
    path('BotMoveTwo', views.BotMoveTwo, name='botTwo'),
]
