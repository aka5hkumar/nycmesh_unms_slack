//Akash Kumar
fs = require('fs');
require('dotenv').config();
const fetch = require('node-fetch')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  database: 'postgres',
  password: process.env.postgres_pw
})
function getData(endpoint){ //get the JSON devices file
  fetch("https://"+process.env.ip+"/nms/api/v2.1/"+endpoint,
  {
    "method": "GET",
    "headers": {
      "x-auth-token":process.env.x_auth,
      "accept": "application/json"
    }
  })

  .then(response => {
      return response.json();
  })

  .then(json => {
      let output = JSON.stringify(json)
      fs.writeFile('../output/'+endpoint+'.json', output, (err) => {
      if (err) console.log(err);
      });
  })

  .catch(err => {
      console.log(err);
  });
};
//getData('devices')

function parse(){
  client.connect()
  const columns='INSERT INTO device_uptime(device_id,hostname,timestamp) VALUES($1, $2, $3) RETURNING *'
  var jsonFile = fs.readFileSync("../output/devices.json");
  dataFile=JSON.parse(jsonFile);
  for (var num in dataFile){
    var date = new Date(dataFile[num].overview.lastSeen);
    var values=[dataFile[num].identification.id, dataFile[num].identification.hostname, date]
    client
    .query(columns, values)
    .then(res => {
      console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack))
    //console.log(date,'\t', dataFile[num].identification.id,'\t', dataFile[num].identification.hostname)
  }
  client.end()
};



parse()

