const express = require("express");
const mysql = require('mysql');
const geolib = require('geolib');
const { default: axios } = require('axios');

const app = express();

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my REST API application." });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require("./routes/parkinglot.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

//create connection to mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678"
});

//connect to db
con.connect((err) => {
    if(err){
        console.log("Error connecting to DB");
        return;
    }
    console.log("Database Connection Established");
})