//This page is purely for initialization of the DB. Use it once, thats all.

const svy21 = require('./conversion.js');
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
//             `UPDATE parkinglots SET available_lots='${carparkAvailLots}', total_lots='${carparkTotalLots}' WHERE         car_park_no='${carparkID}'`;

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
        //for(var i = 0; i < response.data.Result.length; i++){
            // let carparkID = response.data.Result[i].carparkNo;
            // let address = response.data.Result[i].geometries[0].coordinates; //gives a string, string split
            // const [xcoord,ycoord] = address.split(',');
            // let availableLots = response.data.Result[i].lotsAvailable;

            //console.log("CarparkID: " + carparkID + " xcoord: " + xcoord + " ycoord: " + ycoord + "total lots: " + availableLots);

            // var sqlPopularURACarpark = 
            // `INSERT INTO parkinglots(car_park_no, x_coord, y_coord, available_lots) VALUES ('${carparkID}', '${xcoord}' , '${ycoord}' , '${availableLots}')`
            //updates URA parking data
            
            // con.query(sqlPopularURACarpark, function (err, result) {
            //     if(err) throw err;
            // })
        //}
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
            
            //take out only vehicles=cars data
            // for(var i = 0; i < response.data.Result.length; i++){
            //     let elementData = response.data.Result[i];
            //     let vehicleType = elementData.vehCat;
            //     if(vehicleType === 'Car'){
            //         let carparkID = elementData.ppCode;
            //         let address = elementData.ppName;

            //         let weekdayRatePre = elementData.weekdayRate;
            //         let weekdayRate = weekdayRatePre.substring(1);
            //         console.log("weekdayRatePre: " + weekdayRatePre);

            //         let satRatePre = elementData.satdayRate;
            //         let satRate = satRatePre.substring(1);
            //         console.log("satRatePre: " + satRatePre);

            //         let sunRatePre = elementData.sunPHRate;
            //         let sunRate = sunRatePre.substring(1);
            //         console.log("sunRatePre: " + sunRatePre);

            //         let location = elementData.geometries[0].coordinates;
            //         const [xcoord, ycoord] = location.split(',');
            //         let total_lots = elementData.parkCapacity;

            //         var sqlUpdateQuery = 
            //         `INSERT INTO parkinglots (car_park_no, address, x_coord, y_coord, total_lots, rate, satRate, sunRate, parking_lot_type) VALUE ('${carparkID}', '${address}', '${xcoord}', '${ycoord}', '${total_lots}', '${weekdayRate}', '${satRate}', '${sunRate}', 'URA')`

            //         con.query(sqlUpdateQuery, function (err, result) {
            //             if(err) throw err;
            //         })
                // }
                // else{
                //     continue;
                // }
            //}
            
    })
    .catch(error => {
        console.log(error);
    })


//TO-DO
//CONVERT XCOORD AND YCOORD TO LAT LNG

}

//TO-DO: Set HDB Parking Rates to 0.6 or 1.2 based on location, and check timing for those 1.2 if its past 5. easier to
//hard code than set it in db.
//URA rates dont touch, add a column which states the timings.

/*
it is seen that URA usually has data from 7am - 10:30pm (0.6)... and 10:30pm to 7am data... where the latter is capped at $5
*/

//init();

//var test = new svy21();

//var result = test.computeLatLon(31490.4942,30314.7936);
var selectAll = 'SELECT x_coord, y_coord, car_park_no FROM parkinglots';
//take northing easting data, create new column and convert into lat long

con.query("USE mydb", function (err,result) {
    if(err) throw err;
    console.log("Using mydb");
})

con.query(selectAll, function(error, results, fields) {
    if(error) {
        console.log(error);
        return;
    }
    var rows = JSON.parse(JSON.stringify(results));
    console.log(rows);
    var test = new svy21();

    //HDB: Y first, then X (ACB) console.log(test.computeLatLon(31490.4942,30314.7936));

    for(var i = 0; i < rows.length; i++){

        var northing = rows[i].x_coord;
        var easting = rows[i].y_coord;
        var carparkNo = rows[i].car_park_no;
        var location1 = test.computeLatLon(easting,northing);
        var lat = location1.lat;
        var long = location1.lon;

        var sqlQuery = 
        `UPDATE parkinglots SET latitude='${lat}', longitude='${long}' WHERE car_park_no='${carparkNo}'`
 
        con.query(sqlQuery, function (error, result){
            if(error) throw error;
            console.log(result);
        })
    }
});

// here it will be undefined