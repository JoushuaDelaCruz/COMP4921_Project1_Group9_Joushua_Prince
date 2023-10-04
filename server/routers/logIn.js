require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db_users = include("database/users");
const bcrypt = require("bcrypt");
const expireTime = 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

router.get("/", (req, res) => {
  const invalid = req.query.invalid;
  if (invalid) {
    res.render("login", { invalid: "is-invalid" });
    return;
  }
  res.render("login");
});

router.post("/user", async (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  const results = await db_users.getUser({ user: user });

  if (results) {
    if (results.length === 1) {
      // Ensure there is exactly one matching user
      const storedHashedPassword = results[0].password;

      // Compare the user-entered password with the stored hashed password
      if (bcrypt.compareSync(password, storedHashedPassword)) {
        req.session.authenticated = true;
        req.session.user = results[0].username;
        req.session.user_id = results[0].user_id;
        req.session.cookie.maxAge = expireTime;
        res.redirect("/home");
        return;
        // Handle the login success case here
      } else {
        console.log("Invalid password");
        // Handle the invalid password case here
      }
    } else {
      console.log(
        "Invalid number of users matched: " + results.length + " (expected 1)."
      );
      // Handle the case where multiple users match the query
    }
  }
  res.redirect("/login?invalid=true");
});

module.exports = router;
