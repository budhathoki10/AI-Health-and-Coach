const express = require("express");
const Authentication = require("../Middleware/Middleware");
const CaloriesTracking = require("../TrackCalorie/trackCalorie");

const router = express.Router();
router.post("/trackCalories/:foodid", Authentication, CaloriesTracking);

module.exports = router;
