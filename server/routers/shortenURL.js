require("../utils");
const express = require("express");
const router = express.Router();
const database = include("mySQLDatabaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const nodeCache = require("node-cache");
const saltRounds = 12;
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const db_url = include("database/create_url");

const shortId = require("shortid");

// Add a GET route for rendering the "shortenurl.ejs" template
router.get("/", (req, res) => {
  console.log("inside shorten");
  res.render("shortenURL");
});

router.post("/", async (req, res) => {
  console.log("Full URL submitted:");

  const fullUrl = req.body.fullUrl;
  // Generate a unique short ID using shortid
  const shortcode = shortId.generate();

  // Ensure that the short URL starts with "http://"
  const shortURL = `${req.protocol}://${req.get("host")}/${shortcode}`;
  console.log("printing URL" + shortURL);

  // You can store this shortURL in your database, associating it with the originalURL
  var results = await db_url.createURL({
    originalURL: fullUrl,
    shortURL: shortURL,
  });
  if (results) {
    console.log(results);
    console.log("recorded");
  }
});

module.exports = router;
