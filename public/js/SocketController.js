var SocketController = (function (window, io, undefined) {
	var socket;

    return {
        emit: function (msg, data) {
            socket.emit(msg, data);
        },
        init: function (StageController) {
            socket = io.connect('/');

            socket.on('connected', function (data) {
                console.log('Socket connected.');
                console.log('No. users connected to server: %d', data.numUsers);
            });

            socket.on('gameJoined', function (data) {
                console.log('Game room joined --> ' + data.room);
                console.log('No. players in the room: %d', data.numPlayers);
                StageController.initGame(data);
            });

            socket.on('playerJoined', function (data) {
                console.log('Player joined');
                console.log('No. players in the room: %d', data.numPlayers);
                StageController.updatePlayerCount(data.numPlayers);
            });

            socket.on('playerQuit', function (data) {
                console.log('Player quit');
                console.log('No. players in the room: %d', data.numPlayers);
                StageController.updatePlayerCount(data.numPlayers);
            });

            socket.on('overCapacity', function () {
                alert('Server currently at max capacity, try again soon!');
                console.log('Connection Refused --> At maximum capacity! : (');
            });
            
            socket.on('evaluatedExpr', function (data) {
                var val = data.evaluated;
                var color = val === 24 ? 'green' : 'red';
                StageController.showEvaluatedText(val.toString(), color);
            });
            
            socket.on('invalidExpr', function (data) {
                console.log('invalidExpr');
                StageController.showEvaluatedText(data.msg, '#dd0000');
            });
            
            socket.on('timer', function (data) {
                StageController.updateTimer(data.time);
            });
            
            socket.on('newCard', function (data) {
                StageController.showNewCard(data);
            });
            
            socket.on('youLose', function (data) {
                var expr = data.expression;
                console.log('You lose, correct expression was: %s', expr);
                StageController.showLoss(data);
            });
            
            socket.on('youWin', function (data) {
                console.log('You win!');
                StageController.showWin(data);
            });

        }
    };

})(window, io);
