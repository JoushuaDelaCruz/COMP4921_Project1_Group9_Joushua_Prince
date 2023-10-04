require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db_users = include("database/users");
const nodeCache = require("node-cache");
const saltRounds = 12;
const bcrypt = require("bcrypt");

const cache = new nodeCache();
const CACHELIFE = 15; // seconds

router.get("/", (req, res) => {
  const invalidBundle = cache.get("createUserInvalid");
  if (invalidBundle) {
    cache.del("createUserInvalid");
    cache.close();
    res.render("signUp", invalidBundle);
    return;
  }
  res.render("signUp", { username: "" });
});

router.post("/createUser", async (req, res) => {
  const { username, password } = req.body;
  let userValidClass = "is-valid";
  let passwordValidClass = "is-valid";
  let passwordInvalidMessage = "";
  let userInvalidMessage = "";
  const checkPassword = () => {
    if (password.length < 10) {
      passwordValidClass = "is-invalid";
      passwordInvalidMessage = "Password must be at least 10 characters";
      return true;
    }
    if (!password.match(/[a-z]/)) {
      passwordValidClass = "is-invalid";
      passwordInvalidMessage = "Password must contain a lowercase letter";
      return true;
    }
    if (!password.match(/[A-Z]/)) {
      passwordValidClass = "is-invalid";
      passwordInvalidMessage = "Password must contain an uppercase letter";
      return true;
    }
    if (!password.match(/[|\\/~^:,;?!&%$@*+]/)) {
      passwordValidClass = "is-invalid";
      passwordInvalidMessage = "Password must contain a special character";
      return true;
    }
    return false;
  };

  const checkUsername = () => {
    if (!username) {
      userValidClass = "is-invalid";
      userInvalidMessage = "Please enter your username";
      return true;
    }
    const userExists = db_users.getUser({ user: username });
    if (userExists.length <= 0) {
      userValidClass = "is-invalid";
      userInvalidMessage = "Username already exists";
      return true;
    }
    return false;
  };

  const isPasswordInvalid = checkPassword();
  const isUserInvalid = checkUsername();

  if (isPasswordInvalid || isUserInvalid) {
    const invalidBundle = {
      isUserValid: userValidClass,
      isPasswordValid: passwordValidClass,
      username: username,
      usernameInvalidMessage: userInvalidMessage,
      passwordInvalidMessage: passwordInvalidMessage,
    };
    cache.set("createUserInvalid", invalidBundle, CACHELIFE);
    res.redirect("/signUp");
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const success = await db_users.createUser({
      username: username,
      password: hashedPassword,
    });
    if (success) {
      console.log("User created successfully");
      res.redirect("/login");
    } else {
      console.error("YIkes Failed to create user");
      res.redirect("/signUp");
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    res.redirect("/signUp");
  }
});

module.exports = router;
