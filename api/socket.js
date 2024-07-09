const socketIO = require('socket.io');
const SOCKET_PORT = 4001;

function initSocket(server, logger){
  server.listen(SOCKET_PORT, () => {
    console.log(`Socket.io server listening on port ${SOCKET_PORT}`);
  });
  
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('The client connected');
    
    socket.on('clear-logs', () => {
      console.log('Logs cleaned');
      logger.clearLogs();
    });
    
    socket.on('receive-all-logs', () => {
      const allLogs = logger.getLogs();
      io.emit('all-logs-receive', allLogs.split('\n\n'));
    });
    
    socket.on('disconnect', () => {
      console.log('The client disconnected');
    });
  });
  
  return io;
}

module.exports = initSocket;
