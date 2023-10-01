require("../utils");
const express = require("express");
const router = express.Router();
const db_shortener = include("database/db_shortener");

const shortId = require("shortid");


// Define a function to truncate a URL to a specific length
function truncateURL(url, maxLength = 50) {
  if (url.length > maxLength) {
    return url.substring(0, maxLength) + '...';
  }
  return url;
}

router.post("/", async (req, res) => {
  console.log("Full URL submitted:");

  const fullUrl = req.body.fullUrl;


  const existingShortURL = await db_shortener.getShortURLByOriginalURL(fullUrl);

  if (existingShortURL) {
    // URL already exists, increment the clicks count
    await db_shortener.incrementClicks(existingShortURL.short_code);

    const recentURLs = await db_shortener.getRecentURLs();
    console.log("logging recents" + recentURLs);

    // Return the existing short code
    const shortURL = existingShortURL.short_code;

    res.render("shortener", {
      shortURL,
      fullUrl,
      recentURLs,
      truncateURL
    });
  } else {


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
      // Retrieve the 10 most recent URLs
      const recentURLs = await db_shortener.getRecentURLs();
      res.render("shortener", {
        shortURL: shortURLnew,
        fullUrl: fullUrl,
        recentURLs: recentURLs,
        truncateURL
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