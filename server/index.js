/**
 * app.js
 * 
 * Author: Cory Gross (cmg0030@tigermail.auburn.edu)
 *
 * Sets up an Node.JS HTTP server, using that to create an Express app.
 * Initializes Socket.IO and configures a socket for the server to listen on
 * for incoming socket connections. Handles incoming connections and manages 
 * a list of games.
 */

/** Import required modules */
var http = require('http');
var path = require('path');
var express = require('express');

/** Import custom Get24 Game object */
var Game = require('./game');

/** Import server configuration file */
var config = require('./config');
var maxConnections = config.maxConnections;

/** List of stored game obects and global connection counter */
var gameList = [];
var numConnections = 0;

/** Get express app object and set global configuration */
var app = express();
app.configure(function () {
	app.set('port', process.env.PORT || config.port);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.static(path.join(__dirname, '..', 'public')));
});

/** Setup express dev configuration */
app.configure('development', function () {
	app.use(express.errorHandler());
});

/** Create an HTTP server with our configured express app object */
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('\nExpress server listening port ' + app.get('port') + '\n');
});

/** Use Socket IO to listen on the same port as our server */
var io = require('socket.io').listen(server);

io.configure('development', function () {
    io.set('origins', 'http://localhost:' + app.get('port'));
});

io.configure('production', function () {
    io.set('origins', 'http://get24.jit.su:80');
});

io.sockets.on('connection', function (socket) {
    if (!accept(socket)) return;

	if (gameList.length === 0) {
		gameList.push(new Game(io));
		gameList[0].join(socket);
	} else {
		var allGamesFull = true;
	
		for (var i = 0; i < gameList.length; i++) {
            var game = gameList[i];

			if (!game.isFull()) {
				game.join(socket);
				allGamesFull = false;
				break;
			}
		}

		if (allGamesFull) {
			gameList.push(new Game(io));
			gameList[gameList.length - 1].join(socket);
		}
	}

	socket.on('disconnect', function () {
		numConnections--;
	});	
});

/** Checks if we are at maximum capacity before fully connecting with client,
	If client is accepted, true is returned. False is returned otherwise. */
function accept(socket) {
    if (maxConnections === 0 || numConnections < maxConnections) {
        socket.emit('connected', { numUsers: ++numConnections });
        return true;
    }
    else {
        socket.emit('overCapacity');
        socket.disconnect();
        return false;
    }
}

/** Handle Ctrl-C Signal, shutdown gracefully */
process.on('SIGINT', function() {
	console.log('\nSIGINT signal received. Shutting down gracefully.');
	process.exit();
});

