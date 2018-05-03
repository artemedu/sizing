from django.conf.urls import url

from . import views

app_name = 'DP_sizing_tool'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^postendpoint/$', views.YourViewsHere, name='YourViewsHere'),
#   url(r'^scrolling/$', views.scrolling, name='scrolling'),
#   url(r'^KACE/$', views.KACE, name='KACE'),
#   url(r'^disclaimer/$', views.disclaimer, name='disclaimer'),
]