const app = require('express')();
var bodyParser = require('body-parser')

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {player} = require("./src/api/playerRoutes")
const {team} = require("./src/api/teamRoutes")
const {auction} = require("./src/api/auctionRoutes")

app.use(bodyParser.json())
app.use('/api/player',player)
app.use('/api/team',team)
app.use('/api/auction',auction)

server.listen(3000);