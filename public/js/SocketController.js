var SocketController = (function (window, io, undefined) {
	var socket;

    function log () {
        var args = Array.prototype.slice.call(arguments);
        args[0] = "SocketController.js:  " + args[0];
        console.log.apply(console, args);
    }

    return {

        submit: function (expression) {
            socket.emit('submitExpression', { expression: expression });
        },
        
        init: function (StageController) {
            socket = io.connect('/');

            socket.on('connected', function (data) {
                log('Socket connected');
                log('No. users connected to server: %d', data.numUsers);
            });

            socket.on('gameJoined', function (data) {
                log('Game room joined --> ' + data.room);
                log('No. players in the room: %d', data.numPlayers);
                StageController.initGame(data);
            });

            socket.on('playerJoined', function (data) {
                log('Player joined');
                log('No. players in the room: %d', data.numPlayers);
                StageController.updatePlayerCount(data.numPlayers);
            });

            socket.on('playerQuit', function (data) {
                log('Player quit');
                log('No. players in the room: %d', data.numPlayers);
                StageController.updatePlayerCount(data.numPlayers);
            });

            socket.on('overCapacity', function () {
                alert('Server currently at max capacity, try again soon!');
                log('Connection Refused --> At maximum capacity! : (');
            });
            
            socket.on('evaluatedExpr', function (data) {
                var value = data.evaluated;
                log('Expression evaluated --> %d', value);
                var color = value === 24 ? 'green' : 'red';
                StageController.showEvaluatedText(value.toString(), color);
            });
            
            socket.on('invalidExpr', function (data) {
                log('Invalid expression');
                StageController.showEvaluatedText(data.msg, '#dd0000');
            });
            
            socket.on('timer', function (data) {
                StageController.updateTimer(data.time);
            });
            
            socket.on('newCard', function (data) {
                log('New game card issued from server -- %o', data.card);
                StageController.showNewCard(data);
            });
            
            socket.on('youLose', function (data) {
                log('You lose, correct expression was: %s', data.expression);
                StageController.showLoss(data);
            });
            
            socket.on('youWin', function (data) {
                log('You win!');
                StageController.showWin(data);
            });
        }
    };

})(window, io);
