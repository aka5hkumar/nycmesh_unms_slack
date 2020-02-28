//Akash Kumar
fs = require('fs');
require('dotenv').config();
const fetch = require('node-fetch')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

fetch("https://"+process.env.ip+"/nms/api/v2.1/devices",
 {
  "method": "GET",
  "headers": {
    "x-auth-token":process.env.x_auth,
    "accept": "application/json"
  }
})

//.then(function(response){
.then(response => {
    return response.json();
})

//.then(function(json){
.then(json => {
    let output = JSON.stringify(json)
    fs.writeFile('../output/devices.json', output, (err) => {
    if (err) console.log(err);
    });
})

.catch(err => {
    console.log(err);
});
