const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const bodyparsing = app.use(bodyparser.json({ limit: "1mb" }));
const listen = server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
const mongoose = require('mongoose');
const static = app.use(express.static("src/public"));
const URI = "mongodb+srv://user1:UJQ8ASHxMDNgEKEk@cluster0.fucjh.mongodb.net/?retryWrites=true&w=majority"
/**
 * Holds the number of the online users.
 * @param number
 * @returns The number of online users
 * @public
 */
clientNo = {
	number: 0,
};
/**
 * A list of socket ids with the associated username.
 * @returns A list with all current online users.
 * @public
 */
let users = {};
/**
 * Contains all users who are currently online.
 * @param {*} Object
 * @returns The current online users
 * @public
 */
let userToRoom = [];
/**
 * Contains all users who are currently in a game
 * @returns an array with all users who are currently in a game
 * @public
 */
let gameIsOn = [];
/**
 * Contains all rooms that are created and active; empty rooms are deleted
 * @returns a list of the current created rooms
 * @public
 */
let roomNo = {};
/**
 * Contains the number how much rounds are played; on default its set to 6
 * @public
 */
const rounds = 6;
/**
 * Removes the entry of the disconnected user from the userToRoom array.
 * @param {Object} userToRoom - Array
 * @returns the updated userToRoom array
 * @public
 */
function removeDisconnectFromArray(userToRoom, socket) {
	const indexOfObject = userToRoom.findIndex((e) => {
		return e.socketid == socket.id;
	});
	userToRoom.splice(indexOfObject, 1);
}
function removeStartedRoomFromArray(array, data) {
	const ARRAYLENGTH = array.length;
	for (let i = 0; i < ARRAYLENGTH; i++) {
		const index = array.findIndex((e) => {
			return e.lobby == data.lobby;
		});
		if (index !== -1) {
			let spliceArray = array.splice(index, 1);
			let obj = spliceArray[0];
			const filterforobjects = gameIsOn.filter((e) => {
				return e.lobby == obj.lobby;
			}); 
			obj.playerindex = filterforobjects.length + 1;
			gameIsOn.push(obj);
			console.log(gameIsOn);
		}
	}
}

module.exports = {
	bodyparser,
	app,
	express,
	server,
	io,
	port,
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
	URI,
	mongoose,
	server,
};
