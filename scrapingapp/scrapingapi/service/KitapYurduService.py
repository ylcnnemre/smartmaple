from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from decimal import Decimal
from datetime import datetime


def kitapYurduScraping(limit=None):
    driver = webdriver.Firefox()
    driver.get("https://www.kitapyurdu.com/index.php?route=product/best_sellers&list_id=5&filter_in_stock=1")
    selected_element = driver.find_element(By.CLASS_NAME, "product-grid")
    productcr_div = selected_element.find_elements(By.CLASS_NAME, "product-cr")
    hrefList=[]
    for index,product in enumerate(productcr_div):
        value =  product.find_element(By.CLASS_NAME,"ellipsis")
        alink= value.find_element(By.TAG_NAME,"a")
        href=alink.get_attribute("href")
        hrefList.append(href)
    
    result_list=[]

    for index,item in enumerate(hrefList):
        if limit == None:
            response=openLink(item,driver)
            if response != None:
                result_list.append(response)
        else: 
            if index < limit:
                response=openLink(item,driver)
                if response != None:
                    result_list.append(response)
    driver.quit()
    return result_list 


def openLink(link,driver):
    driver.get(link)
    wait = WebDriverWait(driver, 10)
    result={}
    try:
            pr_details_div = wait.until(ec.presence_of_element_located((By.CLASS_NAME, "pr_details")))
            bookName=pr_details_div.find_element(By.CLASS_NAME,"pr_header").text
            writer=pr_details_div.find_element(By.CLASS_NAME,"pr_producers__link").text
            publisher=pr_details_div.find_element(By.CLASS_NAME,"pr_producers__publisher").text
            price=pr_details_div.find_element(By.CLASS_NAME,"price__item").text
            
            result["name"]=bookName
            result["publisher"]=publisher
            result["writer"]=writer
            result["price"]= Decimal(price.replace(",", "."))
            result["site"]="kitapyurdu"
            
            features=pr_details_div.find_element(By.CLASS_NAME ,"pr_attributes")
            tbody=features.find_element(By.TAG_NAME,"tbody")
            rows= tbody.find_elements(By.TAG_NAME,"tr")
           
            for index,item in enumerate(rows):
                keyAndValue=item.text.split(":")
                key=keyAndValue[0]
                value = keyAndValue[1]
                if key=="ISBN":
                    result["isbn"]=value
                elif key == "Sayfa Sayısı":
                    result["numberof_pages"]=value
                elif key == "Cilt Tipi":
                    result["book_cover"]=value
                elif key=="Boyut":
                     result["size"] = value
                elif key=="Kağıt Cinsi":
                     result["paper_type"]=value
            return result

    except:
            print("pr-details bulunamadı veya süre aşımına uğradı.") 
            return None


