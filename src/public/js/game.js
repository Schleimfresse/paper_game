function StartGame(data) {
	HEADER.style.display = "none";
	PREROOM.style.display = "none";
	GAMESECTION.style.display = "flex";
	const Element = data.gameIsOn.find((e) => {
		return e.name == data.users[SOCKET.id];
	});
	GAMETEXTAREA.classList.add(Element.playerindex);
	GAMETEXTAREA.classList.add(Element.lobby);
	data = { ready: 0, all: data.all };
	setReadyPLayers(data);
}

SOCKET.on("StartGame", (data) => {
	StartGame(data);
});
GAMETEXTSUBMIT.addEventListener("click", () => {
	let input = GAMETEXTAREA.value;
	GAMETEXTSUBMIT.setAttribute("disabled", true);
	GAMETEXTAREA.value = "";
	SOCKET.emit("addContentToDb", getInfo(input));
});
SOCKET.on("updateReadyPlayers", (data) => {
	updateReadyPLayers(data);
});
function startNewRound() {
	SOCKET.emit("getLength", getInfo(undefined).game);
	SOCKET.once("getLength", (data) => {
		datanew = {
			from: getInfo(undefined).from,
			game: getInfo(undefined).game,
			round: getInfo(undefined).round,
		};
		if (datanew.from > data.all) {
			datanew.from = 1;
			SOCKET.emit("getDataFromDb", datanew);
		}
	});
}
function endGame() {}

SOCKET.on("DataFromDb", (data) => {
	console.log("gotten Data:", data);
	SHOWCASE.innerText = data.text;
});

// Taken alle das gleiche object etwas an der länge o.ä. ändern!