
const mongoose= require("mongoose");
const CalorieSchema= mongoose.Schema({
  userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
        required: true
    },
      foodID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealData", // reference to your meal model
    required: true,
  },

    CalorieConsume:{
        type:Number,
        default:0
    },
        TotalCalorie:{
        type:Number,
        default:0
    }
    ,
    Date:{
        type:Date,
        default:Date.now()
    }
})
const TrackCalorie =   mongoose.model("TrackCalorie",CalorieSchema)
module.exports= TrackCalorie
