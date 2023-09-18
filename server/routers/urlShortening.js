require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();

const shortId = require("shortid");

router.post("/shortenURL", async (req, res) => {
  try {
    const { originalURL } = req.body;
    console.log(originalURL);
    // Generate a unique short ID using short-unique-id
    // Generate a unique short ID using shortid
    const shortURL = shortId.generate();

    // You can store this shortURL in your database, associating it with the originalURL
    var results = await db_url.createURL({
      originalURL: originalURL,
      shortURL: shortURL,
    });
    console.log("Original URL:", originalURL);
    console.log("Short URL:", shortURL);
    if (results) {
      res.status(201).json({ shortURL: shortURL });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
