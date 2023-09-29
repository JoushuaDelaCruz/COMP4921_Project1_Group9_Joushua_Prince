require("../utils");
const express = require("express");
const router = express.Router();
const db_shortener = include("database/db_shortener");

const shortId = require("shortid");




router.post("/", async (req, res) => {
  console.log("Full URL submitted:");

  const fullUrl = req.body.fullUrl;


  const existingShortURL = await db_shortener.getShortURLByOriginalURL(fullUrl);

  if (existingShortURL) {
    // URL already exists, increment the clicks count
    await db_shortener.incrementClicks(existingShortURL.short_code);

    // Retrieve the click count
    const clickCount = await db_shortener.getClicks(existingShortURL.short_code);
    // Retrieve the 10 most recent URLs
    const recentURLs = await db_shortener.getRecentURLs();
    // console.log("logging rcenets" + recentURLs[0].numofhits);

    // Return the existing short code
    const shortURL = existingShortURL.short_code;

    res.render("shortener", {
      shortURL,
      fullUrl,
      recentURLs
    });
  } else {
    // Retrieve the 10 most recent URLs
    const recentURLs = await db_shortener.getRecentURLs();
    // Generate a unique short ID using shortid
    const shortcode = shortId.generate();
    // Ensure that the short URL starts with "http://"
    const shortURL = shortcode;
    var results = await db_shortener.createURL({
      originalURL: fullUrl,
      shortURL: shortURL,
    });
    if (results) {
      const shortURLnew = `${shortcode}`;
      res.render("shortener", {
        shortURL: shortURLnew,
        fullUrl: fullUrl,
        recentURLs: recentURLs
      });

    }
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