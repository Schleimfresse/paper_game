const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const bodyparsing = app.use(bodyparser.json({ limit: "1mb" }));
const listen = server.listen(port, () => {console.log(`app listening at Port: ${port}`);});
const static = app.use(express.static("src/public"));
/**
 * Holds the number of the online users.
 * @param number
 * @returns The number of online users
 * @public
 */
clientNo = {
	number: 0
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
 * not used atm
 * @returns
 * @public
 */
let gameIsOn = {};
/** 
 * Contains all rooms that are created and active; empty rooms are deleted
 * @returns a list of the current created rooms
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

module.exports = {bodyparser,app,express,server,io,port,bodyparsing,listen,static,clientNo, users, userToRoom, gameIsOn, roomNo, removeDisconnectFromArray};