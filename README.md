Get24
===============
<p>
  A real-time competitive multiplayer math game written in JavaScript from back to front. I use a server stack consisting of the following:
</p>

<ul>
  <li><strong><a href='http://nodejs.org'>Node.JS</a></strong> - Server-side javascript interpreter using Chrome's V8 Javascript engine.</li>
  <li><strong><a href='http://expressjs.com'>Express 3</a></strong> - Popular web application framework similar to Sinatra for Node.JS</li>
  <li><strong><a href='http://socket.io'>Socket.IO</a></strong> - Websocket API with fallbacks for realtime communications</li>
</ul>

<p>
  On the client side I am using the following technologies:
</p>

<ul>
  <li><strong><a href='http://jquery.com'>jQuery 1.9</a></strong> - Easy DOM manipulation/referencing.</li>
  <li><strong><a href='http://kineticjs.com'>KineticJS</a></strong> - HTML5 Canvas Graphics Library for simplified drawing, buffering, layering.</li>
</ul>

<p>
  All technologies used are open source. 
</p>

<p>
  The game consists of multiple players being shown 4 digits (0-9) and are put on a timer. The first player that can craft an arithmetical expression using all four of the digits once and only once is the winner. Players may use the four basic arithemtical operators (along with parenthesis to force precedence) in their expressions (+ - * /) and may use them more than once.
</p>
