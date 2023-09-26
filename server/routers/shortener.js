require("../utils");
const express = require("express");
const router = express.Router();
const database = include("mySQLDatabaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const db_shortener = include("database/db_shortener");


const nodeCache = require("node-cache");
const saltRounds = 12;
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const shortId = require("shortid");
const { Table } = require("@material-ui/core");

// Add a GET route for rendering the "shortenurl.ejs" template
router.get("/", (req, res) => {
  console.log("inside shorten");
  res.render("shortener");
  const shortcode = req.params.shortcode;
  console.log("Shortening" + shortcode)
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
  var results = await db_shortener.createURL({
    originalURL: fullUrl,
    shortURL: shortURL,
  });
  if (results) {
    console.log(results);
    console.log("recorded");
    // const shortURLnew = `${req.protocol}://${req.get("host")}/${shortcode}`;
    const shortURLnew = `${shortcode}`;

    res.render("shortener", { shortURL: shortURLnew , fullUrl:fullUrl});
    console.log("full URL" + shortURLnew)
    // Look up the original URL associated with the shortcode in your database



  }
});


router.get("/:shortcode", async (req, res) => {
  const shortcode = req.params.shortcode;

  // Look up the original URL associated with the shortcode in your database
  const originalURL = await db_shortener.getOriginalURL(shortcode);
  console.log("original url" + originalURL)

  if (originalURL) {
    // Redirect to the original URL
    // increment url click inside urls 
    // render number of clicks to table in the page
    res.redirect(originalURL);
  } else {
    // Handle the case where the shortcode doesn't exist
    res.status(404).send("Short URL not found");
  }
});




module.exports = router;
