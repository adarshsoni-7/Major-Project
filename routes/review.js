const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/AsyncWrap.js");
const session = require("express-session");
const flash = require("connect-flash");
const reviewController = require("../controllers/review.js");
const {
  validateReview,
  isReviewAuthor,
  isLoggedIn,
} = require("../middleware.js");
const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expiry: Date.now() + 365 * 12 * 31 * 24 * 60 * 60 * 1000,
    maxAge: 365 * 12 * 31 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(reviewController.postReviews)
);

// DELETE Route for Reviews

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(reviewController.deleteReviews)
);

module.exports = router;
