const server = "http://10.1.3.151";
const port = 1245;
const xhttp = new XMLHttpRequest();

game = {id: new URLSearchParams(window.location.search).get("id")};
name = prompt("Namn:");

/*var upate = window.setInterval(function() {
	updateTable();
}, 1000);*/
if (game.id != null) {
	get("join", game, name);
}

//document.getElementById("card1").src = "/kort/" + card + ".png";

function get(x, y, z) {
	xhttp.open("GET", server + ":" +port + "?" + x + "&" + y + "&" + z, false);
	xhttp.onload = () => {
		resp = JSON.parse(xhttp.response);
	}
	xhttp.send("hall");
	return resp;
}
function make() {
	game = get("make", 0, name);
}

function updateTable() {
	state = get("status", game.id, name);
	document.getElementById("card1").src = "kort/" + state.cards[0] + ".png";
	document.getElementById("card2").src = "kort/" + state.cards[1] + ".png";

}
