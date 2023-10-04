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
  const { shortener, text, image, error } = req.query;
  const user_id = req.session ? req.session.user_id : -1;
  const authenticated = req.session ? req.session.authenticated : false;
  const onlyUserContent = req.session ? req.session.onlyUserContent : false;
  if (shortener === "true") {
    const recentURLs = onlyUserContent
      ? await db_shortener.getUserRecentUrls(user_id)
      : await db_shortener.getRecentURLs();
    const bundle = {
      onlyUserContent: onlyUserContent,
      recentURLs: recentURLs,
      isUserSignedIn: authenticated,
      imageClass: "text-light",
      shortenerClass: "active",
      textClass: "text-light",
      truncateURL: truncateURL,
      userSignedIn: req.session ? req.session.user_id : -1,
      error: error,
    };
    res.render("index", bundle);
    return;
  }
  if (text === "true") {
    const texts = onlyUserContent
      ? await db_textUrl.getUserTexts(user_id)
      : await db_textUrl.getUploadedTexts();
    const bundle = {
      onlyUserContent: onlyUserContent,
      texts: texts,
      isUserSignedIn: authenticated,
      imageClass: "text-light",
      shortenerClass: "text-light",
      textClass: "active",
      userSignedIn: req.session ? req.session.user_id : -1,
      error: error,
    };
    res.render("index", bundle);
    return;
  }
  if (image === "true") {
    const images = onlyUserContent
      ? await db_imageUrl.getUserImages(user_id)
      : await db_imageUrl.getUploadedImages();
    const bundle = {
      onlyUserContent: onlyUserContent,
      images: images,
      isUserSignedIn: authenticated,
      imageClass: "active",
      shortenerClass: "text-light",
      textClass: "text-light",
      userSignedIn: req.session ? req.session.user_id : -1,
      error: error,
    };
    res.render("index", bundle);
    return;
  }
  res.redirect("404");
});

router.post("/onlyUserContent", (req, res) => {
  const page = req.body.page;
  req.session.onlyUserContent = !req.session.onlyUserContent;
  res.redirect(`/home?${page}=true`);
});

router.post("/logOut", (req, res) => {
  console.log("Logging out");
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
