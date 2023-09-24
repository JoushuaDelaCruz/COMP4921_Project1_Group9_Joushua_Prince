require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");

const db_imageUrl = include("database/db_imageUrls");
// / Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

const getImages = async () => {
  const images = await db_imageUrl.getUploadedImages();
  return images;
};

router.get("/", async (req, res) => {
  const { shortener, text } = req.query;
  const authenticated = req.session ? req.session.authenticated : false;
  if (shortener) {
    const bundle = {
      isUserSignedIn: authenticated,
      imageClass: "text-light",
      shortenerClass: "active",
      textClass: "text-light",
    };
    res.render("index", bundle);
    return;
  }
  if (text) {
    const bundle = {
      isUserSignedIn: authenticated,
      imageClass: "text-light",
      shortenerClass: "text-light",
      textClass: "active",
    };
    res.render("index", bundle);
    return;
  }
  const images = await getImages();
  const bundle = {
    images: images,
    isUserSignedIn: authenticated,
    imageClass: "active",
    shortenerClass: "text-light",
    textClass: "text-light",
    userSignedIn: req.session ? req.session.user_id : -1,
  };
  res.render("index", bundle);
  return;
});

router.post("/logOut", (req, res) => {
  console.log("Logging out");
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
