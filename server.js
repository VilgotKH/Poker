const http = require("http");
const host = "10.1.3.151";
const port = "1245";

var games = [];

var deck = [];
var houses = ["r", "h", "s", "k"];
for (i = 0; i < houses.length; i++) {
	for (j = 2; j <= 13; j++) {
		deck.push(houses[i] + j);
	}
	deck.push(houses[i] + "a");
}
function shuffle(x) {
	out = [];
	while(x.length > 0) {
		c = Math.round(Math.random()*(x.length-1));
		out.push(x[c]);
		x.splice(c, 1);
	}
	return out;
}
console.log(deck);
//deck = shuffle(deck);
console.log(deck);

const server = http.createServer((function(req, res) {
	const headers = {
        	'Access-Control-Allow-Origin': '*',
        	'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        	'Access-Control-Max-Age': 2592000,
      	};
	if (req.method === "GET") {
		request = req.url.replace("/?", "").split("&");
		res.writeHead(200, headers);	
		if (request[0] == "make") {
			done = false;
			while (done == false) {
				done = true;
				id = Math.round(Math.random()*10000);
				for (i = 0; i < games.length; i++) {
					if (games[i].id == id ) {
						done = false;
					}
				}
			}
			console.log(id);
			if (request[2] != "undefined") {
				games.push({deck: [], players: [{name: request[2], cards: []}], pot: 0, table: [], id: id, on: false});
				console.log(request[2]);
				resp = JSON.stringify({id: id});
			}
			else {
				resp = ("no name");
			}
			console.log(games);
		}
		else if (request[0] == "join") {
			succs = false;
			for (i = 0; i < games.length; i++) {
				if (games[i].id == request[1] && !games[i].on) {
					done = false;
					for (j = 0; j < games[i].players.length; j++) {
						if (games[i].players[j].name == request[2]) {
							done = true;
						}
					}
					if (!done) {
						games[i].players.push({name: request[2], cards: []});
						succs = true;
					}
				}
			}
			resp = JSON.stringify("Succsesfully joined: " + request[1]);
		}
		else if (request[0] == "status") {
			for (i = 0; i < games.length; i++) {
				if (games[i].id == request[1]) {
					response = {pot: games[i].pot, table: games[i].table, players: [], cards: []}
					for (j = 0; j < games[i].players.length; j++) {
						if (games[i].players[j].name == request[2]) {
							response.cards = games[i].players[j].cards;
						}
						else {
						response.players.push({name: games[i].players[j].name});
						}
					}
					resp = (JSON.stringify(response));
				}
				else {
					resp = ("wut");
				}
			}
		}
		else if (request[0] == "start") {
			for (i = 0; i < games.length; i++) {
				if (games[i].id == request[1] && games[i].players[0].name == request[2]) {
					console.log(games[i]);
					games[i].on = true;
					games[i].deck = shuffle(deck);
					for (j = 0; j < 2; j++) {
						for (k = 0; k < games[i].players.length; k++) {
							games[i].players[k].cards.push(games[i].deck.splice(0,1));
						}
					}
					resp = (JSON.stringify("Started"));
				}
				else {
					console.log(request);
					resp = (JSON.stringify("Denied"));
				}
			}
		}
		else {	
			resp = (JSON.stringify(deck.splice(0,2)).toString());
		}
		res.end(resp);
	}
})).listen(port, "0.0.0.0");
