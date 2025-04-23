const Listing = require("../models/listing");
const Review = require("../models/reviews");
module.exports.postReviews = async (req, res) => {
  let listings = await Listing.findById(req.params.id);
  let newReview = new Review({
    rating: req.body.rating,
    comment: req.body.comment,
  });
  newReview.author = req.user._id;
  listings.reviews.push(newReview);

  await newReview.save();
  await listings.save();

  req.flash("success", "New review added!");

  res.redirect(`/listings/${listings._id}`);
};

module.exports.deleteReviews = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  await Review.findByIdAndDelete(reviewId);
  req.flash("error", "Review deleted!");

  res.redirect(`/listings/${id}`);
};
