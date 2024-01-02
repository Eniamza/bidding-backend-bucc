const app = require('express')();
var bodyParser = require('body-parser')

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const route = require("./src/api/playerRoutes")

app.use(bodyParser.json())
app.use('/api/player',route.player)

server.listen(3000);