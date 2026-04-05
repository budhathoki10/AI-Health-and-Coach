const express= require('express');
const Login= require("../LoginRegistration/Login.LoginRegistration")
const router= express.Router();

router.post("/login",Login)

module.exports= router
