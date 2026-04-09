const mongoose = require("mongoose");
const workoutSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
  type: {
    type: String,
    enum: ["strength", "cardio", "hiit", "yoga", "bodyweight"],
  },
  Duration: {
    type: Number,
  },
  exercises: [
    {
      BodyTarget: String,
      WorkoutName: String,
      sets: Number,
      reps: Number,
      weightKg: Number,
      Rest: String,
      notes: String,
    },  
  ],
  Date: {
    type: Date,
    default: Date.now(),
  },

  aiGenerated: {
    type: Boolean,
    default: false,
  },
});
const workoutModel = mongoose.model("WorkoutData", workoutSchema);
module.exports = workoutModel;
