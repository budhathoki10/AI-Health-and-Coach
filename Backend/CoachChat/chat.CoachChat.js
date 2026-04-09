const { success } = require("zod");
const AIModel = require("../AIModel/AIModel");
const mealModel = require("../Models/MealModels.Models");
const userModel = require("../Models/UserData.models");
const workoutModel = require("../Models/WorkOutModel.Model");
const TrackCalorie = require("../Models/CalorieConsume.models");

const CoachChat =async (req,res)=>{
    try {
        const {message}= req.body;
        const userdata = await userModel.findOne({ email: req.user.email });
        const workout= await workoutModel.findOne({userID:req.user.id})
        console.log("workput",workout)
        
        const bodyTargets = workout.exercises.map(ex => ex.BodyTarget);
        
        console.log("kushal is this")
        const uniqueTargets = bodyTargets.filter((value, index, self) => 
            self.indexOf(value) === index
    );
    console.log("Body targets:", uniqueTargets)

        // console.log("user data is", userdata);
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
         const trackingCalorie= await TrackCalorie.findOne({userID:req.user.id, Date: { $gte: todayStart, $lte: todayEnd }})

        let goalType = userdata.goalType;
        let ExerciseLevel = userdata.ExerciseLevel;
        let age = userdata.age;
        let height = userdata.height;
        let weight = userdata.weight;
        let dietaryRestrictions = userdata.dietaryRestrictions;
        
        
        
   const totalCalorie= async(req,res)=>{
       const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
         const todayMeals = await mealModel.findOne({
            userID:req.user.id,
            Date: { $gte: todayStart, $lte: todayEnd },
          });
         
          if (!todayMeals || !todayMeals.Meal) return 0;
         
          return todayMeals.Meal.reduce((sum, m) => sum + (m.Calories || 0), 0);
   }


console.log("helslss")
    let prompt = 
    `You are a personal AI health and fitness coach for ${userdata.name}.
 
User Profile:
- Age: ${age || "unknown"} years
- Weight: ${weight|| "unknown"} kg
- Height: ${height || "unknown"} cm
- Goal: ${goalType}
- Activity level: ${ExerciseLevel}
- Diet restrictions: ${dietaryRestrictions}
 
Today's Nutrition:
- Total calorie in food: ${totalCalorie} kcal
- consumed calories: ${trackingCalorie.CalorieConsume || 0}
- remaining calories: ${(totalCalorie)-(trackingCalorie.CalorieConsume || 0)}

 
Coaching Rules:
- if user ask about today exercise told him/her (${uniqueTargets}) and explain it little saying you have this and this od 3-3  set of 4-4 reps. 
- Always address the user by name (${userdata.name})
- Give specific advice based on their goal (${goalType})
- Be encouraging, concise, and practical
- Never give generic advice — always relate to their profile
- If they ask about meals, respect their diet (${dietaryRestrictions})
- Keep responses under 150 words unless a detailed explanation is needed
- Never recommend seeing a doctor unless it's a medical emergency
  .trim();
- return message in a paragraph format



  these are the rules for you to respond. user will send you custom message and you have to reply based on it

  User Message is ${message}
  
  `
const response= await AIModel(prompt)
res.status(200).json({

    success:true,
    message:"Ai response",
    data:response
})
} catch (error) {
res.status(500).json({
    success:false,
    message:"internal server errorsfwfs",
})
}
}

module.exports= CoachChat
