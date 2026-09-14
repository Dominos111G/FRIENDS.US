let socket = null;

export function initSocket() {
  if (!socket) {
    socket = io('http://localhost:3000'); 

    socket.on('connect', () => {
      console.log('Connected to server with socket ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  return socket;
}

export function getSocket() {
  if (!socket) {
    throw new Error("Socket does not exist!");
  }
  return socket;
}
