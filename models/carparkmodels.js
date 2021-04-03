const con = require('../database.js');
const geolib = require('geolib');
const axios = require('axios');

//constructor
const Carpark = function(carpark) {
    this.car_park_no = carpark.car_park_no;
    this.address = carpark.address;
    this.parking_lot_type = carpark.parking_lot_type;
    this.latitude = carpark.latitude;
    this.longitude = carpark.longitude;
    this.total_lots = carpark.total_lots;
    this.available_lots = carpark.available_lots;
    this.rate = carpark.rate
    this.satRate = carpark.satRate;
    this.sunRate = carpark.sunRate;
}

//we need find closest
//then sort by rate on react side

Carpark.getClosest = (currLat, currLong, res) => {
    let closestDistanceQuery =
    'SELECT DISTINCT car_park_no, address, latitude, longitude, parking_lot_type, available_lots, total_lots, rate, satRate, sunRate FROM parkinglots;'
    con.query('USE mydb', (err, result) => {
        if(err) throw err;
    })
    updateLots();
    con.query(closestDistanceQuery, (err, result) => {
        if(err) {
            console.log("error: ", err);
            res(null,err);
            return;
        }

        var allCarparkDistances = [];
        var rows = JSON.parse(JSON.stringify(result));

        for(var i = 0; i < rows.length; i++){
            var lat = rows[i].latitude;
            var lng = rows[i].longitude;
            
            var distanceResult = geolib.getDistance(
                { latitude: currLat, longitude: currLong},
                { latitude: lat, longitude: lng}
                , 1)

            var element = {
                car_park_no: rows[i].car_park_no,
                address: rows[i].address,
                parking_lot_type: rows[i].parking_lot_type,
                available_lots: rows[i].available_lots,
                rate:  rows[i].rate,
                satRate: rows[i].satRate,
                sunRate: rows[i].sunRate,
                location:{
                    lat: rows[i].latitude,
                    lng: rows[i].longitude
                },
                distance: distanceResult
            }
            //use an array to store all the values, then sort by
            allCarparkDistances.push(element);
        } //end loop

        console.log("previous " + allCarparkDistances);
        allCarparkDistances.sort(function(a,b) {
            return a.distance - b.distance;
        })
        var results20 = allCarparkDistances.slice(0,20);

        //console.log("final: " + allCarparkDistances);
        res(null, results20);
    })
}

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
        })
        .catch(error => {
            console.log(error);
        })

    //update URA carparks
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
            .then(response => {

                for(var i = 0; i < response.data.Result.length; i++){

                    let carparkid = response.data.Result[i].carparkNo;
                    let availableCarpark = response.data.Result[i].lotsAvailable;

                    console.log("carparkID: " + carparkid + " avail: " + availableCarpark);
                    var updateURAparking = 
                    `UPDATE parkinglots SET available_lots='${availableCarpark}' WHERE car_park_no='${carparkid}'`

                    con.query(updateURAparking, function(error, result){
                        if (error) throw error;
                    })
                } //end loop
            })
            .catch( error => {
                console.log(error);
            })
        })
}

module.exports = Carpark;