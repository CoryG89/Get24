/**
 * client.js
 *
 * Author: Cory Gross (cmg0030@tigermail.auburn.edu)
 * Server-side representation of a client connected to a Socket.IO application.
 */
 var Client = function (socket, id) {
 	this.socket = socket;
 	this.id = id;
 };
 
 module.exports = Client;

