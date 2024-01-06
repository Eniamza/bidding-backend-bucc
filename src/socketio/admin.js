const {admin} = require("../firebase/index")

const {startBidPlayer,replytoBidStart} = require("../auction/livebiddingSinglePlayer")

module.exports = async function (io,socket) {

    decoded = await admin.auth().verifyIdToken(socket.handshake.headers.idtoken,true)
    socket.uid = decoded.uid

    console.log(socket.uid)
    console.log("New Admin connected:",socket.id);

    socket.on("bidStart", async (message)=>{

        try {

            if(!message){
                return socket.emit("error","Please pass the playerID and auctionID")
            }
    
            message = JSON.parse(message)
    
            let playerID = message.playerID
            let auctionID = message.auctionID
            let resBidStart = await startBidPlayer(playerID,auctionID)
            console.log(resBidStart)
    
            if(!resBidStart){
                socket.emit("error","Oops, Either the bid is running or an error has occured, Check the logs!")
                socket.emit("currentBid",await replytoBidStart())
                return
            }
    
            io.emit("bidStarted",resBidStart)
            
        } catch (error) {

            console.log(error)
            return socket.emit("error", "The request was malformed, Please check the logs for more info")
            
        }

    })



}