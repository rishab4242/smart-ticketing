require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketSetup = require('./sockets/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

socketSetup(server); // init socket.io

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
