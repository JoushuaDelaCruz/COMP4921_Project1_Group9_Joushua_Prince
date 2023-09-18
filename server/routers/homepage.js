require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const authenticated = req.session ? req.session.authenticated : false;
  console.log(authenticated);
  res.render("index", { isUserSignedIn: authenticated });
});

router.post("/user", async (req, res) => {
  const { username, password } = req.body;
  // must check if username and password are valid in the database
  res.redirect("/home");
});

module.exports = router;
