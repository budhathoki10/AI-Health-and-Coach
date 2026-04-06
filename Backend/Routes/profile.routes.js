const express = require('express');
const router = express.Router();
const Authentication= require("../Middleware/Middleware")
const userModel= require("../Models/UserData.models")
const mealModel= require("../Models/MealModels.Models")
const workoutModel= require("../Models/WorkOutModel.Model");
const { ProfileDetails,GetProfileDetails } = require('../Profile/ProfileDetails');


router.post("/fillProfileData",Authentication,ProfileDetails);

router.get("/profile",Authentication,GetProfileDetails);
module.exports= router