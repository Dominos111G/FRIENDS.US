const connectedUsers = {};

export function registerServerSocket(io){
  console.log('Registering server socket...');
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    connectedUsers[socket.id] = { socket };
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      delete connectedUsers[socket.id];
    });
  });

  return async function socketServerLoop() {
    console.log('Starting socket server loop...');
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let lastKnownLength = Object.keys(connectedUsers).length;
    while (true) {
      const currentLength = Object.keys(connectedUsers).length;
      if (lastKnownLength !== currentLength) { console.log('Connected users:', currentLength); lastKnownLength = currentLength; }
      await delay(1000);
    }
  };
}
