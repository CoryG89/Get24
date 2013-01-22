/** Include Required NPM Modules */
var http = require('http');				// Node.JS HTTP Server
var path = require('path');				// String File Path Handler
var uuid = require('node-uuid');		// Universally Unique ID Generator
var express = require('express');		// Express WebApp Framework

/** Include Required Application Modules */
var Client = require('./client.js');	// Server-side representation of client

/** Maps UUIDs to individual client sockets */
var clientMap = {};

/** Server presets */
var maxConnections = 0;		// 0 for no limit

/** Values dynamically updated by the server */
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

/** Create an HTTP server with our express app object */
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('\nExpress server listening port ' + app.get('port') + '\n');
});

/** Get our global Socket.IO object for our server */
var io = require('socket.io').listen(server);

/** Setup basic routing */
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});
app.get('/*', function (req, res) {
	res.sendfile(__dirname + '/' + req.params[0]);
});

/** Handle events */
io.sockets.on('connection', onConnection);

/** Handle Ctrl-C Signal, shutdown gracefully */
process.on('SIGINT', function() {
	console.log('\nSIGINT signal received. Shutting down gracefully.');
	process.exit();
});

function onConnection(socket) {
	/** Use node-uuid to create a unique ID for our new client */
	var cli = new Client(socket, uuid());
	clientMap[cli.id] = cli;
	numConnections++;
	
	socket.emit('connected', {id: cli.id});
	
	socket.on('disconnect', function () {
		removeClient(cli.id);
	});
}

function getNumClients() { return Object.keys(clientMap).length; }
function removeClient(clientID) { delete clientMap[clientID]; }
