import requests
import routeros_api
from dotenv import load_dotenv
load_dotenv()
import os 
import urllib3
#requests.packages.urllib3.disable_warnings() 

def envCheck():
  print(os.environ.get('test-api-token'))

class Parse:
  def __init__(self):
      self.interface = set()
  def get_unms(self, host,api,route):
    headers = {'User-Agent': 'unms-status',
            'X-Auth-Token': api
            }
    r = requests.get("https://"+host+"/nms/api/v2.1/"+route, headers=headers, verify=False)
    return (r.json())
  def manufacturer_assign(self, devices_json, sites_json):
      tempset=set()
      database_list = []
      blackbox_count = 0
      database_blackbox = []
      database_ubiquiti = []
      for device in devices_json:
        DEVICE_id = device['identification']['id']
        DEVICE_name = device['identification']['name']
        DEVICE_type = device['identification']['type']
        DEVICE_status = device['overview']['status']
        
        if DEVICE_type == 'blackBox' and DEVICE_status == 'active' :
          blackbox_count += 1
          self.mikrotik(device['ipAddress'])
        else:
          self.ubiquiti(sites_json)

        database_list.append((DEVICE_id, DEVICE_name, DEVICE_type, DEVICE_status))
        tempset.add((DEVICE_type, DEVICE_status))
      return (tempset, self.interface)
    
  def ubiquiti(self, sites):
    for site in sites:
      site['id']

  def mikrotik(self, ip, ip_arr=[]):
    ip_arr.append(ip)
    #make Multithreaded
    print(ip)
    def mikrotikConnect(ip):
      list_address = api.get_resource('/ip/dhcp-server/lease')
      json_response = list_address.get()
      print(json_response)
      for interface in json_response:
        try:
          self.interface.add(interface['host-name'])
        except KeyError:
          print(KeyError)
    try:
      connection = routeros_api.RouterOsApiPool(ip, username=os.environ.get('omni_user'), password=os.environ.get('omni_pass'), plaintext_login=True)
      api = connection.get_api()
      mikrotikConnect(ip)
    except:
      try: 
        connection = routeros_api.RouterOsApiPool(ip, username=os.environ.get('omni_user'), password=os.environ.get('omni_pass_2'), plaintext_login=True)
        api = connection.get_api()
        mikrotikConnect(ip)
      except:
        print('RouterOS Error')

def main():
  Parsed = Parse()
  return Parsed.manufacturer_assign(Parsed.get_unms(os.environ.get("unms_host"), os.environ.get('unms_key'), 'devices'), Parsed.get_unms(os.environ.get("unms_host"), os.environ.get('unms_key'), 'sites'))

      
if __name__ == "__main__":
    #envCheck()
    print(main())
    
   
