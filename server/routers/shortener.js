require("../utils");
const express = require("express");
const router = express.Router();
const db_shortener = include("database/db_shortener");

const shortId = require("shortid");




router.post("/", async (req, res) => {
  console.log("Full URL submitted:");

  const fullUrl = req.body.fullUrl;
  // Generate a unique short ID using shortid
  const shortcode = shortId.generate();

  // Ensure that the short URL starts with "http://"
  const shortURL = shortcode;
  // console.log("printing URL" + shortURL);


  var results = await db_shortener.createURL({
    originalURL: fullUrl,
    shortURL: shortURL,
  });
  if (results) {
    // console.log(results);
    // console.log("recorded");
    // const shortURLnew = `${req.protocol}://${req.get("host")}/${shortcode}`;
    const shortURLnew = `${shortcode}`;

    res.render("shortener", { shortURL: shortURLnew , fullUrl:fullUrl});
    // console.log("full URL" + shortURLnew)
    // Look up the original URL associated with the shortcode in your database

  }
});


router.get("/", async (req, res) => {
  const shortcode = req.body.short_code;

  // Look up the original URL associated with the shortcode in your database
  const originalURL = await db_shortener.getOriginalURL(shortcode);

  if (originalURL) {
    // Redirect to the original URL
    // increment url click inside urls 
    // render number of clicks to table in the page
    router.get("/:shortcode", async (req, res) => {
  const shortcode = req.params.shortcode;

  // Look up the original URL associated with the shortcode in your database
  const originalURL = await db_shortener.getOriginalURL(shortcode);


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
    res.redirect(originalURL);
  } else {
    // Handle the case where the shortcode doesn't exist
    res.status(404).send("Short URL not found");
  }
});


router.get("/:shortcode", async (req, res) => {
  const shortcode = req.params.shortcode;
  console.log("current shortcode for database lookup is " + shortcode)
  const originalURL = await db_shortener.getOriginalURL(shortcode);
  console.log("Redirecting to" + originalURL)

  if (originalURL) {
    // Redirect to the original URL
    res.redirect(originalURL);
  } else {
    // Handle the case where the shortcode doesn't exist
    res.status(404).send("Short URL not found");
  }
});

module.exports = router;
