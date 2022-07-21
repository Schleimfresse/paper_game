/**
 * The socket.io client-side instance
 */
const SOCKET = io();
const PLAYERLIST = document.getElementById("player-list");
const PREROOM = document.getElementById("pre-room");
const FORM = document.getElementById("form");
const JOINBT = document.getElementById("Join");
const CREATEBT = document.getElementById("Create");
const ROOMNAME = document.getElementById("roomName");
const FORMCREATE = document.getElementById("formCreate");
const NAMEFIELD = document.getElementById("nameCreate");
const JCSELC = document.getElementById("joincreateselection");
const FAIL = document.getElementById("fail");
const FAILCREATE = document.getElementById("failCreate");
const NAMEJOIN = document.getElementById("name");
const ROOMNO = document.getElementById("RoomNo");
const STARTBT = document.createElement("button");
const BACKTOFORM = document.getElementById("backToForm");
const OPENLOBBYS = document.getElementById("openLobbys");
const CHATAREA = document.getElementById("chatarea");
const CHATFORM = document.getElementById("chatform");
const CHATSUBMIT = document.getElementById("chatsubmit");
const CHATTEXTFIELD = document.getElementById("chatTextfield");
const HEADER = document.querySelector("header");
const x = 5;
let you = "";
let LASTCLICK = 0;
let ICON = "";
function IconChooser(data) {
	if (data.icon) {
		ICON =
			'<ion-icon class="icon-spacing-right icon-size-small" name="diamond-outline"></ion-icon>';
		return ICON;
	} else if (!data.icon) {
		ICON =
			'<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon>';
		return ICON;
	}
}
function BackToForm() {
	document.getElementById(`${name}`).remove();
	SOCKET.emit("removeUserElement", name);
	PREROOM.style.display = "none";
	FORM.style.display = "block";
}
function createElement(data, boolean) {
	IconChooser(data);
	const ITEM = document.createElement("li");
	ITEM.setAttribute("id", `${data.name}`);
	ITEM.setAttribute("class", "user-listitem");
	ITEM.innerHTML = `${ICON}<span></span>`;
	PLAYERLIST.appendChild(ITEM);
	if (boolean) {
		you = " (you)";
	} else {
		you = "";
	}
	document.getElementById(`${data.name}`).children[1].innerText += data.name + you;
}
function SystemMessage(data) {
	console.log("data", data);
	const ITEMSys = document.createElement("div");
	ITEMSys.setAttribute("class", "system-message");
	ITEMSys.innerText = data.message;
	CHATAREA.appendChild(ITEMSys);
}
