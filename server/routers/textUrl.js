const express = require("express");
const router = express.Router();
const db_textUrl = include("database/db_textUrls");
const id_checker = require("./modules/idChecker");
const db_urlInfo = include("database/db_urls_info");

router.get("/", async (req, res) => {
  const text_id = req.query.text;
  const textData = await db_textUrl.getText(text_id);
  const user_id = req.session ? req.session.user_id : -1;
  if (!textData[0]) {
    res.send("/404");
    return;
  }
  const uploader_id = textData[0].uploader_id;
  const owner = uploader_id === user_id;
  if (textData[0].is_active === 0 && !owner) {
    res.render("inactive");
    return;
  }
  textData[0].owner = owner;
  console.log(textData[0]);
  await db_urlInfo.urlClicked(textData[0].url_info_id);
  res.render("text", textData[0]);
});

router.post("/upload", async (req, res) => {
  const text = req.body.text;
  const title = req.body.title || "Untitled";
  const uploader_id = req.session.user_id;
  const customized_id = req.body.customized_id;
  const nameErr = await id_checker.checkName(
    db_textUrl.isIdExists,
    customized_id
  );
  if (nameErr) {
    res.redirect(`/home?text=true&error=${nameErr}`);
    return;
  }
  const textData = {
    uploader_id: uploader_id,
    customized_id: customized_id,
    text: text,
    title: title,
  };
  const successful = await db_textUrl.uploadText(textData);
  if (!successful) {
    res.redirect(
      `/home?text=true&error=${customized_id} already exists. Please choose another name.`
    );
    return;
  }
  res.redirect("/home?text=true");
  return;
});

router.post("/deactivate", async (req, res) => {
  const url_info_id = req.body.url_info_id;
  const text_id = req.body.text_id;
  await db_urlInfo.deactivateUrl(url_info_id);
  if (text_id) {
    res.redirect(`/textUrls?text=${text_id}`);
    return;
  }
  res.redirect("/home?text=true");
  return;
});

router.post("/activate", async (req, res) => {
  const url_info_id = req.body.url_info_id;
  const text_id = req.body.text_id;
  await db_urlInfo.activateUrl(url_info_id);
  if (text_id) {
    res.redirect(`/textUrls?text=${text_id}`);
    return;
  }
  res.redirect("/home?text=true");
  return;
});

module.exports = router;
