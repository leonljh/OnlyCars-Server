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

/*
BEFORE YOU START, DOWNLOAD MYSQL WORKBENCH AND PASTE THIS:

    CREATE TABLE parkinglots (
        CarparkID varchar(255),
        Address   varchar(255),
        xcoord	  float,
        ycoord	  float
    )

    THEN USE THE CSV AND LOAD THE CSV INTO MYSQL
    LOAD DATA LOCAL INFILE ({CSV FILE LOCATION} ETC, google it

    THEN RUN THIS FILE
*/

//this is to get carpark number of lots available. with respect to the carparkID
// axios.get('https://api.data.gov.sg/v1/transport/carpark-availability')
//     .then(response => {

//         con.query("USE mydb", function (err,result) {
//             if(err) throw err;
//             console.log("Using mydb");
//         })

//         var count = 0;
//         for(var i = 0; i < response.data.items[0].carpark_data.length; i++){
//             let carparkID = response.data.items[0].carpark_data[i].carpark_number;
//             let carparkAvailLots = response.data.items[0].carpark_data[i].carpark_info[0].lots_available;
//             let carparkTotalLots = response.data.items[0].carpark_data[i].carpark_info[0].total_lots;

//             //turn off safe mode to update SQL db
//             //some parkinglotID not available
//             count++;
//             var sqlAddAvailableLots = 
//             `UPDATE parkinglots SET available_lots='${carparkAvailLots}', total_lots='${carparkTotalLots}' WHERE car_park_no='${carparkID}'`;

//             con.query(sqlAddAvailableLots, function (err, result) {
//                 if(err) throw err;
//                 //console.log(carparkID + " updated");
//             })
//         }
//         console.log(count + " rows have been updated");
//     })
//     .catch(error => {
//         console.log(error);
//     })


//URA carpark API call for all carparks
//gets token for URA API calls
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
    //Uses token to call for all carparks lists and rates
    .then( response => {
        //update your database here
        con.query("USE mydb", function (err,result) {
            if(err) throw err;
            console.log("Using mydb");
        })

        for(var i = 0; i < response.data.Result.length; i++){
            let carparkID = response.data.Result[i].carparkNo;
            let address = response.data.Result[i].geometries[0].coordinates; //gives a string, string split
            const [xcoord,ycoord] = address.split(',');
            let availableLots = response.data.Result[i].lotsAvailable;

            //console.log("CarparkID: " + carparkID + " xcoord: " + xcoord + " ycoord: " + ycoord + "total lots: " + total_lots);

            var sqlPopularURACarpark = 
            `INSERT INTO parkinglots ('car_park_no', 'address', 'x_coord', 'y_coord', 'available_lots') VALUES ('${carparkID}', ${xcoord} , ${ycoord} , ${availableLots})`
            
            con.query(sqlPopularURACarpark, function (err, result) {
                if(err) throw err;
                //console.log(carparkID + " updated");
            })
        }
        /*
        "weekdayMin": "30 mins",
            "weekdayRate": "$0.60",
            "ppCode": "A0004",              -> Carpark ID
            "parkingSystem": "C",
            "ppName": "ALIWAL STREET ",     -> Address
            "vehCat": "Car",
            "satdayMin": "30 mins",
            "satdayRate": "$0.60",
            "sunPHMin": "30 mins",
            "sunPHRate": "$0.60",
            "geometries": [
                {
                    "coordinates": "31045.6165,31694.0055" -> xcoord, ycoord
                },
            "startTime": "07.00 AM",
            "parkCapacity": 112,            ->total_Lots
            "endTime": "10.30 PM"
        */

        //get list and rates
        return axios.get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
            headers: {
                AccessKey: 'bafa6ff4-883d-4db0-9a12-494053267254',
                Token: token
            }
        })
    })
    .then(response => {
        //update your database here

        /*
         "carparkNo": "S0049",
            "geometries": [
                {
                    "coordinates": "30812.1957,33019.1062"
                }
            ],
            "lotsAvailable": "111",         -> available_lots
            "lotType": "C"
        */

        //console.log(response.data.Result);
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

