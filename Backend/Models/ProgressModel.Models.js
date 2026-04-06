import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  weightKg: Number,

  mood: {
    type: Number,
    min: 1,
    max: 5
  },

  sleepHours: Number,

  notes: String

}, { timestamps: true });

//  Prevent duplicate entry per day
progressLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("ProgressLog", progressLogSchema);