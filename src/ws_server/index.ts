import { Duplex } from 'stream';
import { WebSocketServer } from 'ws';
import { parseRequest } from '../helpers/parser.js'
import { json } from 'stream/consumers';
import { StringDecoder } from 'string_decoder';
import { Buffer } from 'buffer';
import { Player } from '../models/User.js';

export const wss = new WebSocketServer({ port: 3000 });

console.log("run server ws");
 

wss.on('connection', (ws) => {
  console.log(`new connection`)
  ws.on('error', console.error);

  ws.on('message', (rawdata:string) => {
    console.log(JSON.parse(rawdata))
    console.log("retest")
    ws.send(JSON.stringify({
      type: "reg",
      data:
      JSON.stringify({
              name: '',
              index: 2,
              error: "",
              errorText: "",
          }),
      id: 0
    }))
    ws.send(JSON.stringify({
      type: "update_winners",
      data:
      JSON.stringify([
              {
                  name: 'name',
                  wins: 'wins'
              }
          ]),
      id: 0
  }))
  });
  //ws.send('something');
});