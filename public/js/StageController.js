var StageController = (function (window, document, SocketController, undefined) {
	'use strict';

	/** Non-Stage elements */
	var evalForm = document.getElementById('eval-form');
	var evalInput = document.getElementById('eval-input');
	var submitButton = document.getElementById('submit-input');

	evalForm.addEventListener('submit', function (evt) {
		evt.preventDefault();
		var expression = evalInput.value;
		SocketController.submit(expression);
		evalInput.value = '';
	}, false);

	/** Color scheme, Auburn University Colors! */
	var colors = {
		primaryBlue: '#03244d', secondaryBlue: '#496e9c',
		primaryOrange: '#dd550c', secondaryOrange: '#f68026'
	};

	/** Create KineticJS Stage and store center point to use as an offset */
	var stage = new Kinetic.Stage({
		container: 'container', width: 350, height: 250
	});

	var stageCenter = {
		x: stage.getWidth() / 2,
		y: stage.getHeight() / 2
	};

	/** slashLayer drawn only once, while activeLayer will be drawn often */
	var splashLayer = new Kinetic.Layer();
	var activeLayer = new Kinetic.Layer();

	/** Get24 splash layer (title and overhead description) */
	var titleText = new Kinetic.Text({
		fill: colors.primaryOrange, stroke: colors.primaryBlue,
		fontStyle: 'bold', fontSize: 48,
		shadowColor: 'black', shadowBlur: 10, shadowOffset: [0,7],
		shadowOpacity: 0.2, strokeWidth: 2,  text: 'Get24'
	});
	titleText.setX(stageCenter.x - titleText.getWidth()/2);
	titleText.setY(titleText.getHeight() / 2);
	var descText = new Kinetic.Text({
		x: stageCenter.x, y: 90,
		fill: colors.primaryBlue, fontSize: 16, fontStyle: 'bold',
		text: 'The competitive real-time multiplayer math game'
	});
	descText.setX(stageCenter.x - descText.getWidth() / 2);

	splashLayer.add(titleText);
	splashLayer.add(descText);
	stage.add(splashLayer);

	/** Events for hovering over kinetic buttons */
	var onMouseOverKineticButton = function () {
		this.children[0].setFill(colors.secondaryOrange);
		document.body.style.cursor = 'pointer';
		activeLayer.draw();
	};
	var onMouseOutKineticButton = function () {
		this.children[0].setFill(colors.primaryOrange);
		document.body.style.cursor = 'auto';
		activeLayer.draw();
	};	

	/** Play button and help button, along with their events */
	var playButton = new Kinetic.Group({
		x: stageCenter.x - 115, y: stageCenter.y + 20,
		fill: colors.primaryOrange
	});
	var playButtonRect = new Kinetic.Rect({
		width: 100, height: 40, strokeWidth: 3, cornerRadius: 10,
		fill: colors.primaryOrange, stroke: colors.primaryBlue
	});
	var playButtonText = new Kinetic.Text({
		y: 7, width: 100, height: 40, align: 'center', text: 'Play',
		fill: colors.primaryBlue, fontSize: 24, fontStyle: 'bold'
	});
	playButton.on('mouseover', onMouseOverKineticButton);
	playButton.on('mouseout', onMouseOutKineticButton);
	playButton.add(playButtonRect);
	playButton.add(playButtonText);
	activeLayer.add(playButton);

	/** Pop-up help dialog when help button is pressed */
	var helpDialog = new Kinetic.Group({
		x:10, y:10
	});
	helpDialog.status = false;
	helpDialog.toggle = function () {
		helpDialog.status = !helpDialog.status;
		if (helpDialog.status) layer.add(helpDialog);
		else helpDialog.remove();
		activeLayer.draw();
	};

	var helpDialogRect = new Kinetic.Rect({
		width: stage.getWidth()-25, height: stage.getHeight()-40,
		cornerRadius: 10, fill: colors.primaryOrange,
		stroke: colors.primaryBlue, strokeWidth: 4
	});
	var helpDialogText = new Kinetic.Text({
		align: 'center', height: stage.getHeight()-40,
		width: stage.getWidth()-25,padding: 10, fontSize: 20,
		fill: colors.primaryBlue
	});
	helpDialogText.setText('How to Play\n\nThe object of Get24 is to create ' +
		'a arithmetical expression, using the four digits shown and some' +
		' combination of the four basic arithmetical operators, which ' +
		'will evaluate to 24. The first player to do so wins.\n\n' +
		'Each of the four digits given must be used exactly once. ' +
		'Legal operators are  + - * / ()');
	helpDialog.add(helpDialogRect);
	helpDialog.add(helpDialogText);		
	helpDialog.on('click tap', function () { helpDialog.toggle(); });


	var helpButton = new Kinetic.Group({
		x: stageCenter.x + 15, y: stageCenter.y + 20
	});
	var helpButtonRect = new Kinetic.Rect({
		width: 100, height:40, fill: colors.primaryOrange,
		stroke: colors.primaryBlue,	strokeWidth: 3, cornerRadius: 10
	});
	var helpButtonText = new Kinetic.Text({
		y: 7, width: 100, align: 'center', height: 40, text: 'Help',
		fill: colors.primaryBlue, fontSize: 24, fontStyle: 'bold'
	});

	helpButton.add(helpButtonRect);
	helpButton.add(helpButtonText);

	helpButton.on('mouseover', onMouseOverKineticButton);
	helpButton.on('mouseout', onMouseOutKineticButton);
	helpButton.on('click tap', function () { helpDialog.toggle(); });
	activeLayer.add(helpButton);

	/** Create game card text objects to hold each of our card digits */
	var cardText = [];
	var cardTextVisible = false;
	for(var i = 0; i < 4; i++) {
		cardText[i] = new Kinetic.Text({
			x: -150, y: 130, fontStyle: 'bold', 
			fontSize: 48, shadowColor: 'black', shadowOffset: [0,7],
			shadowOpacity: 0.2, fill: colors.primaryOrange, text: '0',
			stroke: colors.primaryBlue, strokeWidth: 2, visible: false
		});
		activeLayer.add(cardText[i]);
	}

	/** Main center message text, displays win/lose messages */
	var mainMsg = new Kinetic.Text({
		x: stageCenter.x, y: 140, fill: colors.primaryOrange, 
		stroke: colors.primaryBlue, fontStyle: 'bold', 
		fontSize: 48, shadowColor: 'black', shadowBlur: 10, strokeWidth: 2,
		shadowOffset: [0,7], shadowOpacity: 0.2, opacity: 0
	});
	var mainMsgAnim = new Kinetic.Animation(function (frame) {
		mainMsg.setOpacity(Math.abs(Math.sin(frame.time / 1000)));
		activeLayer.draw();
	}, activeLayer);
	activeLayer.add(mainMsg);

	/** Number of players, and timer labels */
	var playersText = new Kinetic.Text({
		x: stageCenter.x - 160, y: 220, fill: colors.primaryBlue,
		fontSize: 20, fontStyle: 'bold', text: 'Players: ', visible: false
	});
	activeLayer.add(playersText);
	var timerText = new Kinetic.Text({
		x: stageCenter.x + 74, y: 220, fill: colors.primaryBlue,
		fontSize: 20, fontStyle: 'bold', text: 'Timer:', visible: false
	});
	activeLayer.add(timerText);

	/** Evaluated expression label */
	var evaluatedText = new Kinetic.Text({
		x: stageCenter.x, y: 222, fontSize: 14,
		fontStyle: 'bold', visible: false
	});
	activeLayer.add(evaluatedText);

	stage.add(activeLayer);

	var animateCardText = function (cardVector) {
		for (var i = 0; i < cardText.length; i++) {
			var targetX = (stageCenter.x - 86) + (i * 50);
			cardText[i].setVisible(true);
			cardText[i].setText(cardVector[i]);
			var tween = new Kinetic.Tween({ 
				node: cardText[i],
				duration: 1.5,
				easing: Kinetic.Easings.EaseIn,
				x: targetX
			});
			tween.play();
		}
		cardTextVisible = true;
		activeLayer.draw();
	};

	var fadeCardText = function (callback) {
		for (var i = 0; i < cardText.length; i++) {
			var tween = new Kinetic.Tween({
				node: cardText[i],
				duration: 1,
				opacity: 0,
				onFinish: i === cardText.length - 1 ? callback : undefined
			});
			tween.play();
		}
	};
		
	var resetCardText = function () {
		for (var i = 0; i < cardText.length; i++) {
			cardText[i].setVisible(false);
			cardText[i].setOpacity(1);
			cardText[i].setX(-150);
			activeLayer.draw();
		}
		cardTextVisible = false;
	};

	var showMainMessage = function (msg, callback) {
		mainMsg.setText(msg);
		mainMsg.setX(stageCenter.x - mainMsg.getWidth() / 2);
		mainMsgAnim.start();
		setTimeout(function () {
			mainMsgAnim.stop();
			var tween = new Kinetic.Tween({
				node: mainMsg,
				opacity: 0,
				duration: 1,
				onFinish: callback
			});
			tween.play();
		}, 5000);
	};

	/** StageController export */
	var controller = {

		initGame: function (data) {
			playButton.remove();
			helpButton.remove();
			
			document.body.style.cursor = 'auto';

			timerText.setVisible(true);
			playersText.setVisible(true);

			evalInput.disabled = false;
			submitButton.disabled = false;

			animateCardText(data.card);

			this.updatePlayerCount(data.numPlayers);
		},

		showEvaluatedText: function (txt, fill, blink, time) {
			evaluatedText.setText(txt);
			evaluatedText.setFill(fill);
			evaluatedText.setX(stageCenter.x - evaluatedText.getWidth() / 2);
			evaluatedText.setVisible(true);
			activeLayer.draw();
			
			var blinkInterval;
			var willBlink = blink || true;
			
			setTimeout(function () {
				if (willBlink) clearInterval(blinkInterval);
				evaluatedText.setVisible(false);
				evaluatedText.setText('');
				activeLayer.draw();
			}, time || 2000);
			if (willBlink) blinkInterval = setInterval(function () {
				evaluatedText.setVisible(!evaluatedText.getVisible());
				activeLayer.draw();
			}, 300);
		},

		updatePlayerCount: function (count) {
			playersText.setText("Players: " + count);
			activeLayer.draw();
		},

		updateTimer: function (value) {
			timerText.setText("Timer: " + value);
			activeLayer.draw();
		},

		showLoss: function (data) {
			this.showEvaluatedText(data.expression, '#dd0000', false, 5000);
            fadeCardText(function () {
                showMainMessage('Sorry, you lose!', function () {
                    resetCardText();
                    animateCardText(data.card);
                });
            });
        },

        showWin: function (data) {
			fadeCardText(function () {
				showMainMessage('You win!', function () {
					resetCardText();
					animateCardText(data.card);
				});
			});
        },

        showNewCard: function (data) {
            if (!cardTextVisible) animateCardText(data.card);
            else {
                fadeCardText(function () {
                    resetCardText();
                    animateCardText(data.card);
                });
            }
        }

	};

	/** Inject StageController dependency into SocketController so event
        handlers can be hooked up to handle messages on the socket */
	playButton.on('click tap', function () {
		SocketController.init(controller);
	});

	return controller;

})(window, document, SocketController);
