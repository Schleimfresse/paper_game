// Initial - start -
const bodyparser = require("body-parser");
const express = require("express");
const Datastore = require("nedb");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const database = new Datastore("userdatabase.db");
database.loadDatabase();
const users = require('./routes/users');
app.use(bodyparser.json({ limit: "1mb" }));
app.use('/', users);
app.use(express.static("src/public"));
server.listen(port, () => {
  console.log(`app listening at Port: ${port}`);
});
// initial - end -

// Main content - start -
io.on("connection", (socket) => {
  console.log(`New client connection: ${socket.id}`);
  socket.on("newplayerName", (name) => {
    socket.broadcast.emit("newplayerName", name);
  });
  socket.on("removeUserElement", (name) => {
    socket.broadcast.emit("removeUserElement", name);
    database.remove({ value: name });
  });
});
// Main content - end -

// Error handling

app.use(function (req, res) {
  res.status(404);
  res.sendFile(__dirname + "/public/404.html");
  return;
});
