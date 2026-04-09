const Authentication= require("../Middleware/Middleware")
const express= require("express")
const WorkoutData = require("../Workout/Workout")
const router= express.Router()

router.get("/workout",Authentication,WorkoutData)
module.exports= router