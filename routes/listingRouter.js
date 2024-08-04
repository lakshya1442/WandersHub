const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const listingSchema = require("../schema.js").listingSchema; // Adjusted import to get listingSchema
const expressError = require("../utils/ExpressError.js");
const router = express.Router();

// Validation middleware for listings
const validateListing = (req, res, next) => {
   console.log("Request body before validation:", req.body); // Debugging log

   const { error } = listingSchema.validate(req.body);
   if (error) {
     const errMsg = error.details.map((el) => el.message).join(",");
     throw new expressError(400, errMsg); 
   } else {
     next();
   }
}

// Index route
router.get("/", wrapAsync(async (req, res) => {
   const dt = await listing.find({});
   res.render("listing/index.ejs", { dt });
}));

// Show route
router.get("/:id/show", wrapAsync(async (req, res) => {
   const { id } = req.params;
   const data = await listing.findById(id).populate("reviews");
   if(!listing){
      req.flash("error","Listing you requested does not exist!");
      res.redirect("/listing");
   }
   res.render("listing/show.ejs", { data });
}));

// Create route
router.get("/new", (req, res) => {
   res.render("listing/new_entry_form.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
   console.log("Request body after validation:", req.body); // Debugging log

   const { title, description, location, price, country, image } = req.body.listing;

   const newElement = new listing({
     title: title,
     description: description,
     location: location,
     price: price,
     country: country,
     image: image || undefined
   });
   await newElement.save();
   req.flash("success", "New Listing Created!");
    
   res.redirect("/listing");
}));

// Update route
router.get("/edit/:id", wrapAsync(async (req, res) => {
   const { id } = req.params;
   const data = await listing.findById(id);
   res.render("listing/edit_form", { data });
}));

router.patch("/:id", validateListing, wrapAsync(async (req, res) => {
   const { id } = req.params;
   const { title, description, price, location, country, image } = req.body.listing;
   
   await listing.findByIdAndUpdate(id, { 
     title: title,
     description: description,
     price: price,
     location: location,
     country: country,
     image: image,

   });
   req.flash("success", "Listing Updated!");
   res.redirect(`/listing/${id}/show`);
}));

// Deletion
router.delete("/:id", wrapAsync(async (req, res) => {
   const { id } = req.params;
   await listing.findByIdAndDelete(id); 
   req.flash("success", "Listing is deleted"); 
   res.redirect("/listing");
}));

module.exports = router;
