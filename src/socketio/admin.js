const {admin} = require("../firebase/index")

module.exports = async function (io,socket) {

    decoded = await admin.auth().verifyIdToken(socket.handshake.headers.idtoken,true)
    socket.uid = decoded.uid

    console.log(socket.uid)
    console.log("New Admin connected:",socket.id);

    socket.on("bidStart",async function(message) {

        console.log("bidStart",message)
        io.emit("bidStart",message)



    })

}