const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
name: {
    type: String,
    required: true
},
email:{
    type: String,
    required: true,
    unique: true
},
password:{
    type: String,
    required: true
},
age:{
type: Number,
},
height:{
type: Number,
},
weight:{
type: Number,
},
goalType: {
    type: String,
    enum: ["lose", "gain", "maintain"],
    default: "maintain"
  },
  ExerciseLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active"],
    default: "sedentary"
  },

  dietaryRestrictions: {
    type: String,
    enum: ["vegetarian", "Non vegetarian"],
    default: "Non vegetarian"

  },

  profileComplete: {
    type: Boolean,
    default: false
  }

  
})
userDataSchema.index({ userId: 1, date: 1 }, { unique: true });
const userModel = mongoose.model('UserData', userDataSchema);
module.exports = userModel;
