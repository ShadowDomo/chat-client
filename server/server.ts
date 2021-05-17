/* Entry point into server. */

import { Socket } from 'socket.io';
import router from './routes';
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 6969;

const app = express();

// SOCKETS
const httpServer = require('http').createServer(app);
const io: Socket = require('socket.io')(httpServer, {
  cors: {
    origin: [
      'http://syndeyforum-env.eba-f4xyppqy.ap-southeast-2.elasticbeanstalk.com/',
      'http://localhost:3000',
      'http://domz.me',
    ], // TODO not hardcoded!!!
    methods: ['GET', 'POST'],
  },
});


function socketHandler(socket: Socket) {
  console.log("hi");
  
  socket.on('gay', ()=> {
    console.log('gayy');
  })
  let room = '';
  let username = '';

  socket.on('joinRoom', (obj)=> {
    console.log('joined room ')
    room = obj.roomCode;
    console.log(room)
    socket.join(obj.roomCode);
    username = obj.username;
    io.to(obj.roomCode).emit('joinedRoom', {
      username: obj.username,
      time: new Date().getTime().toString(),
    });
  })

  socket.on('message', (obj) => {
    io.to(room).emit('typingEnded', {username: obj.username});
    io.to(room).emit('message', {
      ...obj,
      time: new Date().getTime().toString(),
    });
  })

  let timer: any;
  socket.on('typing', (obj) => {
    if (timer !== undefined) clearTimeout(timer)
    io.to(room).emit('typingStarted', obj);
    timer = setTimeout(()=> {
        io.to(room).emit('typingEnded', obj);
    }, 3000)
  });

  socket.on('disconnect', ()=>{
    io.to(room).emit('disconnected', {
      username: username,
      time: new Date().getTime().toString(),
    });
  });
}


// handles sockets
io.on('connection', socketHandler);

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api', router);
// app.set('io', io);


httpServer.listen(PORT, () => {
  console.log('sockets and server are listening on ' + PORT);
});
