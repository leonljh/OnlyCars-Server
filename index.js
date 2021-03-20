const express = require('express');
const app = express();
const axios = require('axios');
const mysql = require('mysql');

//initializes and connect to database
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678"
});

con.connect((err) => {
    if(err){
        console.log("Error connecting to DB");
        return;
    }
    console.log("Database Connection Established");
})

/*Create Table using this query in the GUI, otherwise just put this in a query

CREATE TABLE parkinglots (
	CarparkID varchar(255),
    Address   varchar(255),
    xcoord	  float,
    ycoord	  float
    )

*/

function init(){
    
//this is to get carpark details (carparkID, longitude, latitude)
// axios.get('https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c')
//     .then(response => {
//         //console.log(response.data.result.records[1]);
//         var arrayOfCarparks = response.data.result.records;
//         for(var i = 0; i < arrayOfCarparks.length; i++){

//             let id = arrayOfCarparks[i].car_park_no;
//             let address = arrayOfCarparks[i].address;
//             let xCoord = arrayOfCarparks[i].x_coord;
//             let yCoord = arrayOfCarparks[i].y_coord;
//             //console.log(id + " " + address + " " + xCoord + " " + yCoord + " ");

//             //create database update using INSERT INTO 
//             var sqlUpdateTable = 
//             `INSERT INTO parkinglots (CarparkID, Address, xcoord, ycoord) VALUES ( '${id}', '${address}', '${xCoord}', '${yCoord}')`;
//             //console.log(sqlUpdateTable);
//             con.query("USE mydb", function (err,result) {
//                 if(err) throw err;
//                 console.log("Using mydb");
//             })
//             con.query(sqlUpdateTable, function (err,result) {
//                 if(err) throw err;
//                 console.log("Record Inserted!");
//             })
//         }
//         //carpark_no | address | x-coord | y-coord
//     })
//     .catch(error => {
//         console.log(error);
//     })

//this is to get carpark number of lots available. with respect to the carparkID
axios.get('https://api.data.gov.sg/v1/transport/carpark-availability')
    .then(response => {

        //console.log(response.data.items[0].carpark_data);
        for(var i = 0; i < response.data.items[0].carpark_data.length; i++){
            let carparkID = response.data.items[0].carpark_data[i].carpark_number;
            let carparkAvailLots = response.data.items[0].carpark_data[i].carpark_info[0].lots_available;
            let carparkTotalLots = response.data.items[0].carpark_data[i].carpark_info[0].total_lots;
            
            //now search db based on data
        }
        //console.log(carparkID + " " + carparkLotsLeft + " " + carparkLotsTotal);
        // carpark_no (key) | carpark_info.total_lots | carpark_info.lots_available
    })
    .catch(error => {
        console.log(error);
    })

//URA carpark API call for all carparks
var token = "";
axios.get('https://www.ura.gov.sg/uraDataService/insertNewToken.action', {
    headers: {
        AccessKey: 'bafa6ff4-883d-4db0-9a12-494053267254'
    }
    })
    .then(response => {
        token = response.data.Result;
        //get carpark_details
        return axios.get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability', {
            headers: {
                AccessKey: 'bafa6ff4-883d-4db0-9a12-494053267254',
                Token: token
            }
        })
    })
    .then( response => {
        // carpark_no | address | x-coordinates | y-coordinates 
        //console.log(response.data.Result[0]);
        //get list and rates
        return axios.get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
            headers: {
                AccessKey: 'bafa6ff4-883d-4db0-9a12-494053267254',
                Token: token
            }
        })
    })
    .then(response => {
        //console.log(response.data.Result[0]);
    })
    .catch(error => {
        console.log(error);
    })
}
/* 
now to setup the database using carparkId as the key, and place them as:
carparkId | carpark address | lat | long | total lots |available lots left 
*/



init();

