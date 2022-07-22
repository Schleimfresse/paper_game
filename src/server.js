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
	rounds,
	mongoose,
	dotenv,
	addContentToDb,
	Text
} = require("./helpers/VariableDefinitions.js");
static;
bodyparsing;
listen;
mongoose.connect(
	process.env.URI,
	() => {
		console.log("connected");
	},
	(e) => console.error(e)
);
f();
async function f() {
	let content = new Text({ text: "Hello, this is a test obj" });
	await content.save();
}
// initial - end -

io.sockets.on("connection", connected);
// Main content - start -
function connected(socket) {
	console.log("A new client was registed");
	clientNo.number++;
	socket.on("join", (data) => {
		let lobby = roomNo[data.lobby];
		if (data.lobby == lobby) {
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
			socket.emit("fail", true);
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
			socket.emit("fail", false);
		}
	});
	socket.on("addContentToDb", (data) => {
		addContentToDb(data);
		const quantity = gameIsOn.filter((e) => {
			return e.lobby == data.game;
		});
		io.in(data.game).emit("updateReadyPlayers", quantity.length);
	});
	socket.on("removeUserElement", (name) => {
		socket.broadcast.emit("removeUserElement", name);
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
		socket.emit("getInfoForChat", data);
	});
	socket.on("sendMessageToOtherClients", (data) => {
		socket.to(data.lobby).emit("sendMessageToOtherClients", data);
	});
	socket.on("StartGame", (data) => {
		removeStartedRoomFromArray(userToRoom, data);
		const currentRoomUsers = gameIsOn.filter((e) => {
			return e.lobby == data.lobby;
		});
		console.log(currentRoomUsers);
		Senddata = { gameIsOn, users, all: currentRoomUsers.length };
		io.in(data.lobby).emit("StartGame", Senddata);
	});
	socket.on("SystemMessage", (data) => {
		socket.to(data.lobby).emit("SystemMessage", data);
	});
	socket.on("disconnect", () => {
		console.log("DISCONNECTION for ", socket.id);
		console.log("disconn user: ", users[socket.id]);

		let dcuser = userToRoom.find(function (e) {
			return e.socketid === socket.id;
		});
		if (dcuser != undefined) {
			Systemdata = { message: `${dcuser.name} has left the lobby` };
			socket.to(dcuser.lobby).emit("SystemMessage", Systemdata);
			socket.broadcast.emit("removeUserElement", dcuser.name);
			if (dcuser.name === dcuser.lobby) {
				roomNo[dcuser.lobby] = undefined;
				socket.leave(dcuser.lobby);
				removeDisconnectFromArray(userToRoom, socket);
				console.log("Usertoroom", userToRoom);
			} else {
				socket.leave(dcuser.lobby);
				removeDisconnectFromArray(userToRoom, socket);
				console.log("Usertoroom", userToRoom);
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
