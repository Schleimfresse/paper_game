const bodyparser = require("body-parser");
const express = require("express");
require("dotenv").config();
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const bodyparsing = app.use(bodyparser.json({ limit: "1mb" }));
const listen = server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
const mongoose = require("mongoose");
const Text = require("../models/content");
const User = require("../models/users");
const static = app.use(express.static("src/public"));
const connectDB = require("../config/db");
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
 * Contains all users who are currently online and in which room they are
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
 * @returns a list of the current created rooms and from which user they are created, usally the same, because the room is named after the user
 * @public
 */
let roomNo = {};
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
async function addContentToDb(data) {
	let content = new Text({
		text: data.text,
		from: parseInt(data.from),
		round: data.round,
		game: data.game,
	});
	await content.save();
}
function checkName(data) {
	const check = userToRoom.some((e) => e.name === data.name && e.lobby === data.lobby);
	if (check) {
		return false;
	} else {
		return true;
	}
}
function removeAllUsersFromArray(userToRoom, dcuser) {
	const indexOfObject = userToRoom.filter((e) => {
		return e.lobby == dcuser.lobby;
	});
	console.log("index", indexOfObject.length);
	for (i = indexOfObject.length - 1; i >= 0; i--) {
		userToRoom.splice(indexOfObject[i], 1);
	}
	console.log("users", userToRoom);
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
	addContentToDb,
	checkName,
	removeAllUsersFromArray,
	Text,
	User,
	connectDB
};
