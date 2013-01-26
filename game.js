var uuid = require('node-uuid');
var Parser = require('./parser.js');

var Game = function (io, socket) {

	/** Array to store game players in */
	var player = [];
	
	var timer = Game.INITIAL_TIMER;
	
	this.roomName = uuid();
	
	/** Get a random game card to start with */
	this.card = getRandomCard();
	
	var self = this;
	var timerStarted = false;
	this.join = function (socket) {
		player.push(socket);
		socket.join(this.roomName);
		socket.emit('gameJoined', { room: this.roomName, numPlayers: player.length });
		socket.broadcast.to(this.roomName).emit('playerJoined', {numPlayers: player.length});
		
		if (player.length == 2) {
			if (!timerStarted) startTimer();
			io.sockets.in(this.roomName).emit('gameCard', {card: this.card});
		} else if (player.length > 2) {
			socket.emit('gameCard', { card: this.card });
		} else {
			socket.emit('waiting');
		}
		
		attachSocketEvents(socket);
	};
	
	this.isFull = function () {
		return (player.length === Game.MAX_PLAYERS);
	}
	
	this.join(socket);
	
	function getRandomCard() {
		var rnd = Math.random() * 10;
		
		if (rnd <= 5) { /** 50% of the time we will use medium difficulty cards */
				var rnd = Math.floor(Math.random() * 24);
				
				return Game.Cards.med[rnd];
		} else if (rnd <= 8) { /** 30% of the time we will use easy cards */
				var rnd = Math.floor(Math.random() * 12);
				
				return Game.Cards.easy[rnd];
		} else { /** 20% of the time we will use hard cards */
				var rnd = Math.floor(Math.random() * 11);
				
				return Game.Cards.hard[rnd];
		}	
	}
	function startTimer() {
		timerStarted = true;
		setInterval(function () {
				timer--;
				if (timer > 0) {
					io.sockets.in(self.roomName).emit('timer', {time: timer});
				}
				else {
					self.card = getRandomCard();
					io.sockets.in(self.roomName).emit('newCard', {card: self.card});
					timer = 300;
				}
			}, 1000);
	}
		
	function removePlayer (index) { 
		if (index < player.length && index >= 0) {
			player.splice(index, 1);
			return true;
		}
		else return false;
	}
	
	function attachSocketEvents(socket) {
		
		socket.on('disconnect', function () {
			removePlayer(player.length - 1);
			socket.broadcast.to(self.roomName).emit('playerQuit', {numPlayers: player.length});
		});
		
		socket.on('submitExpression', function (data) {
			var res = validate(data.expression);
	
			if (res === 0) {
				var evaluated = Parser.evaluate(data.expression);
			
				socket.emit('evaluatedExpr', { evaluated: evaluated });
				if (evaluated === 24) {
					socket.emit('youWin');
					socket.broadcast.to(self.roomName).emit('youLose', {expression: data.expression});
					setTimeout(function () {
						timer = 300;
						self.card = getRandomCard();
						io.sockets.in(self.roomName).emit('newCard', {card: self.card});
					}, 6000);
				}
			} else if (res === -1) {
				socket.emit('invalidExpr', {msg: 'You must use all four digits shown.'});
			} else if (res === -2) {
				socket.emit('invalidExpr', {msg: "Legal operators are '+-*/()'."});
			}
		});
	}
	
	function validate(expr) {
		var temp = expr;
		
		for (var i = 0; i < self.card.length; i++) {
			var res = temp.search(self.card[i]);
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
};

Game.Cards = { easy: [], med: [], hard: [] };
Game.Cards.easy[0] = [1, 2, 6, 6];
Game.Cards.easy[1] = [2, 4, 8, 8];
Game.Cards.easy[2] = [1, 1, 4, 8];
Game.Cards.easy[3] = [1, 1, 5, 6];
Game.Cards.easy[4] = [3, 6, 6, 9];
Game.Cards.easy[5] = [3, 4, 5, 5];
Game.Cards.easy[6] = [1, 5, 5, 9];
Game.Cards.easy[7] = [4, 4, 8, 8];
Game.Cards.easy[8] = [1, 1, 4, 7];
Game.Cards.easy[9] = [5, 5, 7, 7];
Game.Cards.easy[10] = [1, 3, 3, 4];
Game.Cards.easy[11] = [4, 6, 6, 8];
Game.Cards.med[0] = [2, 4, 6, 7];
Game.Cards.med[1] = [2, 5, 6, 8];
Game.Cards.med[2] = [4, 5, 8, 9];
Game.Cards.med[3] = [1, 3, 4, 7];
Game.Cards.med[4] = [5, 6, 6, 8];
Game.Cards.med[5] = [1, 1, 6, 9];
Game.Cards.med[6] = [1, 6, 7, 9];
Game.Cards.med[7] = [2, 2, 7, 8];
Game.Cards.med[8] = [3, 8, 8, 9];
Game.Cards.med[9] = [2, 3, 4, 7];
Game.Cards.med[10] = [1, 3, 3, 7];
Game.Cards.med[11] = [4, 7, 8, 8];
Game.Cards.med[12] = [1, 4, 5, 7];
Game.Cards.med[13] = [1, 2, 4, 9];
Game.Cards.med[14] = [5, 6, 7, 8];
Game.Cards.med[15] = [1, 3, 6, 6];
Game.Cards.med[16] = [3, 3, 4, 5];
Game.Cards.med[17] = [2, 4, 4, 6];
Game.Cards.med[18] = [2, 3, 4, 5];
Game.Cards.med[19] = [2, 2, 6, 7];
Game.Cards.med[20] = [7, 8, 8, 9];
Game.Cards.med[21] = [2, 2, 4, 7];
Game.Cards.med[22] = [2, 6, 7, 8];
Game.Cards.med[23] = [4, 5, 6, 8];
Game.Cards.hard[0] = [4, 4, 7, 8];
Game.Cards.hard[1] = [2, 2, 6, 9];
Game.Cards.hard[2] = [2, 4, 7, 9];
Game.Cards.hard[3] = [2, 2, 5, 8];
Game.Cards.hard[4] = [2, 2, 3, 5];
Game.Cards.hard[5] = [1, 3, 8, 8];
Game.Cards.hard[6] = [2, 3, 5, 7];
Game.Cards.hard[7] = [2, 5, 5, 8];
Game.Cards.hard[8] = [3, 3, 6, 8];
Game.Cards.hard[9] = [2, 6, 8, 9];
Game.Cards.hard[10] = [3, 3, 5, 7];


Game.MAX_PLAYERS = 4;
Game.INITIAL_TIMER = 300;

module.exports = Game;
