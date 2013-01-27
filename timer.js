/**
 * timer.js
 *
 * Author: Cory Gross (cmg0030@tigermail.auburn.edu)
 *
 * A simple callback timer which makes use of both intervals and timeouts in javascript.
 *
 * A multitude of timers can be configured using the options provided. The
 * example below starts at time 10, every 1000 ms the time will be decremented
 * by 1 and a callback will be called. In this example, tickCallback will be called
 * 9 times, followed by a single call to finalCallback in a loop lasting a total
 * of 1 s = 10,000 ms.
 *
 * Example:
 *
 *	new Timer({
 *		initialTime: 10,		// Number of ticks to reach 0
 *		resolution: 1000 		// Number of ms between eaach tick
 *		tickCallback: function() {
 *			console.log('Hello');	// This runs every 1000 ms
 *		},
 *		finalCallback: function () {
 *			console.log('Timer');   // This runs after time reaches 0
 *		},
 *		loop: true
 *	});
 *
 * Default config:
 *		
 *		time --> initialTime --> 0;
 *		resolution --> 1000;
 *		tickCallback --> undefined;
 *		finalCallback --> undefined;
 *		loop --> false;
 **/

function Timer (config) {

	/** Declare and initialize local variables */
	var time = undefined;
	var resolution = undefined;
	var initialTime = undefined;
	var timerInterval = undefined;
	var timerCallback = undefined;
	var intervalCallback = undefined;
	var loop = undefined;
	var timerStarted = false;
	
	/** Set configuration, fallback to default values */
	if (config) {
		timerCallback = config.finalCallback || undefined;
		intervalCallback = config.tickCallback || undefined;
		time = initialTime = config.initialTime || 0;
		resolution = config.resolution || 1000;
		loop = config.loop || false;
	}
	
	/** Functions of the timer */
	
	function tick () {
	 	if (--time > 0) {
			if (intervalCallback) intervalCallback(time);
		}
		else {
			if (timerCallback) timerCallback();
		
			if (loop) restartTimer(initialTime);
			else stopTimer();
		} 
	}		
	
	function startTimer (tickCallback, finalCallback) {
		if (!timerStarted) {
			timerStarted = true;
			if (tickCallback) intervalCallback = tickCallback;
			if (finalCallback) timerCallback = finalCallback;
			timerInterval = setInterval(tick, resolution);
		}
	}
	
	function stopTimer () {
		if (timerStarted) {
			clearInterval(timerInterval);
			timerStarted = false;
		}
	};
	
	function resetTimer (value) {
		if (timerStarted)	stopTimer();
		if (value) initialTime = value;
		time = initialTime;
	}
	
	function restartTimer (value) {
		resetTimer(value);
		startTimer()
	}
	
	/** Public attributes */
	this.setTime = function (newTime) { time = newTime; };
	this.getTime = function () { return time; };
	this.getInitialTime = function () { return initialTime; };
	
	this.start = startTimer;
	this.stop = stopTimer;
	this.reset = resetTimer;
	this.restart = restartTimer;
};

/** Export to Node.JS if we have no window obj */
module.exports = Timer;
