const express = require("express");
const router = express.Router();
const db_textUrl = include("database/db_imageUrls");
const db_urlInfo = include("database/db_urls_info");
const shortId = require("shortid");

router.post("/upload", async (req, res) => {
  const { text, title } = req.body;
  res.redirect("/home?text=true");
  return;
});
