// Initial - start -
getUsers();
let socket = io();
const playerlist = document.getElementById("player-list");
const preroom = document.getElementById("pre-room");
const form = document.getElementById("form");
// initial - end -

// onLoad - start -
async function getUsers() {
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
}
socket.on("serverMsg", (data) => {
	document.getElementById(
		"RoomNo"
	).textContent = `You are joining room Nr. ${data.room}`;
	clientRoom = data.room;
	console.log('data', clientRoom);
	clientNum = data.client;
	console.log('num: ',clientNum);
	btpressedDATA = data;
});
// onLoad - end -

// client -> server - start -
form.addEventListener("submit", (e) => {
	form.style.display = "none";
	preroom.style.display = "block";
	socket.emit("buttonpressed", (btpressedDATA));
	name = document.getElementById("name").value;
	socket.emit("newplayerName", name);
	let Item = document.createElement("li");
	Item.setAttribute("id", `${name}`);
	Item.setAttribute("class", "user-listitem");
	Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>`;
	playerlist.appendChild(Item);
	document.getElementById(`${name}`).lastElementChild.textContent +=
		name + " (you)";
});

socket.on("newplayerName", (name) => {
	let Item = document.createElement("li");
	Item.setAttribute("id", `${name}`);
	Item.setAttribute("class", "user-listitem");
	Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>`;
	playerlist.appendChild(Item);
	document.getElementById(`${name}`).lastElementChild.textContent = name;
});

function backToName() {
	document.getElementById(`${name}`).remove();
	socket.emit("removeUserElement", name);
	preroom.style.display = "none";
	form.style.display = "block";
}

// client -> server - end -

// client <- server - start -
socket.on("disconnected", function () {
	socket.emit("removeUserElement", name);
});

socket.on("removeUserElement", (name) => {
	document.getElementById(`${name}`).remove();
});

socket.on("startbt", (data) => {
	if (data % 6 === 1) {
		let startbt = document.createElement("button");
		startbt.setAttribute("onclick", "start();");
		startbt.innerHTML = "Start";
		preroom.appendChild(startbt);
	}
});
// client <- server - end -

// Extra content
