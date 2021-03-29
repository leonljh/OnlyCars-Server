//Link this up with React
//Connect database to this main page
//Use axios to call and update the API.
const mysql = require('mysql');
const geolib = require('geolib');
const { default: axios } = require('axios');

//Take input from Google Maps API and get the lat long of user selected
// var express = require('express'),
//   app = express(),
//   port = process.env.PORT || 3000;

// app.listen(port);
// console.log("REST API Server started");

// console.log('todo list RESTful API server started on: ' + port);

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

//Distance calculation:
//get destination location
//compare every value with every parkinglot in database
//get data at closest distance

var selectAllLatLng = 
"SELECT * FROM parkinglots";

//connect to db
con.query('USE mydb', function (err,result){
    if(err) throw err;
    console.log("Database Connection Established");
})

//query
con.query(selectAllLatLng, function (err,result){
    if(err) throw err;

    var rows = JSON.parse(JSON.stringify(result));
    //console.log(rows);
    var distances = [];
    for(var i = 0; i < rows.length; i++){

        var lat = rows[i].latitude;
        var lng = rows[i].longitude;

        var distance = geolib.getDistance(
            { latitude: 1.3836286, longitude: 103.738781},
            { latitude: lat, longitude: lng},
            10
        )
        
        distances.push(distance);
     } //end loop
})

function updateLots(){
    //this function updates the database to the most recent data from URA and HDB

    //update HDB carparks
    axios.get('https://api.data.gov.sg/v1/transport/carpark-availability')
        .then(response => {
            var count = 0;
            for(var i = 0; i < response.data.items[0].carpark_data.length; i++){

                let carparkAvailLots = response.data.items[0].carpark_data[i].carpark_info[0].lots_available;
                let carparkid = response.data.items[0].carpark_data[i].carpark_number;

                let getUpdatedCarparks =
                `UPDATE parkinglots SET available_lots='${carparkAvailLots}' WHERE car_park_no='${carparkid}'`

                con.query(getUpdatedCarparks, function(err, result){
                    if (err) throw err;
                    count++;
                })
            }//end loop
            console.log(count + " entries updated");
        })
        .catch(error => {
            console.log(error);
        })

    //update URA carparks
    axios.get()
}

updateLots();