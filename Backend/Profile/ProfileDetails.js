const userModel= require("../Models/UserData.models")

const ProfileDetails= async(req,res)=>{
    try {
        const {age,height,weight,goalType,dietaryRestrictions,ExerciseLevel,}=req.body
        const  FindByemail= await userModel.findOne({email:req.user.email})
        if(!FindByemail){
            return res.status(400).json({
                success:false,
                message:"user not found with this email"
            })
        }
        const updateProfile= await userModel.findByIdAndUpdate(FindByemail._id,{
            age:age,
            height:height,
            weight:weight,
            goalType:goalType,
            ExerciseLevel:ExerciseLevel,
            dietaryRestrictions:dietaryRestrictions,
            profileComplete:true
        },{new:true})
        if(!updateProfile){
            return res.status(400).json({
                success:false,
                message:"failed to update profile details"
            })
        }
        return res.status(200).json({
            success:true,
            message:"profile details updated successfully",
            data:updateProfile
        })
        

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}
const GetProfileDetails= async(req,res)=>{
    try {
        const FindByemail= await userModel.findOne({email:req.user.email})          
        if(!FindByemail){
            return res.status(400).json({
                success:false,


                message:"user not found with this email"
            })
        }
        return res.status(200).json({
            success:true,
            message:"profile details fetched successfully",
            data:FindByemail
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}
module.exports= {ProfileDetails,GetProfileDetails}