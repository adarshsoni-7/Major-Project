const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/AsyncWrap.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  isLoggedInToView,
  isOwner,
  validateListing,
} = require("../middleware.js");

// Index & Create Route
router
  .route("/")
  .get(asyncWrap(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    asyncWrap(listingController.create)
  );

// New Route

router.get("/new", isLoggedIn, asyncWrap(listingController.new));

// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.edit));

// Show, Update & DeleteRoute

router
  .route("/:id")
  .get(isLoggedInToView, asyncWrap(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    asyncWrap(listingController.update)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.delete));

module.exports = router;
