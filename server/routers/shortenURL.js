require("../utils");
const express = require("express");
const router = express.Router();
const database = include("mySQLDatabaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const nodeCache = require("node-cache");
const saltRounds = 12;
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');



// Add a GET route for rendering the "shortenurl.ejs" template
router.get("/", (req, res) => {
  console.log("inside shorten")
 res.render("shortenURL")
});

router.post('/', async (req, res) => {
  console.log('Full URL submitted:');

  const fullUrl = req.body.fullUrl; 
   // Generate a unique short ID using shortid
 const shortURL = shortId.generate();
  // You can store this shortURL in your database, associating it with the originalURL
  var results = await db_url.createURL({ originalURL: originalURL, shortURL: shortURL });
  // console.log('Original URL:', originalURL);
  // console.log('Short URL:', shortURL);
  if (results){
    const shortenedUrl = `${req.protocol}://${req.get('host')}/${shortURL}`;
    res.status(201).json({ shortURL: shortenedUrl });
  }
  

});



    




module.exports = router;
