const express = require("express");

const PORT = process.env.PORT || 5000;

const app = express();

app.get("/404", (req, res) => {
  res.sendStatus(404);
});

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
