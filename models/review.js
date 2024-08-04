const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewSchema=new Schema({

   rating:{
      type:Number,
      min:1,
      max:5,
   },
      comment:{
         type:String
      },
      created_at:{
         type:Date,
         default:new Date(Date.now()).toString(),
     }

});

const review=mongoose.model("review",reviewSchema);

module.exports=review;