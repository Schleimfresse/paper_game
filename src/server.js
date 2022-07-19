// Initial - start -
require("dotenv").config();
const Datastore = require("nedb");
const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
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
let gameIsOn = {};
let roomNo = {};
io.sockets.on("connection", connected);
// Main content - start -
function connected(socket) {
	clientNo++;
	if (clientNo % 6 === 1) {
		firstplayer = 2;
	}

	roomNo[firstplayer] = clientNo / 4.1;

	if (roomNo[firstplayer] < 1) {
		roomNo[firstplayer] = Math.round(1);
	} else if (roomNo[firstplayer] > 1) {
		roomNo[firstplayer] = Math.round(clientNo / 4.1);
	}
	console.log(
		`New client connection: ${clientNo}, room nr. ${roomNo[firstplayer]} (${socket.id})`
	);

	socket.on("newplayerName", (name) => {
		console.log(roomNo[firstplayer]);
		if (roomNo[firstplayer] === 1) {
			//roomNo = 1;
			roomNo = name;
		}
		let data = { room: roomNo, client: clientNo };
		socket.join(roomNo[firstplayer]);
		socket.emit("serverMsg", data);

		console.log("Just came: ", name);
		users[socket.id] = name;
		console.log(users);
		console.log(users[socket.id]);
		userToRoom[name] = 0;
		console.log("HENCE UserToRoom: ", userToRoom);
		socket.broadcast.emit("newplayerName", name);
	});
	socket.on("removeUserElement", (name) => {
		socket.broadcast.emit("removeUserElement", name);
	});
	socket.on("buttonpressed", (data) => {
		io.to(data.room).emit("newuser");
		if (data.client == 1 && data.room == roomNo) {
			io.to(roomNo[firstplayer]).emit("startbt", data.client);
		}
	});
	socket.on("disconnect", () => {
		console.log("DISCONNECTION for ", socket.id);
		console.log("disconn user: ", users[socket.id]);
		console.log("disconn userToRoom: ", userToRoom);
		socket.broadcast.emit("removeUserElement", users[socket.id]);
		socket.leave(roomNo[firstplayer])
		try {
			if (users[socket.id] == roomNo) {
				
			}
		} catch (err) {
			console.log("Error cannot find room after refresh:", err);
		}
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
