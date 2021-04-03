module.exports = app => {
    const parkinglots = require('../controllers/parkinglots.controller.js');

    app.get("/nearestlots", parkinglots.getClosest);
}