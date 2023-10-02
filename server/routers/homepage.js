require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");

const db_imageUrl = include("database/db_imageUrls");
const db_textUrl = include("database/db_textUrls");
const db_shortener = include("database/db_shortener");
// / Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); // Parse URL-encoded bodies

function truncateURL(url, maxLength = 35) {
  if (url.length > maxLength) {
    return url.substring(0, maxLength) + "...";
  }
  return url;
}

router.get("/", async (req, res) => {
  const { shortener, text } = req.query;
  const authenticated = req.session ? req.session.authenticated : false;
  const recentURLs = await db_shortener.getRecentURLs();
  if (shortener) {
    const bundle = {
      recentURLs: recentURLs,
      isUserSignedIn: authenticated,
      imageClass: "text-light",
      shortenerClass: "active",
      textClass: "text-light",
      truncateURL: truncateURL,
      userSignedIn: req.session ? req.session.user_id : -1,
    };
    res.render("index", bundle);
    return;
  }
  const texts = await db_textUrl.getUploadedTexts();
  if (text) {
    const bundle = {
      texts: texts,
      isUserSignedIn: authenticated,
      imageClass: "text-light",
      shortenerClass: "text-light",
      textClass: "active",
      userSignedIn: req.session ? req.session.user_id : -1,
    };
    res.render("index", bundle);
    return;
  }
  const images = await db_imageUrl.getUploadedImages();
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
