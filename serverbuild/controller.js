"use strict";
exports.__esModule = true;
var rooms = {};
function newMessage(req, res) {
    var content = req.body.message;
    var username = req.body.username;
    var roomCode = req.body.roomCode;
    if (!(roomCode in rooms)) {
        rooms[roomCode] = [];
    }
    rooms[roomCode].push({
        username: username,
        content: content,
        time: new Date().getTime().toString()
    });
    res.send(rooms);
}
function index(req, res) {
    res.send('hello world');
}
exports["default"] = { index: index, newMessage: newMessage };
