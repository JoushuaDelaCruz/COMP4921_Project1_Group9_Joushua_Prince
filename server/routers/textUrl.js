const express = require("express");
const router = express.Router();
const db_textUrl = include("database/db_textUrls");
const db_urlInfo = include("database/db_urls_info");
const shortId = require("shortid");

router.get("/:text", async (req, res) => {
  const text_id = req.params.text;
  console.log(text_id);
  res.send("text");
});

router.post("/upload", async (req, res) => {
  const text = req.body.text;
  const title = req.body.title || "Untitled";
  const text_id = shortId.generate();
  const uploader_id = req.session.user_id;
  const textData = {
    uploader_id: uploader_id,
    text_id: text_id,
    text: text,
    title: title,
  };
  await db_textUrl.uploadText(textData);
  res.redirect("/home?text=true");
  return;
});

module.exports = router;
