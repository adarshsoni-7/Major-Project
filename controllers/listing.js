const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.CLOUD_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

// New Route

module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// Show Route

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: "author" }) // replace _id with entire 'review' array
    .populate("owner"); // replace _id with entire 'owner' object details
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", {
    listing,
  });
};

// Create Route

module.exports.create = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  let { title, description, image, price, location, country } = req.body;
  const newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  newListing.owner = req.user._id;

  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};

// Edit Route

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found for which to edit");
    res.redirect("/listings");
  }

  let orgImgURL = listing.image.url;
  orgImgURL = orgImgURL.replace("/upload", "/upload/,w_250");

  res.render("listings/edit.ejs", { listing, orgImgURL });
};

// Update Route

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;

  let listing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });

  if (location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();
    if (response.body.features.length > 0) {
      listing.geometry = response.body.features[0].geometry; // Update geometry (coordinates)
    }
  }

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete Route

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "Listing deleted!");
  res.redirect("/listings");
};
