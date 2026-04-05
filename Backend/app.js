

require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cors())
app.use(cookieParser())

const registrationRoute = require("./Routes/Registration.route")
const LoginRoute = require("./Routes/Login.routes")



mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB")
}
).catch((err) => {
    console.error("Error connecting to MongoDB", err)
})

app.use("/api", registrationRoute)
app.use("/api", LoginRoute)

app.listen(5000,()=>{
    console.log("Server is running on port 5000")
}
)
