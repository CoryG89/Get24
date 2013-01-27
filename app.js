/** Include Required NPM Modules */
var http = require('http');				// Node.JS HTTP Server
var path = require('path');				// String File Path Handler
var express = require('express');		// Express WebApp Framework

/** Include Required Application Modules */
var Client = require('./client.js');	// Server-side representation of client

var Game = require('./game.js');

/** Server preset constants */
var MAX_CONNECTIONS = 100;		// 0 for no limit

/** No. of currently connected, dynamically updated by the server */
var numConnections = 0;		

/** Get express app object and set global configuration */
var app = express();
app.configure(function () {
	app.set('port', process.env.PORT || 3001);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('SuperDuperAppSpecificSecretGoesHere'));
	app.use(express.session());
	app.use(express.static(path.join(__dirname, 'public')));
});

/** Setup express dev configuration */
app.configure('development', function () {
	app.use(express.errorHandler());
});

/** Setup routing, serve files from the public directory */
app.get('/*', function (req, res) {
	res.sendfile(__dirname + '/public/' + req.params[0]);
});

/** Create an HTTP server with our configured express app object */
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('\nExpress server listening port ' + app.get('port') + '\n');
});

/** Get our global Socket.IO object for our server */
var io = require('socket.io').listen(server);

/** Setup and define connection handler */
io.sockets.on('connection', onConnection);

/** Maps UUIDs to client socket references */
var clientMap = {};

/** Maps room names to game references */
var gameList = [];

function onConnection(socket) {
	if (!accept(socket)) refuse(socket);

	if (gameList.length === 0) {
		gameList.push(new Game(io));
		gameList[0].join(socket);
	} else {
		var gameFound = false;
	
		for (var i = 0; i < gameList.length; i++) {
			if (!gameList[i].isFull()) {
				gameList[i].join(socket);
				gameFound = true;
				break;
			}
		}
		if (!gameFound) {
			gameList.push(new Game(io));
			gameList[gameList.length - 1].join(socket);
		}
	}

	socket.on('disconnect', function () {
		numConnections--;
	});	
}

/** Checks if we are at maximum capacity before fully connecting with client,
	If client is accepted, true is returned. False is returned otherwise. */
function accept(socket) {
	if (++numConnections <= MAX_CONNECTIONS) {
		socket.emit('connected', {numUsers: numConnections});
		return true;
	}
	else return false;
}

/** If we are over capacity, call this function to send a msg
    and begin delayed disconnect */
function refuse(socket) {
	socket.emit('overCapacity');
	socket.disconnect();
	numConnections--;
}

/** Handle Ctrl-C Signal, shutdown gracefully */
process.on('SIGINT', function() {
	console.log('\nSIGINT signal received. Shutting down gracefully.');
	process.exit();
});

