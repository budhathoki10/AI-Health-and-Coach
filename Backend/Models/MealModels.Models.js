const mogoose= require('mongoose');
const mealSchema= new mogoose.Schema({
    userID:{
        type: mogoose.Schema.Types.ObjectId,
        ref: 'UserData',
        required: true
    },
    Meal:[
        {
            MealType:{
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true
    },
    Mealname:{
        type: String,
    },
    Calories:{
        type: Number,
    },
    Protein:{
        type: Number,
    },
    Carbs:{
        type: Number,
    },
    Fats:{
        type: Number,
    },
        RecommendedTime:{
        type: String,
    },
    
        }
    ],
    Date:{  
        type: Date,
        required: true
    }

})
const mealModel= mogoose.model("MealData",mealSchema)
module.exports= mealModel