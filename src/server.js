// Initial - start -
const {
	app,
	io,
	bodyparsing,
	listen,
	static,
	clientNo,
	users,
	userToRoom,
	gameIsOn,
	roomNo,
	removeDisconnectFromArray,
	removeStartedRoomFromArray,
	addContentToDb,
	checkName,
	removeAllUsersFromArray,
	Text,
	User,
	connectDB,
} = require("./helpers/VariableDefinitions.js");
static;
bodyparsing;
listen;
connectDB();
// initial - end -

io.sockets.on("connection", connected);
// Main content - start -
function connected(socket) {
	console.log("A new client was registed");
	clientNo.number++;
	socket.on("join", (data) => {
		let lobby = roomNo[data.lobby];
		if (data.lobby == lobby) {
			if (checkName(data)) {
				socket.join(lobby);
				console.log(`New client connection: ${clientNo.number}, room nr. ${lobby} (${socket.id})`);
				let senddata = {
					room: lobby,
					client: clientNo.number,
					name: data.name,
					icon: false,
				};
				socket.emit("success", senddata);
				console.log("Just came: ", data.name);
				users[socket.id] = data.name;
				let createData = userToRoom.filter(function (e) {
					return e.lobby == lobby;
				});
				userToRoom.push({
					name: data.name,
					lobby: lobby,
					socketid: socket.id,
					icon: false,
				});
				socket.emit("createOtherOnlineUsers", createData);
			} else {
				data = {
					boolean: true,
					message: "In that lobby you wanted to join,<br /> is already someone with that name",
				};
				socket.emit("fail", data);
			}
		} else {
			data = { boolean: true, message: "This lobby does not exists" };
			socket.emit("fail", data);
		}
	});
	socket.on("create", (data) => {
		if (data != roomNo[data]) {
			roomNo[data] = data;
			socket.join(roomNo[data]);
			console.log(
				`New client connection: ${clientNo.number}, room nr. ${roomNo[data]} (${socket.id})`
			);
			let datacreate = {
				room: roomNo[data],
				client: clientNo.number,
				name: data,
				icon: true,
			};
			socket.emit("success", datacreate);
			socket.emit("startbt");
			console.log("Just came: ", data);
			users[socket.id] = data;
			userToRoom.push({
				name: data,
				lobby: roomNo[data],
				socketid: socket.id,
				icon: true,
			});
			socket.broadcast.emit("ActiveLobbyDataRequest", userToRoom);
		} else {
			data = { boolean: false, message: "This lobby already exists" };
			socket.emit("fail", data);
		}
	});

	socket.on("addContentToDb", (data) => {
		addContentToDb(data);
		const quantity = gameIsOn.filter((e) => {
			return e.lobby == data.game;
		});
		io.in(data.game).emit("updateReadyPlayers", quantity.length);
	});

	socket.on("removeUserElement", (data) => {
		delete users[socket.id];
		console.log("data", data);
		io.to(data.lobby).emit("removeUserElement", data);
		if (data.user === data.lobby) {
			socket.leave(data.lobby);
			removeAllUsersFromArray(userToRoom, data);
			io.to(data.lobby).emit("SystemMessage", {
				message: `${data.user} left the lobby, the room will be terminated; you will be redirected shortly.`,
			});
			setTimeout(() => {
				io.to(data.lobby).emit("terminate");
				io.to(data.lobby).socketsLeave(data.lobby);
				if (io.sockets.adapter.rooms.get(data.lobby) == undefined) {
					delete roomNo[data.lobby];
				}
			}, 5000);
		}
		removeDisconnectFromArray(userToRoom, socket);
	});

	socket.on("NewUserUpdateOtherClients", (data) => {
		socket.to(data.room).emit("AddElementToOtherClients", data);
	});

	socket.on("ActiveLobbyDataRequest", () => {
		socket.emit("ActiveLobbyDataRequest", userToRoom);
	});

	socket.on("getInfoForChat", (data) => {
		let userObject = userToRoom.find((e) => {
			return e.socketid == data;
		});
		let playerAmount = userToRoom.filter((e) => {
			return e.lobby == userObject.lobby;
		});
		data = { user: userObject.name, lobby: userObject.lobby, amount: playerAmount.length };
		io.to(data.lobby).emit("getInfoForChat", data);
	});

	socket.on("sendMessageToOtherClients", (data) => {
		socket.to(data.lobby).emit("sendMessageToOtherClients", data);
	});

	socket.on("StartGame", (data) => {
		removeStartedRoomFromArray(userToRoom, data);
		const currentRoomUsers = gameIsOn.filter((e) => {
			return e.lobby == data.lobby;
		});
		Senddata = { gameIsOn, users, all: currentRoomUsers.length };
		io.in(data.lobby).emit("StartGame", Senddata);
	});
	socket.on("getLength", (data) => {
		const currentRoom = gameIsOn.filter((e) => {
			return e.lobby == data;
		});

		senddata = { all: currentRoom.length };
		socket.to(data).emit("getLength", senddata);
	});
	socket.on("SystemMessage", (data) => {
		socket.to(data.lobby).emit("SystemMessage", data);
	});

	socket.on("getDataFromDb", (data) => {
		async function getData() {
			console.log("socket.id:", socket.id);
			console.log("data get for init", data.datanew);
			senddata = await Text.find({ game: data.datanew.game, round: data.datanew.round });
			console.log("data from getDataFromDb", senddata);
			console.log("the data game: ", data.datanew.game);
			finaldata = { senddata: senddata, data: data.dataall };
			io.in(data.datanew.game).emit("DataFromDb", finaldata);
		}
		getData();
	});

	socket.on("disconnect", () => {
		console.log("DISCONNECTION for ", socket.id);
		console.log("disconn user: ", users[socket.id]);
		delete users[socket.id];
		let dcuser = userToRoom.find(function (e) {
			return e.socketid === socket.id;
		});
		if (dcuser != undefined) {
			Systemdata = { message: `${dcuser.name} has left the lobby` };
			io.to(dcuser.lobby).emit("SystemMessage", Systemdata);
			io.to(dcuser.lobby).emit("removeUserElement", { user: dcuser.name });
			if (dcuser.name === dcuser.lobby) {
				socket.leave(dcuser.lobby);
				removeAllUsersFromArray(userToRoom, dcuser);
				if (io.sockets.adapter.rooms.get(dcuser.lobby) == undefined) {
					// When lobby is empty (dcuser.lobby), because all clients left and the room then gets deleted, the room gets removed from the array
					delete roomNo[dcuser.lobby];
				}
				io.to(dcuser.lobby).emit("SystemMessage", {
					message: `${dcuser.name} disconnected, the room will be terminated; you will be redirected shortly.`,
				});
				setTimeout(() => {
					io.to(dcuser.lobby).emit("terminate");
				}, 5000);
				io.to(dcuser.lobby).socketsLeave(dcuser.lobby);
			} else {
				socket.leave(dcuser.lobby);
				removeDisconnectFromArray(userToRoom, socket);
				if (io.sockets.adapter.rooms.get(dcuser.lobby) == undefined) {
					delete roomNo[dcuser.lobby];
				}
			}
		}
		clientNo.number--;
	});
}
// Main content - end -

// Error handling

app.use(function (req, res) {
	res.status(404);
	res.sendFile(__dirname + "/public/404.html");
	return;
});
