require("../utils");
const express = require("express");
const router = express.Router();
const database = include("mySQLDatabaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const db_geturl = include("database/getOriginalURL");

const nodeCache = require("node-cache");
const saltRounds = 12;
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const db_url = include("database/create_url");

const shortId = require("shortid");

// Add a GET route for rendering the "shortenurl.ejs" template
router.get("/", (req, res) => {
  console.log("inside shorten");
  res.render("shortener");
});




router.post("/", async (req, res) => {
  console.log("Full URL submitted:");

  const fullUrl = req.body.fullUrl;
  // Generate a unique short ID using shortid
  const shortcode = shortId.generate();

  // Ensure that the short URL starts with "http://"
  const shortURL = shortcode
  console.log("printing URL" + shortURL);

  // You can store this shortURL in your database, associating it with the originalURL
  var results = await db_url.createURL({
    originalURL: fullUrl,
    shortURL: shortURL,
  });
  if (results) {
    console.log(results);
    console.log("recorded");
    const shortURLnew = `${req.protocol}://${req.get("host")}/${shortcode}`;
    res.redirect("home?shortener=true", { shortURL: shortURLnew , fullUrl:fullUrl});
    console.log("full URL" + shortURLnew)

  }
});


router.get("/:shortcode", async (req, res) => {
  const shortcode = req.params.shortcode;

  // Look up the original URL associated with the shortcode in your database
  const originalURL = await db_url.getOriginalURL(shortcode);

  if (originalURL) {
    // Redirect to the original URL
    res.redirect(originalURL);
  } else {
    // Handle the case where the shortcode doesn't exist
    res.status(404).send("Short URL not found");
  }
});

module.exports = router;
