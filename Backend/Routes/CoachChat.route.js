const express= require("express")
const CoachChat= require("../CoachChat/chat.CoachChat")
const Authentication= require("../Middleware/Middleware")
const router= express.Router()
router.post("/coachChat",Authentication,CoachChat)


module.exports= router