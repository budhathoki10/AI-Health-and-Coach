const AIModel = require("../AIModel/AIModel");
const userModel = require("../Models/UserData.models");
const workoutModel = require("../Models/WorkOutModel.Model");

const WorkoutData = async (req, res) => {
  try {
    const userdata = await userModel.findOne({ email: req.user.email });
    console.log("user data is", userdata);

    let goalType = userdata.goalType;
    let ExerciseLevel = userdata.ExerciseLevel;
    let age = userdata.age;
    let height = userdata.height;
    let weight = userdata.weight;

    // Strict prompt: only one day
    let prompt = `
    You are an expert workout suggestion AI. Generate ONLY today's workout plan.
    Return ONLY a valid JSON array with ONE workout object.
    No markdown, no backticks, no explanation text — just the raw JSON array.

    Each workout object must use EXACTLY these field names:
    {
        "type": "strength" | "cardio" | "hiit" | "yoga" | "bodyweight",
        "Mealname": "specific descriptive meal name",
        "Duration": "string (minutes)",
        "exercises": [
            {
              "BodyTarget": "String",
              "WorkoutName": "String",
              "sets": Number,
              "reps": Number,
              "weightKg": Number,
              "Rest": "String",
              "notes": "String"
            }
        ]
    }

    Rules:
    - Generate ONLY today's workout (not the full week).
    - Follow the split:
      Day 1: chest & triceps
      Day 2: back & biceps
      Day 3: legs & shoulders
      Day 4: chest & triceps
      Day 5: back & biceps
      Day 6: legs & shoulders
      Day 7 (Saturday): rest day
    - Provide exercises according to goal type (e.g., gain → strength focus).
    - note: Each exercise must have 3 sets with 4 reps.
    - Workout names must be specific and appealing.
    - Include recommended workout duration.
    - If today is Saturday, return a rest day plan only.

    User Profile:
    - Age: ${age || "not set"} years
    - Weight: ${weight || "not set"} kg
    - Height: ${height || "not set"} cm
    - Goal: ${goalType}
    - ExerciseLevel: ${ExerciseLevel}
    `;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingPlan = await workoutModel.findOne({
      userID: req.user.id,
      Date: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingPlan) {
      return res.status(200).json({
        success: true,
        message: "Today's workout plan already exists",
        data: existingPlan,
      });
    }

    const AiWorkouts = await AIModel(prompt, res);

    // Ensure only one workout object
    const todayWorkout = Array.isArray(AiWorkouts) ? AiWorkouts[0] : null;

    if (!todayWorkout) {
      return res.status(500).json({
        success: false,
        message: "AI did not return a valid workout plan",
      });
    }

    // Map AI response into schema
    const savedPlan = await workoutModel.create({
      userID: req.user.id,
      type: todayWorkout.type,
      Duration: parseInt(todayWorkout.Duration), // convert string to number
      exercises: todayWorkout.exercises,
      Date: new Date(),
      aiGenerated: true,
    });

    return res.status(201).json({
      success: true,
      message: "New workout plan generated and saved",
      data: savedPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = WorkoutData;
