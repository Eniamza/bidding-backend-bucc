const {admin} = require("../index")

const { getFirestore } = require('firebase-admin/firestore');

let db = getFirestore()

const playerRef = db.collection('players');

let getAllPlayers = async function(lastDocID) { //only fetch the first ten players , //returns snapshot and last document

    let allPlayers = playerRef.orderBy("basePrice",'desc').limit(10) //Limit to first 10 and order by base price

    if(lastDocID){
        let doc = await playerRef.doc(lastDocID).get();
        allPlayers = allPlayers.startAfter(doc)
    }
    const snapshot = await allPlayers.get()
    
    
    let players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let lastReturnedDoc = snapshot.docs[snapshot.docs.length-1].id

    console.log({players,lastReturnedDoc})
    return {players,lastReturnedDoc}
    
}

let getSinglePlayer = async function(ign){ //Search Player by IGN

    try {
        
        let singlePlayer = playerRef.where('ign', '==', ign);
        let playerInfo = await singlePlayer.get()
        playerInfo = playerInfo.docs.map(doc => ({id:doc.id, ...doc.data()}))

        if(playerInfo.length === 0){
            throw null
        }

        return playerInfo

    } catch (error) {
        return error
    }


}

module.exports = {getAllPlayers,getSinglePlayer}