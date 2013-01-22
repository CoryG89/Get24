Get24
===============

A real-time competitive multiplayer math game written in JavaScript from back to front. I use a server stack consisting of the following:
<ul>
  <li><strong>Node.JS</strong> - Server-side javascript interpreter using Chrome's V8 Javascript engine.</li>
  <li>Express 3 - Popular web application framework similar to Sinatra for Node.JS</li>
  <li>Socket.IO - Websocket API with fallbacks for realtime communications</li>

On the client side I am using the following technologies:

-jQuery 1.9 - Easy DOM manipulation/referencing.
-KineticJS - HTML5 Canvas Graphics Library for simplified drawing, buffering, layering.

All technologies used are open source. 

The game consists of multiple players being shown 4 digits (0-9) and are put on a timer. The first player that can craft an arithmetical expression using all four of the digits once and only once is the winner. Players may use the four basic arithemtical operators (along with parenthesis to force precedence) in their expressions (+ - * /) and may use them more than once.
