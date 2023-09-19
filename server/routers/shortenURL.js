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

router.post('/shortenURL', (req, res) => {
  console.log('Full URL submitted:');

  const fullUrl = req.body.fullUrl; // Access the 'fullUrl' input from the form

  console.log('Full URL submitted:', fullUrl);

  // Process the 'fullUrl' as needed, such as URL shortening or storing it in a database
  // For demonstration purposes, we'll just echo it back in this example
  const shortUrl = 'http://shortened-url.com/' + generateShortCode(); // Replace with your logic

  // You can store the 'fullUrl' and 'shortUrl' in a database or perform any other actions here

  // Redirect to the root page and optionally pass the short URL
  res.redirect(`/?shortUrl=${shortUrl}`);
});




// // Define a route for shortening URLs
// router.post("/shortenURL", async (req, res) => {
//   try {
//     const { originalURL } = req.body;
//     console.log(originalURL);

//     // Generate a unique short ID using shortid
//     const shortURL = shortId.generate();

//     // You can store this shortURL in your database, associating it with the originalURL
//     var results = await db_url.createURL({
//       originalURL: originalURL,
//       shortURL: shortURL,
//     });
//     console.log("Original URL:", originalURL);
//     console.log("Short URL:", shortURL);

//     if (results) {
//       // Render the "shortenurl.ejs" template with the shortURL data
//       res.render("shortenURL", { shortUrls: results }); // Pass the results or data you want to display
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
