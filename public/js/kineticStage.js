/** Color scheme, Auburn University Colors! */
var colors = {		
	primaryBlue: '#03244d', secondaryBlue: '#496e9c',
	primaryOrange: '#dd550c', secondaryOrange: '#f68026'
};

/** Precalculate width of KineticJS stage based on container width */
var containerWidth = $('#container').css('width');
containerWidth = containerWidth.substring(0, containerWidth.length - 2);
containerWidth = parseInt(containerWidth);

/** Create KineticJS Stage and store center point to use as an offset */
var stage = new Kinetic.Stage({
	container: 'container', width: containerWidth, height: 250
});
var stageCenter = { x: stage.getWidth()/2, y: stage.getHeight()/2 };

/** slashLayer drawn only once while activeLayer will be drawn often */
var splashLayer = new Kinetic.Layer();
var activeLayer = new Kinetic.Layer();

/** Get24 splash layer (title and overhead description) */
var titleText = new Kinetic.Text({
	fill: colors.primaryOrange, stroke: colors.primaryBlue,
	fontFamily: 'Impact', fontStyle: 'bold', fontSize: 48,
	shadowColor: 'black', shadowBlur: 10, shadowOffset: [0,7],
	shadowOpacity: 0.2, strokeWidth: 4,  text: 'Get24'
});
titleText.setX(stageCenter.x - titleText.getWidth()/2);
titleText.setY(titleText.getHeight() / 2);
var descText = new Kinetic.Text({
	x: stageCenter.x, y: 90,
	fill: colors.primaryBlue, fontFamily: 'Impact', fontSize: 16,
	text: 'The competitive real-time multiplayer math game'
});
descText.setX(stageCenter.x - descText.getWidth() / 2);

splashLayer.add(titleText);
splashLayer.add(descText);
stage.add(splashLayer);

/** Play button and help button, along with their events */
var playButton = new Kinetic.Group({
	x: stageCenter.x - 65, y: stageCenter.y + 40, fill: colors.primaryOrange
});
var playButtonRect = new Kinetic.Rect({
	x: -50, y: -20, width: 100, height: 40, strokeWidth: 4, cornerRadius: 10,
	fill: colors.primaryOrange, stroke: colors.primaryBlue
});
var playButtonText = new Kinetic.Text({
	x: -51, y: -10, width: 100, height: 40, align: 'center', text: 'PLAY',
	fill: colors.primaryBlue, fontFamily: 'Impact', fontSize: 20
});
playButton.on('mouseover', onMouseOverKineticButton);
playButton.on('mouseout', onMouseOutKineticButton);
playButton.on('click tap', connectSocket);

playButton.add(playButtonRect);
playButton.add(playButtonText);
activeLayer.add(playButton);

var helpButton = new Kinetic.Group({
	x: stageCenter.x + 65, y: stageCenter.y + 40
});
var helpButtonRect = new Kinetic.Rect({
	x: -50, y: -20, width: 100, height:40, fill: colors.primaryOrange,
	stroke: colors.primaryBlue,	strokeWidth: 4, cornerRadius: 10
});
var helpButtonText = new Kinetic.Text({
	align: 'center', x: -51, y: -10, width: 100, height: 40, text: 'HELP',
	fill: colors.primaryBlue, fontFamily: 'Impact', fontSize: 20
});

helpButton.add(helpButtonRect);
helpButton.add(helpButtonText);

helpButton.on('mouseover', onMouseOverKineticButton);
helpButton.on('mouseout', onMouseOutKineticButton);
helpButton.on('click tap', toggleHelpDialog);
activeLayer.add(helpButton);

/** Events for hovering over kinetic buttons */
function onMouseOverKineticButton() {
	this.children[0].setFill(colors.secondaryOrange);
	document.body.style.cursor = 'pointer';
	this.getLayer().draw();
}
function onMouseOutKineticButton() {
	this.children[0].setFill(colors.primaryOrange);
	document.body.style.cursor = 'auto';
	this.getLayer().draw();
}	

function removeButtons() {
	playButton.off('mouseover', onMouseOverKineticButton);
	playButton.off('mouseout', onMouseOutKineticButton);
	playButton.off('click tap', connectSocket);
	
	helpButton.off('mouseover', onMouseOverKineticButton);
	helpButton.off('mouseout', onMouseOutKineticButton);
	helpButton.off('click tap', toggleHelpDialog);
	
	playButton.remove();
	helpButton.remove();
	
	document.body.style.cursor = 'auto';
}

