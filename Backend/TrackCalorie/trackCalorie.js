const TrackCalorie = require("../Models/CalorieConsume.models");
const mealModel = require("../Models/MealModels.Models");



const CaloriesTracking= async(req,res)=>{

try {
    const {foodid}= req.params;
   const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
    const existingPlan = await mealModel.findOne({
      userID: req.user.id,
      Date: { $gte: todayStart, $lte: todayEnd }
    });
  
if(!existingPlan){
        return res.status(404).json({ success: false, message: "couldnot find today food" });

}

        const trackingCalorie= await TrackCalorie.findOne({userID:req.user.id, Date: { $gte: todayStart, $lte: todayEnd }})
   
    if(!trackingCalorie){
        return res.status(404).json({ success: false, message: "first generate food items for today and save calorie" });

    }


    if (foodid) {
      const foodItem = existingPlan?.Meal.find(m => m._id.toString() === foodid);
      if (!foodItem) {
        return res.status(404).json({ success: false, message: "Food item not found in today's plan" });
      }
      trackingCalorie.CalorieConsume+= foodItem.Calories
        trackingCalorie.ProtienConsume+= foodItem.Protein
          trackingCalorie.CarbsConsume+= foodItem.Carbs
            trackingCalorie.FatConsume+= foodItem.Fats
          await trackingCalorie.save();

      return res.status(200).json({


        success:true,
        message:"calories added successfullt"
      })

    
} 
}

catch (error) {
          return res.status(500).json({


        success:false,
        message:"internal server error"
      })

}


}
module.exports= CaloriesTracking