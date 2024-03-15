const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("hi i am root");
});

app.get("/listings", (req, res) => {
  //console.log("i am listings");
  res.render("listings/index");
});

app.listen(8080, () => {
  console.log("server is listning on port 8080");
});
