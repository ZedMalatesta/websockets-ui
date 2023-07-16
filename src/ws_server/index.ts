import { Duplex, PassThrough } from 'stream';
import { WebSocketServer } from 'ws';
import { Player } from '../models/User.js';
import { SocketData } from '../types/SocketData.js';
import { parse } from 'path';
import { SpecifiedWebSocket } from '../types/SpecSocket.js'
import { randomBytes } from 'crypto'; 
import { WSDatabase } from '../db/db.js';
import { ServerController } from '../controller/controller.js'
import { WSServerResponce, WSServerResponceHandler } from '../types/WSServerResponce.js';
import { router } from '../router/router.js'

export const wss = new WebSocketServer({ port: 3000 });
const db = new WSDatabase();
const controller = new ServerController(db);

wss.on('connection', (ws: SpecifiedWebSocket) => {
  console.log(`new connection`)
  ws.id = randomBytes(20).toString('hex');
  console.log(ws.id)

  ws.on('message', async (rawdata:string) => {
    try{
      const parsed_data = await JSON.parse(rawdata);
      console.log(parsed_data, "data")
      if('type' in parsed_data){
        const result = await router(parsed_data as SocketData, ws.id, controller);
        console.log(result, "result")
        if(result.length>0) await handleResult(result);
      }
      else{
        throw new Error('Incorrect data!')
      }
    }
    catch(e: Error | unknown){
      console.log('Error: ' + e)
    }
  });

  ws.on('error', console.error);
  //ws.send('something');
});

async function handleResult(responces: Array<WSServerResponceHandler>) {
  for(let responce of responces){
    console.log("responce", responce)
    if(responce.type==='all'){
      for(let client of wss.clients){
        console.log('all', JSON.stringify(responce.data))
        client.send(JSON.stringify(responce.data))
      }
    }
    else{
      let client = [...wss.clients].find((elem)=> {
        let spec_elem = elem as SpecifiedWebSocket;
        return spec_elem.id===responce.connectionID ? true : false;
      })
      console.log('client', JSON.stringify(responce.data))
      client?.send(JSON.stringify(responce.data))
    }
  }
}