const {admin} = require("../index")

const { getFirestore } = require('firebase-admin/firestore');

let db = getFirestore()

const playerRef = db.collection('players');
const teamRef = db.collection('teams');
const auctionRef = db.collection('auctions');

let getAllPlayers = async function(lastDocID) { //only fetch the first ten players , //returns snapshot and last document

    let allPlayers = playerRef.orderBy("basePrice",'desc').limit(10) //Limit to first 10 and order by base price

    if(lastDocID){
        let doc = await playerRef.doc(lastDocID).get();
        allPlayers = allPlayers.startAfter(doc)
    }
    const snapshot = await allPlayers.get()
    
    
    let players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let lastReturnedDoc = snapshot.docs[snapshot.docs.length-1].id

    // console.log({players,lastReturnedDoc})
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

        // console.log(playerInfo)
        return playerInfo

    } catch (error) {
        return error
    }


}

let getSinglePlayerByID = async function(playerID){ //Search Player by ID

    try {
        
        let docRef = playerRef.doc(playerID)
        const doc = await docRef.get();
        if (!doc.exists) {
            throw null
        } else {
            // console.log(doc.data())
            return doc.data()
        }

    }catch (error) {
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

        if(playerInfo.id !== undefined){ //if ID exists, update the player instead of creating a new one

            let docRef = playerRef.doc(playerInfo.id)
            const doc = await docRef.get();
            if (!doc.exists) {
                throw null
            } else {
                const res = await docRef.update(playerInfo);
                return res.id
            }
            
        }

        const res = await db.collection('players').add(playerInfo);
        return res.id 
          


        
    } catch (error) {

        return error
        
    }

}

let getAllTeams = async function(lastDocID) { //only fetch the first ten players , //returns snapshot and last document

    let allTeams = teamRef//Limit to first 10 and order by base price

    if(lastDocID){
        let doc = await teamRef.doc(lastDocID).get();
        allTeams = allTeams.startAfter(doc)
    }
    const snapshot = await allTeams.get()

    
    let teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let lastReturnedDoc = snapshot.docs[snapshot.docs.length-1].id

    // console.log({teams,lastReturnedDoc})
    return {teams,lastReturnedDoc}
    
}

let getSingleTeam = async function(teamID){ //Search Player by IGN

    try {
        
        let docRef = teamRef.doc(teamID)
        const doc = await docRef.get();
        if (!doc.exists) {
            throw null
        } else {
            // console.log(doc.data())
            return doc.data()
        }

    } catch (error) {
        console.log(error)
        return error
    }
}

let updateSingleTeam = async function(teamInfo) { //Update only a single player


    try {

        let teamExists = teamRef.where("teamTitle","==",teamInfo.teamTitle)
        teamExists = await teamExists.get()

        if(teamInfo.id !== undefined){ //if ID exists, update the team instead of creating a new one
        
            let docRef = teamRef.doc(teamInfo.id)
            const doc = await docRef.get();
            if (!doc.exists) {
                throw null
            } else {
                const res = await docRef.update(teamInfo);
                return res.id
            }

        }
        if(!teamExists.empty) {
           throw "Team already exists"
   
        }

        let ManagerExists = teamRef.where("managerUID","==",teamInfo.managerUID)
        ManagerExists = await ManagerExists.get()

        if(!ManagerExists.empty) {
            throw "Manager already exists in another team."
    
         }

        const res = await auctionRef.add(teamInfo);

        return res.id
        
    } catch (error) {

        return error
        
    }

}

let getAllAuctions =  async function(lastDocID){

    let allAuctions = auctionRef.limit(20) //Limit to first 10 and order by base price

    if(lastDocID){
        let doc = await auctionRef.doc(lastDocID).get();
        allAuctions = allAuctions.startAfter(doc)
    }
    const snapshot = await allAuctions.get()

    
    let auctions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let lastReturnedDoc = snapshot.docs[snapshot.docs.length-1].id

    console.log({auctions,lastReturnedDoc})
    return {auctions,lastReturnedDoc}

    
}

let updateSingleAuction = async function(auctionInfo) { //Update only a single player

    try {
        
        let idToken = req.header("idToken")
        if (!idToken) {
            return res.status(400).send({ error: "Please pass an ID Token" });
        }

        if (await isValidAdmin(idToken) === false) {
            return res.status(401).send({ error: "Not Authorized" });
        }

        if(auctionInfo.id !== undefined){ //if ID exists, update the auction instead of creating a new one

            let docRef = auctionRef.doc(auctionInfo.id)
            const doc = await docRef.get();
            if (!doc.exists) {
                throw null
            } else {
                const res = await docRef.update(auctionInfo);
                return res.id
            }

        }


        const res = await db.collection('auctions').add(auctionInfo);

        return res.id


        
    } catch (error) {

        return error
        
    }

}

let getSingleAuction = async function(auctionID){ //Search Player by IGN

    try {

        let docRef = auctionRef.doc(auctionID)
        const doc = await docRef.get();
        if (!doc.exists) {
            throw null
        } else {
            return doc.data()
        }
        
    } catch (error) {

        return error
        
    }

}


module.exports = {
    getAllPlayers,getSinglePlayer,updateSinglePlayer,getSinglePlayerByID,
    getAllTeams,getSingleTeam,updateSingleTeam,
    getAllAuctions,updateSingleAuction,getSingleAuction}