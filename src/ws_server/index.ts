import { WebSocketServer } from 'ws';

export const wss = new WebSocketServer({ port: 3000 });

console.log("run server ws");

wss.on('connection', function connection(ws) {
  console.log(`new connection ${JSON.stringify(ws)}`)
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});