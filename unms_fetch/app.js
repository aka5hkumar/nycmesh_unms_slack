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


function parse(){
  client.connect()
  const columns = 'INSERT INTO device_uptime(device_id,hostname,timestamp) VALUES($1, $2, $3) ON CONFLICT DO update set hostname=$2, previoustimestamp=timestamp, timestamp=$3 where device_id=$1;'
  //const columns='INSERT INTO device_uptime(device_id,hostname,timestamp) VALUES($1, $2, $3) RETURNING *'
  var jsonFile = fs.readFileSync("../output/devices.json");
  dataFile=JSON.parse(jsonFile);
  var values=[dataFile[1].identification.id, dataFile[1].identification.hostname, dataFile[1].overview.lastSeen];
  client
  .query(columns,values)
  .then(res => {
  console.log(res.rows[0])
  })
  .catch(e => console.error(e.stack))
  client.end()

/*
  for (var num in dataFile){
    var date = new Date(dataFile[num].overview.lastSeen);
    var values=[dataFile[num].identification.id, dataFile[num].identification.hostname, date]
     client
     .query(columns, values)
     .then(res => {
       console.log(res.rows[0])
     })
    .catch(e => console.error(e.stack))
    console.log(date,'\t', dataFile[num].identification.id,'\t', dataFile[num].identification.hostname)
  }
  client.end()
*/
};


//console.log(getData('devices'))
//parse()

function parse2(){
var jsonFile = fs.readFileSync("../output/devices.json");
dataFile=JSON.parse(jsonFile);
  for (var num in dataFile){
    let insertQuery = {};
    var date = new Date(dataFile[num].overview.lastSeen);
    let params = [dataFile[num].identification.id, dataFile[num].identification.hostname, date];
    insertQuery.text = 'INSERT INTO device_uptime(device_id,hostname,timestamp) VALUES('+dataFile[num].identification.id+','+ dataFile[num].identification.hostname+','+ date+')';
    //insertQuery.values = params;
    let updateQuery = {};
    updateQuery.text = 'UPDATE device_uptime set hostname='+dataFile[num].identification.hostname+', previoustimestamp=timestamp, timestamp='+date+' where device_id=$1';
    //updateQuery.value = [dataFile[num].identification.id, dataFile[num].identification.hostname, date];
    (async () => {
      const client = await myPool.connect(); //assuming myPool is initialized somewhere
      await client.query (updateQuery, (err, result)=>{
          try {
            if (err) throw err;
            if (result.rowCount > 0){
              console.log ('Rows affected: ', result.rowCount);
              return;
            } else {
              client.query(insertQuery, (error, res) =>{
              try {
                if (error) throw error;
                console.log ('Rows affected:', res.rowCount);
              }catch(er){
                console.log(er);
                }finally {
                  //do something here
                }
              });
            }
          }catch (e){
            console.log(e);
            }finally{
              client.release();
            }
      });
      })().catch(e => console.log(e));
  }
}

parse()
