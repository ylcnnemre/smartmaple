from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from decimal import Decimal


def kitapSepetiScraping(limit=None):
    driver=webdriver.Firefox()
    driver.get("https://www.kitapsepeti.com/cok-satan-kitaplar")
    wait = WebDriverWait(driver, 10)
    containerElement = wait.until(ec.presence_of_element_located((By.CLASS_NAME,"catalogWrapper" )))

    result=containerElement.find_elements(By.CLASS_NAME,"productItem" )
    product_links=[]
    resultProduct=[]
    for item in result:
         divitem_1=item.find_element(By.CLASS_NAME,"drop-down")
         divitem_2= divitem_1.find_element(By.XPATH,"./*[1]")
         alink=divitem_2.find_element(By.TAG_NAME , "a")
         product_links.append(alink.get_attribute("href") )
        
    for index,element in enumerate(product_links):
        if limit == None:
            response= openLink(element,driver)
            if response != None:
                 resultProduct.append(response)
        else :
             if index < limit:
                  response= openLink(element,driver)
                  if response != None:
                       resultProduct.append(response)
            
    driver.quit()
    return resultProduct


def openLink(link,driver):
    driver.get(link)
    wait = WebDriverWait(driver, 10)
    result={}
    try:
            detail_div = wait.until(ec.presence_of_element_located((By.ID, "productRight")))
            infoContainer=detail_div.find_element(By.ID,"productMobileInfo")
            prodInfo=infoContainer.find_element(By.ID,"productInfo")
            name = prodInfo.find_element(By.ID,"productName").text
            publisher= prodInfo.find_element(By.TAG_NAME,"a").text
            writer=prodInfo.find_element(By.TAG_NAME,"h2").text
            pricesContainer=infoContainer.find_element(By.ID,"price-flexer")
            price=pricesContainer.find_element(By.CLASS_NAME,"discountPrice").text.split("TL")[0].strip()

            result["name"]=name
            result["publisher"]=publisher
            result["writer"]=writer
            result["price"]= Decimal(price.replace(",", "."))
            result["site"]="kitapsepeti"
            aboutContainer=detail_div.find_element(By.CLASS_NAME,"centerBlock")
            abouts= aboutContainer.find_element(By.CLASS_NAME,"cilt")
            driver.implicitly_wait(2)
            aboutList=abouts.find_elements(By.TAG_NAME,"div")
  
            for index,item in enumerate(aboutList):
                value=""
                if index !=6:
                     value=item.text.split(":")[1]
                if index == 0:
                    result["type"]=value
                elif index == 1:
                    result["numberof_pages"]=value
                elif index == 2:
                    result["isbn"]=value
                elif index == 3:
                     result["size"] = value
                elif index == 4 :
                     result["book_cover"]=value
                elif index ==5 :
                     result ["paper_type"]=value
            return result

    except:
            print("element bulunamadı veya süre aşımına uğradı.") 
            return None




