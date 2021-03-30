const Carpark = require('../models/carparkmodels.js');

//retrieve closest carparks
exports.getClosest = (req, res) => {
    Carpark.getClosest(req.query.lat, req.query.long, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error has occured while retrieving ParkingLots"
            });
        else res.send(data);
    })
};