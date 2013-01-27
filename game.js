var uuid = require('node-uuid');
var Parser = require('./parser.js');
var Timer = require('./timer.js');

var Game = function (io) {
	
	/** Set initial values */
	var playerCount = 0;
	var gameID = uuid();
	var gameCard = getRandomCard();
	
	/** Object wide reference to 'this' within all closures */
	var self = this;
	
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
	
	function connectPlayer(socket) {
		attachSocket(socket);
		playerCount++;
		socket.emit('gameJoined', { room: gameID, numPlayers: playerCount });
		socket.broadcast.to(gameID).emit('playerJoined', {numPlayers: playerCount});
		
		switch (playerCount) {
			case 2:
				gameTimer.start();
				io.sockets.in(gameID).emit('gameCard', {card: gameCard});
				break;
			case 3:
			case 4:
				socket.emit('gameCard', { card: gameCard });
				break;
			default: 
				socket.emit('waiting');
				break;
		}
	}
	
	function attachSocket(socket) {
		socket.join(gameID);
		
		socket.on('disconnect', function () {
			if (--playerCount === 0) gameTimer.reset();
			socket.broadcast.to(gameID).emit('playerQuit', {numPlayers: playerCount});
		});
		
		socket.on('submitExpression', function (data) {
		
			var res = validate(data.expression);
	
			if (res === 0) {
	
				var evaluated = Parser.evaluate(data.expression);
			
				socket.emit('evaluatedExpr', { evaluated: evaluated });
				if (evaluated === 24) {
					gameTimer.restart();
					gameCard = getRandomCard();
				
					socket.emit('youWin', { card: gameCard });
					socket.broadcast.to(gameID).emit('youLose', {
						expression: data.expression,
						card: gameCard
					});
				}
		
			} else if (res === -1) {
					socket.emit('invalidExpr', {msg: 'You must use all four digits shown.'});
			} else if (res === -2) {
					socket.emit('invalidExpr', {msg: "Legal operators are '+-*/()'."});
			}
		
		});
	}
	
	function getRandomCard() {
		var rnd = Math.random() * 10;
		
		if (rnd <= 5) { 		/** 50% of the time we will use medium difficulty cards */
				var rnd = Math.floor(Math.random() * 24);
				
				return Game.Cards.med[rnd];
		} else if (rnd <= 8) {  /** 30% of the time we will use easy difficulty cards */
				var rnd = Math.floor(Math.random() * 12);
				
				return Game.Cards.easy[rnd];
		} else { 				/** 20% of the time we will use hard difficulty cards */
				var rnd = Math.floor(Math.random() * 11);
				
				return Game.Cards.hard[rnd];
		}	
	}
	
	function validate(expr) {
		var temp = expr;
		
		for (var i = 0; i < gameCard.length; i++) {
			var res = temp.search(gameCard[i]);
			if (res < 0) return -1;
			else temp = temp.replace(temp[res],'');
		}
		
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
	
	this.getGameID = function () { return gameID; };
	this.join = function (socket) { connectPlayer(socket); };
	this.isFull = function () { return (playerCount === Game.MAX_PLAYERS); };
};

Game.MAX_PLAYERS = 4;
Game.INITIAL_TIMER = 300;
Game.Cards = require('./gameCards.js');


module.exports = Game;
