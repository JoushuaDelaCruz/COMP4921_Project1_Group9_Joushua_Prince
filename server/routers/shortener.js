require("../utils");
const express = require("express");
const router = express.Router();
const db_shortener = include("database/db_shortener");
const db_urls_info = include("/database/db_urls_info");
const id_checker = require("./modules/idChecker");

router.post("/", async (req, res) => {
  const fullUrl = req.body.fullUrl;
  const user_id = req.session ? req.session.user_id : null;
  const existingShortURL = await db_shortener.getShortURLByOriginalURL(fullUrl);
  if (existingShortURL) {
    res.redirect("/home?shortener=true");
    return;
  }
  // Checks if user's choice of customized name exists already
  const customized_name = req.body.customized_name;
  const nameErr = await id_checker.checkName(
    db_shortener.isIdExists,
    customized_name
  );
  if (nameErr) {
    res.redirect(`/home?shortener=true&error=${nameErr}`);
    return;
  }
  try {
    const url_info_id = await db_urls_info.insertUrlInfoAndGetUrlInfoId();
    await db_shortener.createURL({
      customized_id: customized_name,
      originalURL: fullUrl,
      user_id: user_id,
      url_info_id: url_info_id,
    });
    res.redirect("/home?shortener=true");
  } catch (error) {
    console.error("Error creating URL:", error);
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
