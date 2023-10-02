require("../utils");
const express = require("express");
const router = express.Router();
const db_shortener = include("database/db_shortener");
const db_urls_info = include("database/db_urls_info");

const shortId = require("shortid");

// Define a function to truncate a URL to a specific length
function truncateURL(url, maxLength = 30) {
  if (url.length > maxLength) {
    return url.substring(0, maxLength) + "...";
  }
  return url;
}

router.post("/", async (req, res) => {
  console.log("Full URL submitted:");

  const fullUrl = req.body.fullUrl;
  const user_id = req.session ? req.session.user_id : null;
  userSignedIn = req.session ? req.session.user_id : -1;

  console.log("Current user" + user_id);

  const existingShortURL = await db_shortener.getShortURLByOriginalURL(fullUrl);

  if (existingShortURL) {

    const recentURLs = await db_shortener.getRecentURLs();
    console.log("logging recents" + recentURLs);

    // Return the existing short code
    const shortURL = existingShortURL.short_code;

    res.render("shortener", {
      shortURL,
      fullUrl,
      recentURLs,
      truncateURL,
      userSignedIn,
    });
  } else {
    // Generate a unique short ID using shortid
    const shortcode = shortId.generate();
    // Ensure that the short URL starts with "http://"
    const shortURL = shortcode;

    try {
      const url_info_id = await db_urls_info.insertUrlInfoAndGetUrlInfoId();
      var results = await db_shortener.createURL({
        originalURL: fullUrl,
        shortURL: shortURL,
        user_id: user_id,
        url_info_id: url_info_id
      });
    } catch (error) {
      console.error("Error creating URL:", error);

    }

    if (results) {
      const shortURLnew = `${shortcode}`;
      const recentURLs = await db_shortener.getRecentURLs();
      res.render("shortener", {
        shortURL: shortURLnew,
        fullUrl: fullUrl,
        recentURLs: recentURLs,
        truncateURL,
        userSignedIn,
      });
    }
  }
});

router.get("/:shortcode", async (req, res) => {
  const shortcode = req.params.shortcode;
  const originalURL = await db_shortener.getOriginalURL(shortcode);
  console.log("Redirecting to" + originalURL);
  const url_info_id = await db_shortener.getShortURLIdInfoByOriginalURL(originalURL);
  console.log("UPDATE MHANI " + url_info_id)

  if (originalURL) {
    res.redirect(originalURL);
    await db_urls_info.urlClicked(url_info_id)
  } else {
    // Handle the case where the shortcode doesn't exist
    res.status(404).send("Short URL not found");
  }
});




router.post("/deactivate/:shortcode", async (req, res) => {
  console.log("Now deacvating");
  const shortcode = req.params.shortcode;
  userSignedIn = req.session ? req.session.user_id : -1;
  const user_id = req.session ? req.session.user_id : null;
  console.log(user_id)

  // Check if the user is the owner of the redirect
  const urlOwner = await db_shortener.getIdByShortcode(shortcode);
  console.log("Owner is " + urlOwner);

  if (user_id !== urlOwner) {
    return res.status(403).send("Unauthorized to Deactivate this redirect");
  }

  const urls_info_id = await db_shortener.getShortURLIdInfoByShortCode(shortcode);
  await db_urls_info.deactivateUrl(urls_info_id);
  res.redirect("/home?shortener=true");
});



router.post("/activate/:shortcode", async (req, res) => {
  console.log("Now deacvating");
  const shortcode = req.params.shortcode;
  userSignedIn = req.session ? req.session.user_id : -1;
  const user_id = req.session ? req.session.user_id : null;
  console.log(user_id)

  // Check if the user is the owner of the redirect
  const urlOwner = await db_shortener.getIdByShortcode(shortcode);
  console.log("Owner is " + urlOwner);

  if (user_id !== urlOwner) {
    return res.status(403).send("Unauthorized to Activate this redirect");
  }

  const urls_info_id = await db_shortener.getShortURLIdInfoByShortCode(shortcode);
  await db_urls_info.activateUrl(urls_info_id);
  res.redirect("/home?shortener=true");
});
module.exports = router;