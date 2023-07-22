
from django.urls import path,include
from . import views
urlpatterns = [
    path("/kitapsepeti",views.getKitapSepeti),
    path("/kitapyurdu",views.getKitapYurdu),
    path("/all",views.getAllBook),
    path("/test",views.test)
]