const express = require("express");
require("./utils");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const database = include("databaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const db_url = include("database/create_url");

const saltRounds = 12;
const shortId = require("shortid");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
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
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

app.get("/api", (req, res) => {
  res.send("Hello World, using proxy to reach server side");
});

app.get("/createTables", async (req, res) => {
  console.log("Attempt to create table");
  const create_tables = include("database/create_tables");
  var success = create_tables.createTables();
  if (success) {
    res.send("successMessage");
  } else {
    res.send("errorMessage");
  }
});

// Define the /api/createUser endpoint
app.post("/api/createUser", async (req, res) => {
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

app.post("/api/login", async (req, res) => {
  const { user, password } = req.body;

  var results = await db_users.getUsers({ user: user, password: password });
  if (results) {
    console.log("User Existsssssssss");
    res.status(200).json({ message: "User FOund" });
  } else {
    console.log("User Does not exist");
  }
});

app.post("/api/shortenURL", async (req, res) => {
  try {
    const { originalURL } = req.body;
    console.log(originalURL);
    // Generate a unique short ID using short-unique-id
    // Generate a unique short ID using shortid
    const shortURL = shortId.generate();

    // You can store this shortURL in your database, associating it with the originalURL
    var results = await db_url.createURL({
      originalURL: originalURL,
      shortURL: shortURL,
    });
    console.log("Original URL:", originalURL);
    console.log("Short URL:", shortURL);
    if (results) {
      res.status(201).json({ shortURL: shortURL });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
