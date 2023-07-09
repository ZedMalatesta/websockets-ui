import { Duplex } from 'stream';
import { WebSocketServer } from 'ws';
import { parseRequest } from '../helpers/parser.js'
import { json } from 'stream/consumers';
import { StringDecoder } from 'string_decoder';
import { Buffer } from 'buffer';

export const wss = new WebSocketServer({ port: 3000 });

console.log("run server ws");
 

wss.on('connection', (ws) => {
  console.log(`new connection`)
  ws.on('error', console.error);

  ws.on('message', (rawdata:string) => {
    console.log(JSON.parse(rawdata))
  });

  ws.send('something');
});