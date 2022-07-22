function StartGame(data) {
	HEADER.style.display = "none";
	PREROOM.style.display = "none";
	GAMESECTION.style.display = "flex";
	console.log(data.users[SOCKET.id]);
	console.log(data);
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
	let getinfo = GAMETEXTAREA.className;
	const fromSplited = getinfo.split(" ");
	from = fromSplited[0];
	game = fromSplited[1];
	data = { text: input, from: from, game: game, round: r };
	SOCKET.emit("addContentToDb", data);
});
SOCKET.on("updateReadyPlayers", (data) => {
	updateReadyPLayers(data);
});
function startNewRound() {}
function endGame() {}
