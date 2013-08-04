# Get24

Get24 is a competetive real-time multiplayer math game that I wrote for a 
Spring 2013 semester project for a game development course at Auburn University. 
Check out the [**live demo**][1] running currently on a cloud instance from my
good friends at [**Nodejitsu**][2]!

## Components

Get24 was built on Ubuntu Linux with nothing but open source software and 
libaries. The game server was built with the following technologies:

* [**Node.JS**][3]
    - Server-side javascript interpreter using Chrome's V8 Javascript engine.
* [**Express 3**][4]
    - Popular web application framework for Node.JS similar to Sinatra
* [**Socket.IO**][5]
    - Websocket API with fallbacks for realtime communications
* [**Javascript Expression Evaluator**][6] - (node-expression-eval npm pkg)
    - An arithmetical expression evaluator/parser written in JavaScript.

For the client, I am using the following open source libraries:

* [**jQuery**][7]
    - Easy DOM manipulation/referencing
* [**Twitter Bootstrap**][8]
    - Popular CSS Framework from Developers at Twitter
* [**KineticJS**][9]
    - HTML5 Canvas Graphics Library for simplified drawing, buffering, layering.

## Description

The game consists of multiple players being shown the same set of four digits
`(0-9)` and are put on a timer. The first player that can craft an arithmetical
expression using all four of the digits once and only once is the winner.
Players may use the four basic arithemtical operators (along with parenthesis
to force precedence) in their expressions `(+ - * /)` and may use them more
than once.

Here is a [**YouTube video**][10] of testing being done on the server and game
client during development.

## Build

In order to build the project, you'll need to have both [**Git**][11] and 
[**Node.JS**][3] installed.

Clone the GitHub repository with the following:

    $   git clone git://github.com/CoryG89/Get24/

Run the following commands to install dependencies and start the server.

    $   npm install
    $   node app.js

The server runs on port 3001 by default so you may access it in your browser by
pointing it to the loopback address via the hostname 'localhost' via:
    
	http://localhost:3001/

[1]: http://get24.jit.su/
[2]: http://nodejitsu.com/
[3]: http://nodejs.org/
[4]: http://expressjs.com/
[5]: http://socket.io/
[6]: http://silentmatt.com/javascript-expression-evaluator/
[7]: http://jquery.com/
[8]: http://twitter.github.com/bootstrap/
[9]: http://kineticjs.com/
[10]: http://youtu.be/gwTesvqwFWo
[11]: http://git-scm.org