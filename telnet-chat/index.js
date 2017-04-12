const net = require('net');
const uuid = require('uuid/v4');
const PORT = 8080;
const HOST = '127.0.0.1';
const server = net.createServer();
const sockets = {};

server.listen(PORT, HOST);

/*
  Iterate over sockets and publish to everyone but the sender
*/
const publish = (id, message) => {
  for (let sid in sockets) {
    console.log()
    if (id !== sid) {
      sockets[sid].write(`${id}: ${message}`);
    }
  };
}

/*
  We assign a uuid as a username, publish that a new user joined the room,
  and let the user know what their username is
*/
const initSession = (socket) => {
  const id = uuid();
  sockets[id] = socket;
  socket.write(`You are ${id}` + '\n')
  publish(id, 'Joined the room\n');
  return id;
}

server.on('connection', (socket) => {
  const id = initSession(socket);

  socket.on('data', (data) => {
    publish(id, data.toString())
  });

  socket.on('close', () => {
    delete sockets[id];
    publish(id, 'Left the room\n');
  });

  socket.on('error', (e) => {
    console.log(e);
  });
})