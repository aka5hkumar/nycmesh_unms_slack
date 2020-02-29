//Akash Kumar
fs = require('fs');
require('dotenv').config();
const fetch = require('node-fetch')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
  var jsonFile = fs.readFileSync("../output/devices.json");
  dataFile=JSON.parse(jsonFile);
  for (var num in dataFile){
    console.log(dataFile[num].overview.lastSeen)
  }
  console.log(dataFile[1].overview.lastSeen)
};


parse()