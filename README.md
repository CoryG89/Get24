# Get24

Get24 is a competetive real-time multiplayer math game that I wrote for a 
Spring 2013 semester project for a game development course at Auburn University. 
Check out my [**live web app**][1] running currently on a cloud instance from my
good friends at [**Nodejitsu**][2]!

## Components

Get24 was built using Ubuntu Linux using nothing but open source software and 
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

All technologies used in the creation of this project are open source.

## Description

The game consists of multiple players being shown four digits `(0-9)` and are 
put on a timer. The first player that can craft an arithmetical expression using
all four of the digits once and only once is the winner. Players may use the
four basic arithemtical operators (along with parenthesis to force precedence)
in their expressions `(+ - * /)` and may use them more than once.

Here is a [**YouTube video**][10] of testing being done on the server and game
client during development.

## Build

To build my project either download the compressed project or clone it with git:

    #   git clone http://github.com/CoryG89/Get24/

You'll need to have Node.JS and it's package manager NPM installed in order to
build the server. If you have Node installed, run the following commands to
install its dependencies and start the server.

    #   npm install -d</pre>
    #   node app.js</pre>

The server runs on port 3001 by default so you may access it in your browser by
pointing it to the loopback address via the hostname 'localhost' like so:
    
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