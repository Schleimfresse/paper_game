// Initial - start -
//getUsers();
let socket = io();
const playerlist = document.getElementById("player-list");
const preroom = document.getElementById("pre-room");
const form = document.getElementById("form");
const joinbt = document.getElementById("Join");
const createbt = document.getElementById("Create");
const roomName = document.getElementById("roomName");
const formCreate = document.getElementById("formCreate");
const namefield = document.getElementById("nameCreate");
const jcselc = document.getElementById("joincreateselection");
const fail = document.getElementById("fail");
const nameJ = document.getElementById("name");
let lastClick = 0;

// initial - end -

// onLoad - start -
/*async function getUsers() {
	const response = await fetch("/users");
	const data = await response.json();
	console.log("Items:", data);
	for (item of data) {
		let Item = document.createElement("li");
		Item.setAttribute("id", `${item.value}`);
		Item.setAttribute("class", "user-listitem");
		Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span>${item.value}</span>`;
		playerlist.appendChild(Item);
	}
}*/
// onLoad - end -

// on success - start -
socket.on("success", (data) => {
	form.style.display = "none";
	preroom.style.display = "block";
	document.getElementById(
		"RoomNo"
	).textContent = `You are in ${data.room}'s lobby`;
	let Item = document.createElement("li");
	Item.setAttribute("id", `${data.name}`);
	Item.setAttribute("class", "user-listitem");
	Item.innerHTML =
		'<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>';
	playerlist.appendChild(Item);
	document.getElementById(`${data.name}`).children[1].textContent +=
		data.name + " (you)";
	clientRoom = data.room;
	clientNum = data.client;
	//btpressedDATA = data;
	//socket.emit("buttonpressed", btpressedDATA);
	socket.emit("NewUserUpdateOtherClients", data.name);
});
// on success - end -

// show the create or the join form - start -
joinbt.addEventListener("click", () => {
	jcselc.style.display = "none";
	form.style.display = "block";
});
createbt.addEventListener("click", () => {
	jcselc.style.display = "none";
	formCreate.style.display = "block";
});
// show the create or the join form - end -

// client -> server - start -
form.addEventListener("submit", (e) => {
	let lobbyName = roomName.value;
	name = nameJ.value;
	let data = { lobby: lobbyName, name: name };
	socket.emit("join", data);
});

formCreate.addEventListener("submit", (e) => {
	formCreate.style.display = "none";
	preroom.style.display = "block";
	name = namefield.value;
	socket.emit("create", name);
});

function backToName() {
	document.getElementById(`${name}`).remove();
	socket.emit("removeUserElement", name);
	preroom.style.display = "none";
	form.style.display = "block";
}

function start() {}
// client -> server - end -

// client <- server - start -
socket.on("disconnected", function () {
	socket.emit("removeUserElement", name);
});

socket.on("AddElementToOtherClients", (data) => {
	let Item = document.createElement("li");
	Item.setAttribute("id", `${data}`);
	Item.setAttribute("class", "user-listitem");
	Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>`;
	playerlist.appendChild(Item);
	document.getElementById(`${data}`).lastElementChild.textContent = data;
});

socket.on("removeUserElement", (name) => {
	if (name != null) {
		document.getElementById(`${name}`).remove();
	}
});

socket.on("createOtherOnlineUsers", (data) => {
	for (item of data) {
		let Item = document.createElement("li");
		Item.setAttribute("id", `${item.name}`);
		Item.setAttribute("class", "user-listitem");
		Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>`;
		playerlist.appendChild(Item);
		document.getElementById(`${item.name}`).lastElementChild.textContent =
			item.name;
	}
});

socket.on("startbt", () => {
	let startbt = document.createElement("button");
	startbt.setAttribute("onclick", "start();");
	startbt.setAttribute("id", "startbt");
	startbt.setAttribute("class", "bt-small");
	startbt.innerHTML = "Start";
	preroom.appendChild(startbt);
});
socket.on("fail", () => {
	console.log(lastClick >= Date.now() - 4000);
	if (!(lastClick >= Date.now() - 5000)) {
		fail.style.visibility = "visible";
		fail.classList.add("transition");
		setTimeout(() => {
			fail.classList.remove("transition");
			fail.style.visibility = "hidden";
		}, 3000);
		lastClick = Date.now();
	}
});
// client <- server - end -

// Extra content
