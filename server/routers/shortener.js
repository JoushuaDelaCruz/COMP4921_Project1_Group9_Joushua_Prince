require("../utils");
const express = require("express");
const router = express.Router();
const db_shortener = include("database/db_shortener");
const db_urls_info = include("/database/db_urls_info");

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
  const userSignedIn = req.session ? req.session.user_id : -1;

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
        url_info_id: url_info_id,
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

router.get("/", async (req, res) => {
  const short_code = req.query.short_code;
  const urlData = await db_shortener.getOriginalURL(short_code);
  const user_id = req.session ? req.session.user_id : -1;
  if (!urlData[0]) {
    res.redirect("/404");
    return;
  }
  const uploader_id = urlData[0].user_id;
  const owner = uploader_id === user_id;
  if (urlData[0].is_active === 0 && !owner) {
    res.render("inactive");
    return;
  }
  await db_urls_info.urlClicked(urlData[0].url_info_id);
  res.redirect(urlData[0].original_url);
});

router.post("/deactivate", async (req, res) => {
  const url_info_id = req.body.url_info_id;
  await db_urls_info.deactivateUrl(url_info_id);
  res.redirect("/home?shortener=true");
});

router.post("/activate", async (req, res) => {
  const url_info_id = req.body.url_info_id;
  await db_urls_info.activateUrl(url_info_id);
  res.redirect("/home?shortener=true");
});
module.exports = router;