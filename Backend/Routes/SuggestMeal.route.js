const express= require('express');
const Authentication = require('../Middleware/Middleware');
const SuggestFood = require('../SuggestFood/SuggestFoods');
const router= express.Router();

router.get("/mealplanner",Authentication,SuggestFood)
module.exports= router
