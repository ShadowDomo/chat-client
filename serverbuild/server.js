"use strict";
/* Entry point into server. */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var routes_1 = require("./routes");
var express = require('express');
var cors = require('cors');
var PORT = process.env.PORT || 6969;
var app = express();
// SOCKETS
var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: [
            'http://syndeyforum-env.eba-f4xyppqy.ap-southeast-2.elasticbeanstalk.com/',
            'http://localhost:3000',
            'http://192.168.1.107',
        ],
        methods: ['GET', 'POST']
    }
});
function socketHandler(socket) {
    console.log("hi");
    socket.on('gay', function () {
        console.log('gayy');
    });
    var room = '';
    var username = '';
    socket.on('joinRoom', function (obj) {
        console.log('joined room ');
        room = obj.roomCode;
        console.log(room);
        socket.join(obj.roomCode);
        username = obj.username;
        io.to(obj.roomCode).emit('joinedRoom', {
            username: obj.username,
            time: new Date().getTime().toString()
        });
    });
    socket.on('message', function (obj) {
        io.to(room).emit('typingEnded', { username: obj.username });
        io.to(room).emit('message', __assign(__assign({}, obj), { time: new Date().getTime().toString() }));
    });
    var timer;
    socket.on('typing', function (obj) {
        if (timer !== undefined)
            clearTimeout(timer);
        io.to(room).emit('typingStarted', obj);
        timer = setTimeout(function () {
            io.to(room).emit('typingEnded', obj);
        }, 3000);
    });
    socket.on('disconnect', function () {
        io.to(room).emit('disconnected', {
            username: username,
            time: new Date().getTime().toString()
        });
    });
}
// handles sockets
io.on('connection', socketHandler);
// Middleware
app.use(express.json());
app.use(cors());
app.use('/api', routes_1["default"]);
// app.set('io', io);
httpServer.listen(PORT, function () {
    console.log('sockets and server are listening on ' + PORT);
});
