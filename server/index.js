const express = require("express");
require('./utils');

require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;


const PORT = process.env.PORT || 5000;

const app = express();

/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;;
const mongodb_session_secret =process.env.MONGODB_SESSION_SECRET;;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

// set view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.nbfzg7h.mongodb.net/?retryWrites=true&w=majority`,
	crypto: {
		secret: mongodb_session_secret
	}
})

app.use(session({ 
  secret: node_session_secret,
store: mongoStore, //default is memory store 
saveUninitialized: false, 
resave: true,
  cookie: {
      maxAge: 1000 * 60 * 60 // 1 hour
    }
}
));

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.get("*", (req, res) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
