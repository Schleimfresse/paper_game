// Initial - start -
require("dotenv").config();
const Datastore = require("nedb");
const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const database = new Datastore("userdatabase.db");
database.loadDatabase();
//const users = require("./routes/users");
const port = process.env.PORT || 3000;

// app.use
app.use(bodyparser.json({ limit: "1mb" }));
//app.use("/users", users);
app.use(express.static("public"));
server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
// initial - end -
let clientNo = 0;
let users = {};
let userToRoom = {};
io.sockets.on("connection", connected);
var allClients = [];
// Main content - start -
function connected(socket) {
	clientNo++;
	roomNo = clientNo / 4.1;
	if (roomNo < 1){
	roomNo = Math.round(1)
	}
	else if (roomNo > 1) {
		roomNo = Math.round(clientNo / 4.1);
	}
	let data = {room: roomNo,client: clientNo}
	socket.join(roomNo);
	socket.emit("serverMsg", (data));

	allClients.push(socket.id);
	console.log(allClients);
	console.log(
		`New client connection: ${clientNo}, room nr. ${roomNo} (${socket.id})`
	);
	socket.on("newplayerName", (name) => {
		socket.broadcast.emit("newplayerName", name);
	});
	socket.on("removeUserElement", (name) => {
		socket.broadcast.emit("removeUserElement", name);
		database.remove({ value: name });
	});
	socket.on("buttonpressed", (data) => {
		io.to(data.room).emit("newuser");
		io.to(data.room).emit("startbt", data.client);
	});
	socket.on("disconnect", () => {
		console.log("DISCONNECTION for ", socket.id);
		console.log("disconn users: ", users);
		console.log("disconn userToRoom: ", userToRoom);
		clientNo--;
		
	});
}
// Main content - end -

// Error handling

app.use(function (req, res) {
	res.status(404);
	res.sendFile(__dirname + "/public/404.html");
	return;
});
