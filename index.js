const app = require('express')();
var bodyParser = require('body-parser')

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json())

server.listen(3000);