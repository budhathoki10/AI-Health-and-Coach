const userModel = require("../Models/UserData.models")
const bcrypt = require("bcrypt")
const registerValidation = require("../Validations/RegisterValidation.validation")
const jwt= require("jsonwebtoken")
const { z } = require("zod")
const Register= async(req,res)=>{
      const parsedData = registerValidation.parse(req.body);
    const { name, email, password } = parsedData;

try {
    const findUser = await userModel.findOne({ email });
    if (findUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
        name,
        email,
        password: hashedPassword
    });
    console.log(newUser)
    await newUser.save();
    const token = jwt.sign({ id: newUser.id,email: newUser.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.cookie("token", token).status(200).json({
        success: true,
        message: "User registered successfully",
        token:token
    });


} catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return res.status(500).json({
        status: "internal server errorssssssssssss",
        errors: error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
        
        success:false,
        message:"Internal Server Errors"})

        
}

}
module.exports= Register
