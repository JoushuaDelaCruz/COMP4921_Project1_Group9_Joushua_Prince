require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const { username, password } = req.query;
  res.render("login", { username: username, password: password });
});

router.post("/user", async (req, res) => {
  const { username, password } = req.body;
  
  res.redirect("/home");
});

module.exports = router;
