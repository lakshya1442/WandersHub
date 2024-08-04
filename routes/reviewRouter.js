const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const reviewSchema = require("../schema.js").reviewSchema; // Adjusted import to get reviewSchema
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const expressError = require("../utils/ExpressError.js");

// Validation middleware for reviews
const validateReview = (req, res, next) => {
   let { error } = reviewSchema.validate(req.body);
 
   if (error) {
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new expressError(400, errMsg); 
   } else {
     next();
   }
 }
 
// POST route for creating reviews
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
   let { id } = req.params;
   const data = await listing.findById(id);
 
   if (!data) {
     return next(new expressError(404, "Listing not found"));
   }
 
   let newReview = new review(req.body.review); 
   await newReview.save();
   
   data.reviews.push(newReview);
   await data.save();
   req.flash("success", "New Review is posted!");
   res.redirect(`/listing/${id}/show`);
 }));

// DELETE route for deleting reviews
router.delete("/:review_id", wrapAsync(async (req, res, next) => {
   let { id, review_id } = req.params;
 
   await review.findByIdAndDelete({_id: review_id});
   await listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}})
   req.flash("success", "Review is deleted");
   res.redirect(`/listing/${id}/show`);
 }));

module.exports = router;
