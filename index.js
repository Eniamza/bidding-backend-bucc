const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let baal = 0

io.of("/").adapter.on("join-room",(room,id)=>{
    io.emit("message",`${id} joined ${room}`)

})

io.on('connection', (socket) => { 

    console.log("New Connection:",socket.id)

});

server.listen(3000);