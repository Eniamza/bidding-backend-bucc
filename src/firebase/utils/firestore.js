const {admin} = require("../index")

const { getFirestore } = require('firebase-admin/firestore');

let db = getFirestore()

const playerRef = db.collection('players');
const teamRef = db.collection('teams');

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

let updateSinglePlayer = async function(playerInfo) { //Update only a single player


    try {

        let playerExists = playerRef.where("ign","==",playerInfo.ign)
        playerExists = await playerExists.get()
        
        if(!playerExists.empty) {
           throw "Player already exists"
   
        }

        const res = await db.collection('players').add(playerInfo);

        return res.id 
          


        
    } catch (error) {

        return error
        
    }

}

let getAllTeams = async function(lastDocID) { //only fetch the first ten players , //returns snapshot and last document

    let allTeams = teamRef.limit(20) //Limit to first 10 and order by base price

    if(lastDocID){
        let doc = await teamRef.doc(lastDocID).get();
        allTeams = allTeams.startAfter(doc)
    }
    const snapshot = await allTeams.get()

    
    let teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let lastReturnedDoc = snapshot.docs[snapshot.docs.length-1].id

    console.log({teams,lastReturnedDoc})
    return {teams,lastReturnedDoc}
    
}

module.exports = {getAllPlayers,getSinglePlayer,updateSinglePlayer,getAllTeams}