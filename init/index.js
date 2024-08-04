const mongoose=require("mongoose");
const initData=require("./data");
const listing=require("../models/listing");

main()
.then(()=>{
   console.log("Connected to DB");
   
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  initDB();  
}

const initDB=async ()=>{
   await listing.deleteMany({});
   await listing.insertMany(initData.data);
   console.log("data was initialized");
};



listing.countDocuments({})
.then((count)=>{
   console.log(count);
});
