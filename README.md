Get24
===============
<p>
  Get24 is a competetive real-time multiplayer math game that I wrote for my game development course. Check out my <strong><a href='http://get24.jit.su/'>live server</a></strong>! The game was built using Ubuntu Linux using nothing but open source software and libaries. The game server uses the following technologies:
</p>

<ul>
 	<li>
	 	<strong> <a href='http://nodejs.org/'><strong>Node.JS</a></strong> 
	 	- Server-side javascript interpreter using Chrome's V8 Javascript engine.
 	</li>
 	<li>
 		<strong><a href='http://expressjs.com/'>Express 3</a></strong>
 		 - Popular web application framework similar to Sinatra for Node.JS
 	</li>
 	<li>
 		<strong><a href='http://socket.io/'>Socket.IO</a></strong>
 		 - Websocket API with fallbacks for realtime communications
 	</li>
 	<li>
 		<strong><a href='http://silentmatt.com/javascript-expression-evaluator/'>
 			Javascript Expression Evaluator
 		</a></strong>
 		 - An arithmetical expression evaluator/parser written in javascript
 	</li>
</ul>

<p>For the client, I am using the following open source libraries:</p>

<ul>
	<li>
  		<strong><a href='http://twitter.github.com/bootstrap/'>Twitter Bootstrap</a></strong>
  	 	- CSS framework
  	</li>
	<li>
	  	<strong><a href='http://jquery.com/'>jQuery 1.9</a></strong>
	  	 - Easy DOM manipulation/referencing.
	</li>
	<li><strong><a href='http://kineticjs.com/'>KineticJS</a></strong>
	 - HTML5 Canvas Graphics Library for simplified drawing, buffering, layering.
	</li>
</ul>

<p>
  All technologies used in the creation of this project are open source. 
</p>

<p>
	The game consists of multiple players being shown 4 digits (0-9) and are put on a timer. The first player that can craft an arithmetical expression using all four of the digits once and only once is the winner. Players may use the four basic arithemtical operators (along with parenthesis to force precedence) in their expressions (+ - * /) and may use them more than once.
</p>

<p>
	Here is a <strong><a href='http://youtu.be/gwTesvqwFWo'>
	video of testing being done on the game server</a></strong> during development.
</p>
