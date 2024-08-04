
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const review=require("./review");
 

const listingSchema=Schema({
   title:{
      type:String,
      required: true,
   },
   description:String,
   image:{

      type:String,
      default:"https://images.pexels.com/photos/24778260/pexels-photo-24778260/free-photo-of-a-view-of-a-valley-with-mountains-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",

   },
   price:{
    type:Number,

  },
   location:{
    type:String,

  },
  country:{
    type:String,

  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"review",
  }],
})


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const listing_model=mongoose.model("listing_model",listingSchema);

module.exports=listing_model;