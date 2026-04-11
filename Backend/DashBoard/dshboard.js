const TrackCalorie = require("../Models/CalorieConsume.models")

const TrackCaloriess= async(req,res)=>{

try {
    console.log("hello")
          const todayStart = new Date(); todayStart.setHours(0,0,0,0);
            const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
        
    
    
    const findData= await TrackCalorie.find({
        userID:req.user.id,
        Date: { $gte: todayStart, $lte: todayEnd }
    })
    if(!findData){
    return res.status(404).json({
        success:false,
        message:"no record founf for you"
    })
    
    }
    return res.status(200).json({
        success:true,
        message:"Calories datas found for today",
        data: findData
    })
    
} catch (error) {
    res.status(500).json({message:"internal server error "})
}
}
module.exports= TrackCaloriess