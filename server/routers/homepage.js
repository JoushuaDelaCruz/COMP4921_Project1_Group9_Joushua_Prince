require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db_imageUrl = include("database/db_imageUrls");

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
  };
  res.render("index", bundle);
  return;
});

router.post("/user", async (req, res) => {
  const { username, password } = req.body;
  // must check if username and password are valid in the database
  res.redirect("/home");
});

module.exports = router;
