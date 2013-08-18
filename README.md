Get24
=====
Get24 is a competetive real-time multiplayer math game that I wrote as a Spring
2013 semester project for a game development course at Auburn University. Check
out the [**live demo**][get24] running currently on a cloud instance from my
good friends at [**Nodejitsu**][nodejitsu]!

Dependencies
------------
Get24 was built on Ubuntu Linux using nothing but open source software and 
libaries. The back-end was developed in [**Node.JS**][nodejs] and has the
following dependencies:

* [**Express 3**][express]
    - Popular web application framework for Node.JS similar to Sinatra.
* [**Socket.IO**][socketio]
    - Websocket API for real-time networking, includes fallbacks to use Flash,
    long-polling, etc, if Websockets are not available.
* [**Javascript Expression Evaluator**][js-expr-eval]
    - Arithmetical expression evaluator/parser written in JavaScript.
* [**node-uuid**][node-uuid]
    - Node module for creating both random and time based UUIDs.

The client is a simple HTML web app which uses only the following:

* [**KineticJS**][kineticjs]
    - Framework for abstracting the HTML5 Canvas API. Offers simplified drawing,
    buffering, layering, grouping, animations, etc.

Concept
-------
Get24 is based on the [**24 Game**][24-game]. I enjoyed playing the card game
in my fifth grade classroom with my favorite grade school teacher. The card
game comes with a deck of cards each with four numbers on the face (1-9). There
are easy, medium, and difficult cards. The object of the game is for players
to attempt to manipulate the four numbers shown in an arithmetical expression
which evaluates to 24. The following image shows a sample card from the 24 game
which has a possible solution of `4*(4+1+1)`.

[![Sample 24 Game Card][24-game-card]][24-game]

Description
-----------
The game consists of multiple players being shown the same set of four digits
`(0-9)` and are put on a timer. The first player that can craft an arithmetical
expression using all four of the digits once and only once is the winner.
Players may use the four basic arithemtical operators (along with parenthesis
to force precedence) in their expressions `(+ - * /)` and may use some of them
more than once or not at all.

Here is a [**YouTube video**][demo-video] of testing being done on the server
and game client during development.

Build
-----
In order to build the project, you'll need to have both [**Git**][git] and 
[**Node.JS**][nodejs] installed.

Clone the GitHub repository with the following:

    $   git clone https://github.com/CoryG89/Get24

Change to the new repository directory, use `npm` to install the dependencies
and start the server.

    $   cd Get24
    $   npm install
    $   npm start

The server runs on port 3001 by default so you may access it in your browser by
pointing it to the loopback address via the hostname 'localhost' via:
    
	http://localhost:3001/

[get24]: http://get24.jit.su/
[nodejitsu]: http://nodejitsu.com/
[nodejs]: http://nodejs.org/
[express]: http://expressjs.com/
[socketio]: http://socket.io/
[js-expr-eval]: http://silentmatt.com/javascript-expression-evaluator/
[kineticjs]: http://kineticjs.com/
[demo-video]: http://youtu.be/gwTesvqwFWo
[git]: http://git-scm.org

[24-game]: https://en.wikipedia.org/wiki/24_Game
[24-game-card]: https://upload.wikimedia.org/wikipedia/en/2/23/Sample_24_card.jpg
