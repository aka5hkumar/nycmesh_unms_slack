import requests
import routeros_api
from dotenv import load_dotenv
load_dotenv()
import os 
import urllib3
#requests.packages.urllib3.disable_warnings() 

def envCheck():
  print(os.environ.get('test-api-token'))

def get_unms(host,api,route):
  headers = {'User-Agent': 'unms-status',
           'X-Auth-Token': api
           }
  r = requests.get("https://"+host+"/nms/api/v2.1/"+route, headers=headers, verify=False)
  return (r.json())
if __name__ == "__main__":
    #envCheck()
    devices = get_unms(os.environ.get("unms_host"), os.environ.get('unms_key'), 'devices')
    tempset=set()
    for device in devices:
      tempset.add((device['identification']['type']))
    print(tempset)
      
   
