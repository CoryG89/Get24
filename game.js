/**
 * game.js
 * 
 * Author: Cory Gross (cmg0030@tigermail.auburn.edu)
 * Last Modified: January 26, 2013
 *
 * Each Game object instance is a single Get24 game instance, with a
 * certain number of player slots. Each game has a unique ID and opens 
 * its own Socket.IO channel to establish game-specific communication.
 */

/** Import required modules */
var uuid = require('node-uuid');				// Easy UUID generation
var Parser = require('node-expression-eval');	// JavaScript Expression Evaluator
var Timer = require('./timer.js');				// Custom callback timer

var Game = function (io) {
	
	/** Object wide reference to 'this' within all closures */
	var self = this;
	
	/** Set initial values */
	var playerCount = 0;
	var gameID = uuid();
	var gameCard = getRandomCard();
	
	/** Configure the game's internal timer */
	var gameTimer = new Timer({
		initialTime: Game.INITIAL_TIMER,
		tickCallback: function (time) {
			io.sockets.in(gameID).emit('timer', {time: time});
		},
		finalCallback: function () {
			gameCard = getRandomCard();
			io.sockets.in(gameID).emit('newCard', {card: gameCard});
		},
		loop: true
	});
	
	/** Attaches the player socket and emits all proper messages. */
	function connectPlayer(socket) {
		attachSocket(socket);
		playerCount++;
		socket.emit('gameJoined', {
			room: gameID, 
			card: gameCard, 
			numPlayers: playerCount 
		});
		socket.broadcast.to(gameID).emit('playerJoined', {numPlayers: playerCount});
		if (playerCount === 1) gameTimer.start();
	}
	
	/** Joins the player socket to this game's Socket.IO channel and
		attaches all the game's event handlers. */
	function attachSocket(socket) {
		socket.join(gameID);
		
		socket.on('disconnect', function () {
			if (--playerCount === 0) gameTimer.reset();
			socket.broadcast.to(gameID).emit('playerQuit', {numPlayers: playerCount});
		});
		
		socket.on('submitExpression', function (data) {
			var res = validate(data.expression);
			if (res === 0) {
				var passedEval = true;
				
				try { data.evaluated = Parser.evaluate(data.expression); } 
				catch(e) {	
					passedEval = false;
					socket.emit('invalidExpr', {msg: 'Invalid.'});
				} finally {
					if (passedEval)	emitEvaluation(socket, data);
				}
			}
			else if (res === -1) {
				socket.emit('invalidExpr', {msg: 'Must use all 4 digits.'});
			}
			else if (res === -2) {
				socket.emit('invalidExpr', {msg: 'Legal operators are \'+-*/()\'.'});		
			}
			else if (res === -3) {
				socket.emit('invalidExpr', {msg: 'Digits can\'t be combined.'});
			}
		});
	}
	
	/** Validates incoming expression strings from player clients. Each of the
		four digits given in the game card must be used exactly once. Besides
		whitespace, other legal operators include --> +, -, *, /, and ().   */
	function validate(expr) {
		var temp = expr;
		
		/** Find each of the card digits within the expression stripping them
			out. If we cannot find one of the card digits, stop & return -1. */
		for (var i = 0; i < gameCard.length; i++) {
			var res = temp.search(gameCard[i]);
			if (res < 0) return -1;
			else if (res < temp.length - 1 && !isNaN(parseInt(temp[res+1]))) return -3;
			else temp = temp.replace(temp[res],'');
		}
		
		/** At this point, all card digits have been found, and stripped out
			of our temp expression string. All chars remaining should be
			legal operators, otherwise stop and return -2.   */
		for (var j = 0; j < temp.length; j++) {
			switch(temp[j]) {
				case ' ':
				case '+':
				case '-':
				case '*':
				case '/':
				case '(':
				case ')':
					break;
				default:
					return -2;
			}
		}
		return 0;
	}
	
	/** Emits the value of the evalution of a submitted expression. Checks
		if the value is equal to 24, if so this function emits a win to this 
		client, and broadcasts a lose to all other clients in the game's channel.
		A new random game card is generated and emitted as well. */
	function emitEvaluation(socket, data) { 
		socket.emit('evaluatedExpr', { evaluated: data.evaluated });
		if (data.evaluated === 24) {
			gameTimer.restart();
			gameCard = getRandomCard();
			socket.emit('youWin', { card: gameCard });
			socket.broadcast.to(gameID).emit('youLose', {
				expression: data.expression,
				card: gameCard
			});
		}
	}
	
	/** Randomizes the current game cards weighting by difficulty */
	function getRandomCard() {
		var rnd = Math.random() * 10;
		
		/** 50% of the time we will use medium difficulty cards */
		if (rnd <= 5) {
			var rnd = Math.floor(Math.random() * Game.Cards.med.length);		
			return Game.Cards.med[rnd];
		} 
		/** 30% of the time we will use easy difficulty cards */
		else if (rnd <= 8) {
			var rnd = Math.floor(Math.random() * Game.Cards.easy.length);
			return Game.Cards.easy[rnd];
		} 
		/** 20% of the time we will use hard difficulty cards */
		else {
			var rnd = Math.floor(Math.random() * Game.Cards.hard.length);
			return Game.Cards.hard[rnd];
		}	
	}
	
	/** Expose public methods */
	this.getGameID = function () { return gameID; };
	this.join = function (socket) { connectPlayer(socket); };
	this.isFull = function () { return (playerCount === Game.MAX_PLAYERS); };
};

/** Get24 game presets as public static variables */
Game.MAX_PLAYERS = 4;
Game.INITIAL_TIMER = 300;

/** Import game card data from custom Node.JS module as static variable */
Game.Cards = require('./gameCards.js');

/** Export as Node.JS Module */
module.exports = Game;
