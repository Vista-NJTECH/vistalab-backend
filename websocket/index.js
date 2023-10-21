const { WebSocketServer, WebSocket } = require('ws');

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocketServer({ port: 8183 });
var onlineNumber = 0

wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  onlineNumber++
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(onlineNumber);
    }
  });
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(onlineNumber);
      }
    });
  });

  ws.on('close', function message(data, isBinary) {
    onlineNumber--
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(onlineNumber);
      }
    });
  });

});
  

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});