const jwt= require("jsonwebtoken")
const userModel = require("../Models/UserData.models")


const Login= async(req,res)=>{
    const { email, password } = req.body;
try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid password"
        });
    }
    const token = jwt.sign({ id: findUser.id,email: findUser.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.cookie("token", token).status(200).json({
        success: true,
        message: "User logged in successfully",
        token:token
    });

} catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"})
}
}
module.exports= Login

