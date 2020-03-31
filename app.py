import pandas as pd
import json
with open('devices.json') as f:
  jsonfile = json.load(f)

df = pd.DataFrame(
    [
    data['identification']['id'], 
    data['identification']['name'],
    data['identification']['role'],
    data['overview']['status'],
    data['overview']['canUpgrade'],
    data['overview']['downlinkCapacity'],
    data['overview']['uplinkCapacity'],
    data['overview']['uptime'],
    ] 
    for data in jsonfile)
    
# print(jsonfile[0]['identification']['id'])
# print(jsonfile[0]['identification']['name'])
# print(jsonfile[0]['identification']['role'])
# print(jsonfile[0]['overview']['status'])
# print(jsonfile[0]['overview']['canUpgrade'])
# print(jsonfile[0]['overview']['downlinkCapacity'])
# print(jsonfile[0]['overview']['uplinkCapacity'])
# print(jsonfile[0]['overview']['uptime'])

df.to_csv('devices.csv', index=False)