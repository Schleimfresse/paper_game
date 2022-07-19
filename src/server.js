// Initial - start -
let {app,server,io,port,bodyparsing,listen,static,clientNo, users, userToRoom, gameIsOn, roomNo, removeDisconnectFromArray} = require("./helpers/VariableDefinitions.js");
static;
bodyparsing;
listen;
// initial - end -

io.sockets.on("connection", connected);
// Main content - start -
function connected(socket) {
	clientNo++;
	socket.on("join", (data) => {
		let lobby = roomNo[data.lobby];
		if (data.lobby == lobby) {
			socket.join(lobby);
			console.log(
				`New client connection: ${clientNo}, room nr. ${lobby} (${socket.id})`
			);
			let senddata = { room: lobby, client: clientNo, name: data.name };
			socket.emit("success", senddata);
			console.log("Just came: ", data.name);

			users[socket.id] = data.name;
			console.log("all Users", users);
			console.log("UserToRoom withiut new User", userToRoom);
			let createData = userToRoom.filter(function (e) {
				return e.lobby == lobby;
			});
			userToRoom.push({ name: data.name, lobby: lobby, socketid: socket.id });
			console.log("createDATA", createData);
			socket.emit("createOtherOnlineUsers", createData);
		} else {
			socket.emit("fail");
		}
	});
	socket.on("create", (data) => {
		console.log("create data", data);
		roomNo[data] = data;
		console.log("create roomno", roomNo[data]);
		console.log("create roomno without", roomNo);
		socket.join(roomNo[data]);
		console.log(
			`New client connection: ${clientNo}, room nr. ${roomNo[data]} (${socket.id})`
		);
		let datacreate = { room: roomNo[data], client: clientNo, name: data };
		socket.emit("success", datacreate);
		socket.emit("startbt");
		console.log("Just came: ", data);
		users[socket.id] = data;
		console.log(users);
		console.log(users[socket.id]);
		userToRoom.push({ name: data, lobby: roomNo[data], socketid: socket.id });
		console.log(userToRoom);
	});
	socket.on("removeUserElement", (name) => {
		socket.broadcast.emit("removeUserElement", name);
	});
	socket.on("NewUserUpdateOtherClients", (data) => {
		socket.broadcast.emit("AddElementToOtherClients", data);
	});

	socket.on("disconnect", () => {
		console.log("DISCONNECTION for ", socket.id);
		console.log("disconn user: ", users[socket.id]);

		let dcuser = userToRoom.find(function (e) {
			return e.socketid === socket.id;
		});
		console.log(dcuser);
		socket.broadcast.emit("removeUserElement", dcuser.name);
		if (dcuser.name === dcuser.lobby) {
			roomNo[dcuser.lobby] = undefined;
			socket.leave(dcuser.lobby);

			removeDisconnectFromArray(userToRoom);
		} else {
			socket.leave(dcuser.lobby);
			removeDisconnectFromArray(userToRoom);
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

// <ion-icon name="diamond-outline"></ion-icon>
