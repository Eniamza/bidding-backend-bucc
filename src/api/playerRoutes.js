const express = require('express')
const player = express.Router()
const {getAllPlayers,getSinglePlayer} = require("../firebase/utils/firestore")
const {isValidAdmin} = require("../firebase/utils/fireuser")



player.get("/all",async (req,res) =>{ // Return 10 players with pagination


    try {
        const lastReturnedDoc = req.query.lastReturnedDoc
        const results = await getAllPlayers(lastReturnedDoc)
    
        res.json(results).status(200)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }

})

player.post("/info", async (req,res)=> {

    try {

        let ign = req.body.ign

        if(!ign) {
            res.status(400).send({error:"Please pass an IGN"})
            return
        }

        const info = await getSinglePlayer(ign)
        console.log(info)
        
        if(info === null){
            res.status(404).send({error:"Player not found."})
        }
        else {
            res.status(200).json(info)
        }

        
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }

}) 

// player.post("/update", async (req,res)=> {

//     try {

//         let idToken = req.header("idToken")
//         if(!idToken){
//             res.status(400).send({error:"Please pass an ID Token"})
//         }

//         if(await isValidAdmin(idToken) == false){

//             res.status(401).send({error:"Not Authorized"})            

//         }

//         let playerInfo = req.body


//         function isValidUrl(string) {
//             try {
//                 new URL(string);
//                 return true;
//             } catch (_) {
//                 return false;
//             }
//         }
        

//             const { skills, stats, basePrice, aucHist, profileImage, ign } =playerInfo;
        
        
//             if (!Array.isArray(skills) || !skills.every(skill => typeof skill === 'string')) {
//                  res.status(400).send('Invalid skills array.');
//             }
        
//             if (!isValidUrl(stats)) {
//                  res.status(400).send('Invalid stats URL.');
//             }
        
//             if (typeof basePrice !== 'number' || basePrice < 0) { // Add more specific range if needed
//                  res.status(400).send('Invalid base price.');
//             }
        
//             if (!Array.isArray(aucHist) || !aucHist.every(item => typeof item === 'object')) {
//                  res.status(400).send('Invalid auction history.');
//             }
        
//             if (!isValidUrl(profileImage)) {
//                  res.status(400).send('Invalid profile image URL.');
//             }
        
//             if (typeof ign !== 'string' || ign.trim() === '') {
//                  res.status(400).send('Invalid IGN.');
//             }
        
//             res.status(200).send("UPDATED")



        
        
//     } catch (error) {

//         res.send('Something went wrong on the server')
        
//     }





module.exports = {player}