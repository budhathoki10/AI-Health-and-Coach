const jwt= require("jsonwebtoken")
const userModel= require("../Models/userModel")
const Authentication= async(req,res,next)=>{
try {
      
    const token= (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies['token']
    if(!token){
return res.status(400).json({
    success:false,
    message:"unauthorized, token not found"
})
    }



const verifytoken= jwt.verify(token,process.env.JWT_SECRET)
// console.log(verifytoken)
if(!verifytoken){
   return  res.status(400).json({
    success:false,
    message:"unauthorized, token not verified"
})


}


const userdata= await userModel.findById(verifytoken.id)
if(!userdata){
 return  res.status(400).json({
    success:false,
    message:"unauthorized, user is not found with this id"
})
}
req.user=userdata
 next()
  
} catch (error) {
   return  res.status(400).json({
    success:false,
    message:"internal server error in authentication"
}) 
}
}
module.exports= Authentication