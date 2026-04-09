
const AIModel = require("../AIModel/AIModel");
const TrackCalorie = require("../Models/CalorieConsume.models");
const mealModel = require("../Models/MealModels.Models");
const userModel = require("../Models/UserData.models");

const SuggestFood = async (req,res) => {
  try {
    

      const userdata= await userModel.findOne({email:req.user.email})
      // console.log("user data is",userdata)
      let goalType= userdata.goalType
      let ExerciseLevel= userdata.ExerciseLevel
      let dietaryRestrictions= userdata.dietaryRestrictions
      let age= userdata.age
      let height= userdata.height
      let weight= userdata.weight

    function getGoalText(goalType) {
      const map = {
        lose:     "lose weight and reduce body fat",
        gain:     "gain muscle mass and increase strength",
        maintain: "maintain current weight and stay healthy",
      };
      return map[goalType] || "maintain current weight";
    }

    function calculateCalories({ weight, height, age, ExerciseLevel, goalType }) {
      if (!weight || !height || !age) {
        return 2000; 
      }

      const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
      };

      const multiplier = multipliers[ExerciseLevel] || multipliers["moderate"];
      const tdee = bmr * multiplier;

      switch (goalType) {
        case "lose":
          return Math.round(tdee - 500);
        case "gain":
          return Math.round(tdee + 300);
        case "maintain":
        default:
          return Math.round(tdee);
      }
    }

    const calorieTarget = calculateCalories({ weight, height, age, ExerciseLevel, goalType });

    const Prompt = `
You are an expert nutritionist AI.
Generate a personalized daily meal plan and return ONLY a valid JSON array.
No markdown, no backticks, no explanation text — just the raw JSON array.

Each meal object must use EXACTLY these field names:
{
  "MealType": "breakfast" or "lunch" or "dinner" or "snack",
  "Mealname": "specific descriptive meal name",
  "Calories": number (kcal),
  "Protein":  number (grams),
  "Carbs":    number (grams),
  "Fats":     number (grams)
}

Rules:
- Return exactly 4 meals: one breakfast, one lunch, one dinner, one snack
- provide the foods according to goal type like if the goalType is gain then suggest high protien foods and vice versa and manage the protien according to goalType
- All values must be numbers not strings
- Meal names must be specific and appealing (e.g. "Grilled Salmon Power Bowl" not "salmon")
- Macros must be realistic and consistent with Calories: (Protein*4) + (Carbs*4) + (Fats*9) ≈ Calories
- provide a recommended time for each meal 

User Profile:
- Age: ${age || "not set"} years
- Weight: ${weight || "not set"} kg
- Height: ${height || "not set"} cm
- Goal: ${getGoalText(goalType)}
- ExerciseLevel: ${ExerciseLevel}
- dietaryRestrictions: ${dietaryRestrictions}
- Daily calorie target: ${calorieTarget} kcal

Generate today's meal plan for this user.
Strictly respect the diet preference: ${dietaryRestrictions}.
If vegetarian — no meat, no fish in any meal.
If Non vegetarian — include a mix of chicken, fish, eggs, or meat and can also add some plant-based options for carbs.
return array of json for four foods
`;

// const aiMeals= await AIModel(Prompt, res);
// console.log("Ai meals",aiMeals)
// if (!aiMeals || !Array.isArray(aiMeals) || aiMeals.length === 0) {
//   return res.status(500).json({
//     success: false,
//     message: "AI did not return a valid meal plan"
//   });
// }


   const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

    // Check if today's plan exists
    const existingPlan = await mealModel.findOne({
      userID: req.user._id,
      Date: { $gte: todayStart, $lte: todayEnd }
    });

    
    if (existingPlan) {
      return res.status(200).json({
        success: true,
        message: "Today's meal plan already exists",
        data: existingPlan
      });
    }
    // console.log(existingPlan)

    const aiMeals= await AIModel(Prompt, res);
//  console.log("Ai meals",aiMeals)
if (!aiMeals || !Array.isArray(aiMeals) || aiMeals.length === 0) {
  return res.status(500).json({
    success: false,
    message: "AI did not return a valid meal plan"
  });
}
// Generate new plan
const savedPlan = await mealModel.create({
  userID: req.user._id,
  Date: new Date(),
  Meal: aiMeals
});
const totalCalories = savedPlan.Meal.reduce((sum, meal) => sum + meal.Calories, 0);
const totalProtein = savedPlan.Meal.reduce((sum, meal) => sum + meal.Protein, 0);
const totalCarbss = savedPlan.Meal.reduce((sum, meal) => sum + meal.Carbs, 0);
const totalFats = savedPlan.Meal.reduce((sum, meal) => sum + meal.Fats, 0);
console.log(savedPlan)
    await TrackCalorie.create({
      userID:req.user.id,
      foodID:savedPlan._id,
      TotalCalorie:totalCalories,
      TotalProtien:totalProtein,
      TotalCarbs:totalCarbss,
      TotalFats:totalFats
    })
    return res.status(201).json({
      success: true,
      message: "New meal plan generated and saved",
      data: savedPlan
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    if (error.status === 503) {
      return res.status(503).send("Gemini service is overloaded. Try again in a few minutes.");
    }

    res.status(500).send("Unexpected error occurred.");
  }
};

module.exports = SuggestFood;
