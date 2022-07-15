const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
server = app.listen(port, () => console.log(`listening at PORT: ${port}`));

app.get("/", (req, res) => {});


app.use(function (req, res) {
  res.status(404);
  res.sendFile(__dirname + "/public/404.html");
  return;
});