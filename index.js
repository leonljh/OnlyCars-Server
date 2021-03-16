const express = require('express');
const app = express();
const axios = require('axios');

function init(){
    
//this is to get carpark details (carparkID, longitude, latitude)
axios.get('https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c')
    .then(response => {
        console.log(response.data.result.records);
        //car park no. | address | x-coord | y-coord |  free_parking | 
    })
    .catch(error => {
        console.log(error);
    })

//this is to get carpark number of lots available. with respect to the carparkID
// axios.get('https://api.data.gov.sg/v1/transport/carpark-availability')
//     .then(response => {
//         for(var i = 0; i < response.data.items[0].carpark_data.length; i++){
//             console.log(response.data.items[0].carpark_data[i].carpark_info);
//         }
//         // carpark_no | carpark_info | lots available
//         // carpark_data | carpark_data[0].lots_available | carpark_data[0].lot_type
//     })
//     .catch(error => {
//         console.log(error);
//     })

//URA carpark API call for all carparks
// axios.get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
//     headers: {
//         AccessKey: 'bafa6ff4-883d-4db0-9a12-494053267254',
//         Token: '32-m8eMdfRa48E@G79-kdmV9SfC2t6-at32V41kb409625825Ak6S6D535f9f4gbP0782-A7Z2b9aafmW-WqYsf21c-bX3WWwh4M'
//     }
//     })
//     .then(response => {
//         console.log(response.data.Result);
//         //pull out what you need into sql
//     })
//     .catch(error => {
//         console.log(error);
//     })
// }

//get parking rates
// axios.get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
//     headers: {
//         AccessKey: 'bafa6ff4-883d-4db0-9a12-494053267254',
//         Token: '32-m8eMdfRa48E@G79-kdmV9SfC2t6-at32V41kb409625825Ak6S6D535f9f4gbP0782-A7Z2b9aafmW-WqYsf21c-bX3WWwh4M'
//     }
//     })
//     .then(response => {
//         console.log(response.data.Result);
//         //pull out what you need into sql
//     })
//     .catch(error => {
//         console.log(error);
//     })
// }

/* 
now to setup the database using carparkId as the key, and place them as:
carparkId | carpark address | lat | long | total lots |available lots left 
*/
}

init();