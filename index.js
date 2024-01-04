const app = require('express')();
var bodyParser = require('body-parser')
const { isValidAdmin,isValidManager } = require("./src/firebase/utils/fireuser");

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {player} = require("./src/api/playerRoutes")
const {team} = require("./src/api/teamRoutes")
const {auction} = require("./src/api/auctionRoutes")

const adminio = require("./src/socketio/admin");
const { createDiffieHellmanGroup } = require('crypto');
 
app.use(bodyParser.json())
app.use('/api/player',player)
app.use('/api/team',team)
app.use('/api/auction',auction)

io.on('connection', async (socket) => {

    console.log("New client connected:",socket.id);
    

    try {

        console.log(socket.handshake.headers.idtoken)


        if ( await isValidAdmin(socket.handshake.headers.idtoken) === true){
            await adminio(io,socket)
        }
    
        else if ( await isValidManager(socket.handshake.headers.idtoken) === true){
            console.log("New Manager Connected")
        }
    
        else {
            console.log("New Audience Connected")
        }
        
    } catch (error) {
        
        console.log(error)
    }



 
});

server.listen(3000);