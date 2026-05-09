const app = require('./app');
const setupWebSocket = require('./websocket/chatWebSocket');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupWebSocket(server);

server.on('error', (error) => {
  console.error('Server failed to start:', error.message);
  process.exit(1);
});
