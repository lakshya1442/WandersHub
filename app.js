 const express=require("express");
 const app=express();
 const ejs=require("ejs");
 const mongoose=require("mongoose");
 const path=require("path");
 const methodOverride=require("method-override");
 const ejsMate=require("ejs-mate");
const expressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("express-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");




const listingRouter = require("./routes/listingRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const userRouter=require("./routes/userRouter.js")

 let port=3000; 

 
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");  // Add this line
app.engine("ejs",ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_ninja"));


const sessionOption={
  secret:"mysecret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};
app.use(session(sessionOption));
app.use(flash())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error"); 
  next()
})


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}


app.get("/",(req,res)=>{
   res.send("Hi, you are welcome on our site");
}) 







app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new expressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something is fishy"}=err;
  // res.status(statusCode) .send(message);
  res.status(statusCode).render("listing/error.ejs",{err});

})

 app.listen(port,()=>{
   console.log("Server is listening to port ",port);

 })