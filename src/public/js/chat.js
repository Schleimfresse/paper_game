CHATSUBMIT.addEventListener("click", () => {
	if (CHATTEXTFIELD.value != "") {
		SOCKET.emit("getNameForChat", SOCKET.id);
		SOCKET.on("getNameForChat", (data) => {
			const ITEM = document.createElement("div");
			ITEM.setAttribute("class", "message");
			ITEM.innerHTML = `<span class="chat-name">${data.user}</span><span class="chat-message-content"></span>`;
			ITEM.children[1].innerText = CHATTEXTFIELD.value;
			CHATAREA.appendChild(ITEM);
			data = { message: CHATTEXTFIELD.value, user: data.user, lobby: data.lobby };
			SOCKET.emit("sendMessageToOtherClients", data);
			CHATTEXTFIELD.value = "";
		});
	}
});

SOCKET.on("sendMessageToOtherClients", (data) => {
	const ITEM = document.createElement("div");
	ITEM.setAttribute("class", "message");
	ITEM.innerHTML = `<span class="chat-name">${data.user}</span><span class="chat-message-content"></span>`;
	ITEM.children[1].innerText = data.message;
	CHATAREA.appendChild(ITEM);
});
SOCKET.on("SystemMessage", (data) => {
	SystemMessage(data);
});
