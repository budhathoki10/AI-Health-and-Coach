const Register = require("../LoginRegistration/Regiatration.LoginRegistration")
const express = require("express")
const router = express.Router()
router.post("/register", Register)
module.exports = router
