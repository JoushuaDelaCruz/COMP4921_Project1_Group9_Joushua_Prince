const express = require("express");

const PORT = process.env.PORT || 5000;

const app = express();

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.get("*", (req, res) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
