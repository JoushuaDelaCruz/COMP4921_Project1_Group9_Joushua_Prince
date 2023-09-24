require("./utils");
require("dotenv").config();
const express = require("express");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");
const expireTime = 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

//** MongoDB Session */
/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

const mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.nbfzg7h.mongodb.net/?retryWrites=true&w=majority`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: expireTime, // 1 hour
    },
  })
);

const imageRouter = require("./routers/imageUrl");
const signUpRouter = require("./routers/signUp");
const shortenURLrouter = require("./routers/shortenURL");
const homeRouter = require("./routers/homepage");
const db_users = include("database/users");

// app.use("/login", loginRouter);
app.use("/signup", signUpRouter);
app.use("/shortenURL", shortenURLrouter);
app.use("/imageUrls", imageRouter);
app.use("/home", homeRouter);

app.get("/login", (req, res) => {
  const invalid = req.query.invalid;
  if (invalid) {
    res.render("login", { invalid: "is-invalid" });
    return;
  }
  res.render("login");
});

app.post("/login/user", async (req, res) => {
  console.log(req.body);
  var user = req.body.username;
  var password = req.body.password;
  var results = await db_users.getUser({ user: user });

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

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
