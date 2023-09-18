require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const database = include("mySQLDatabaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const saltRounds = 12;
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("signup");
});

router.post("/createUser", async (req, res) => {
  console.log(req.body);

  try {
    const { user, password } = req.body;

    // Hash the password using bcrypt
    // TODO: debug hashing password

    //  const saltRounds = 10;
    //  const hashedPassword = await bcrypt.hash(password, saltRounds);

    const success = await db_users.createUser({ user, password });

    if (success) {
      console.log("User created successfully");
      res.status(200).json({ message: "User created successfully" });
    } else {
      console.error("YIkes Failed to create user");
      res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
