require("./utils");
require("dotenv").config();
const express = require("express");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5001;
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
const shortenURLrouter = require("./routers/shortener");
const homeRouter = require("./routers/homepage");
const loginRouter = require("./routers/logIn");

app.use("/login", loginRouter);
app.use("/signup", signUpRouter);
app.use("/shortener", shortenURLrouter);
app.use("/imageUrls", imageRouter);
app.use("/home", homeRouter);

app.get("/", (req, res) => {
  res.redirect("/home");
});



app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
