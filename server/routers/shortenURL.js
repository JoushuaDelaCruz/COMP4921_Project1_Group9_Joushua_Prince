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

router.post('/', (req, res) => {
  console.log('Full URL submitted:');

  const fullUrl = req.body.fullUrl; 
  
  

  

});





module.exports = router;