/** Pop-up help dialog when help button is pressed */
var helpDialog = new Kinetic.Group({
	x:10, y:10
});
var helpDialogRect = new Kinetic.Rect({
	width: stage.getWidth()-25, height: stage.getHeight()-40, cornerRadius: 10,
	fill: colors.primaryOrange, stroke: colors.primaryBlue, strokeWidth: 4
});
var helpDialogText = new Kinetic.Text({
	align: 'center', height: stage.getHeight()-40, width: stage.getWidth()-25,
	padding: 10, fontSize: 16, fill: colors.primaryBlue, fontFamily: 'Impact'
});
helpDialogText.setText('How to Play\n\nThe object of Get24 is to create ' +
	'a arithmetical expression, using the four digits shown and some' +
	' combination of the four basic arithmetical operators, which ' +
	'will evaluate to 24. The first player to do so wins.\n\n' +
	'Each of the four digits given must be used exactly once. ' +
	'Legal operators are  + - * / ()');
helpDialog.add(helpDialogRect);
helpDialog.add(helpDialogText);		
helpDialog.on('click tap', toggleHelpDialog);

function toggleHelpDialog() {
	if (typeof toggleHelpDialog.status === 'undefined')
		toggleHelpDialog.status = true;
	else
		toggleHelpDialog.status = !toggleHelpDialog.status;
	
	var layer = this.getLayer();
	
	if (toggleHelpDialog.status) layer.add(helpDialog);
	else helpDialog.remove();
	
	layer.draw();
}

/** Create game card text objects to hold each of our card digits */
var cardText = [];
var cardTextVisible = false;
for(var i = 0; i < 4; i++) {
	cardText[i] = new Kinetic.Text({
		x:-150, y:130, fontFamily: 'Impact', fontStyle: 'bold', 
		fontSize: 48, shadowColor: 'black', shadowOffset: [0,7],
		shadowOpacity: 0.2, fill: colors.primaryOrange, text: '0',
		stroke: colors.primaryBlue, strokeWidth: 4, visible: false
	});
	activeLayer.add(cardText[i]);
}
function animateCardText(cardVector) {
	for (var i = 0; i < cardText.length; i++) {
		cardText[i].setVisible(true);
		cardText[i].setText(cardVector[i]);
		cardText[i].transitionTo({
			x: stageCenter.x - 86 + (i*50), easing: 'ease-in', duration: 1.5
		});
	}
	cardTextVisible = true;
}
function fadeCardText(callback) {
	for (var i = 0; i < cardText.length; i++) {
		if (i < cardText.length - 1) {
			cardText[i].transitionTo({ 
				opacity: 0, duration: 1
			});
		} else {
			cardText[i].transitionTo({ 
				opacity: 0, duration: 1, callback: callback
			});
		}
	}
}
function resetCardText() {
	for (var i = 0; i < cardText.length; i++) {
		cardText[i].setVisible(false);
		cardText[i].setOpacity(1);
		cardText[i].setX(-150);
		activeLayer.draw();
	}
	cardTextVisible = false;
}

/** Main center message text, displays win/lose messages */
var mainMsg = new Kinetic.Text({
	x: stageCenter.x, y: 140, fill: colors.primaryOrange, 
	stroke: colors.primaryBlue, fontFamily: 'Impact', fontStyle: 'bold', 
	fontSize: 36, shadowColor: 'black', shadowBlur: 10, strokeWidth: 3,
	shadowOffset: [0,7], shadowOpacity: 0.2, opacity: 0
});
var mainMsgAnim = new Kinetic.Animation(function (frame) {
	mainMsg.setOpacity(Math.abs(Math.sin(frame.time / 1000)));
	activeLayer.draw();
}, activeLayer);
function showMainMessage(msg) {
	mainMsg.setText(msg);
	mainMsg.setX(stageCenter.x - mainMsg.getWidth() / 2);
	mainMsgAnim.start();
}
function stopMainMessage(callback) {
	mainMsgAnim.stop();
	mainMsg.transitionTo({
		opacity: 0, duration: 1, callback: callback
	});
}
activeLayer.add(mainMsg);

/** Number of players, and timer labels */
var playersText = new Kinetic.Text({
	x: stageCenter.x - 160, y: 220, fill: colors.primaryBlue,
	fontFamily: 'Impact', fontSize: 20, text: 'Players: ', visible: false
});
activeLayer.add(playersText);
var timerText = new Kinetic.Text({
	x: stageCenter.x + 74, y: 220, fill: colors.primaryBlue,
	fontFamily: 'Impact', fontSize: 20, text: 'Timer:', visible: false
});
activeLayer.add(timerText);

/** Evaluated expression label */
var evaluatedText = new Kinetic.Text({
	x: stageCenter.x, y: 222, fontFamily:'Impact', fontSize: 14, visible: false
});
function showEvaluatedText(txt, fill, blink, time) {
	evaluatedText.setText(txt);
	evaluatedText.setFill(fill);
	evaluatedText.setX(stageCenter.x - evaluatedText.getWidth() / 2);
	evaluatedText.setVisible(true);
	activeLayer.draw();
	
	var blinkInterval = undefined;
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
}
activeLayer.add(evaluatedText);

stage.add(activeLayer);
