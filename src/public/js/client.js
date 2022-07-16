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
// onLoad - end -

// client -> server - start -
form.addEventListener("submit", (e) => {
  name = document.getElementById("name").value;
  socket.emit("newplayerName", name);
  preroom.style.display = "block";
  let Item = document.createElement("li");
  Item.setAttribute("id", `${name}`);
  Item.setAttribute("class", "user-listitem");
  Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>`;
  playerlist.appendChild(Item);
  document.getElementById(`${name}`).lastElementChild.textContent += name + ' (you)';
  syncWithDb(name);
});

function backToName() {
  document.getElementById(`${name}`).remove();
  socket.emit("removeUserElement", name);
  preroom.style.display = "none";
  form.style.display = "flex";
}

function syncWithDb(value) {
  const data = { value };
  console.log("item which has been inserted into UserDatabase", data);
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  };
  fetch("/users", options);
}
// client -> server - end -

// client <- server - start -
socket.on("newplayerName", (name) => {
  let Item = document.createElement("li");
  Item.setAttribute("id", `${name}`);
  Item.setAttribute("class", "user-listitem");
  Item.innerHTML = `<ion-icon class="icon-spacing-right icon-size-small" name="person-circle-outline"></ion-icon><span></span>`;
  playerlist.appendChild(Item);
  document.getElementById(`${name}`).lastElementChild.textContent = name;
});

socket.on("removeUserElement", (name) => {
  document.getElementById(`${name}`).remove();
});
// client <- server - end -

// Extra content
