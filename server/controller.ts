import * as express from 'express';
import { broadcast } from './broadcast';

interface Message {
  content: string;
  time: string;
  username: string;
}

interface Rooms {
  [index: string]: Message[];
}

let rooms: Rooms = {};

function newMessage(req: express.Request, res: express.Response) {
  const content = req.body.message;
  const username = req.body.username; 
  const roomCode: string = req.body.roomCode;

  if (!(roomCode in rooms)) {
    rooms[roomCode] = []
  }
  rooms[roomCode].push({
    username: username,
    content: content,
    time : new Date().getTime().toString(),
  });

  res.send(rooms);
}

function index(req: express.Request, res: express.Response) {
  res.send('hello world');
}

export default {index, newMessage};