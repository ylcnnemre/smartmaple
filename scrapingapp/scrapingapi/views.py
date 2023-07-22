from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .service.KitapSepetiService import kitapSepetiScraping
from .service.KitapYurduService import kitapYurduScraping
from .models import KitapYurdu,KitapSepeti
from decimal import Decimal

# Create your views here.

def getKitapSepeti(request):
    try:
        result = kitapSepetiScraping(3)
        books_to_create = [KitapSepeti(**data) for data in result]
        deleted_items=KitapSepeti.objects.filter(site="kitapsepeti")
        deleted_items.delete()
        KitapSepeti.objects.bulk_create(books_to_create)

        response_data = {
            "message": "Toplu kaydetme işlemi başarılı.",
            "books": result
        }
        return JsonResponse(response_data,safe=False)
    
    except Exception as e:
        response_data = {
            "message": f"Hata oluştu: {str(e)}",
            "books": []
        }
        return JsonResponse(response_data, status=500,safe=False)

def getKitapYurdu(request):
    try:
        result = kitapYurduScraping(3)
        books_to_create = [KitapYurdu(**data) for data in result]
        deleted_items=KitapYurdu.objects.filter(site="kitapyurdu")
        deleted_items.delete()

        KitapYurdu.objects.bulk_create(books_to_create)

        response_data = {
            "message": "Toplu kaydetme işlemi başarılı.",
            "books": result
        }
        return JsonResponse(response_data,safe=False)
    
    except Exception as e:
        response_data = {
            "message": f"Hata oluştu: {str(e)}",
            "books": []
        }
        return JsonResponse(response_data, status=500,safe=False)


def getAllBook(request):
    kitapyurdu = KitapYurdu.objects.all()
    kitapSepeti=KitapSepeti.objects.all()
    kitapyurdu_list = list(kitapyurdu.values())
    kitapsepeti_list=list(kitapSepeti.values())
    for book in kitapyurdu_list:
        book['price'] = Decimal(str(book['price']))
        book['_id'] = str(book['_id'])
    for item in kitapsepeti_list:
        item["price"] = Decimal(str(item["price"]))
        item["_id"]=str(item["_id"])
    kitapyurdu_list.extend(kitapsepeti_list)
    return JsonResponse(kitapyurdu_list, safe=False)


def test(request):
    return HttpResponse("merhaba123")
