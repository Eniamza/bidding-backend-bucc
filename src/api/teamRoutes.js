const express = require('express');
const team = express.Router();

const { isValidAdmin } = require("../firebase/utils/fireuser");

const { getAllTeams, getSingleTeam, updateSingleTeam } = require("../firebase/utils/firestore");

team.get("/all",async(req,res) => { //Fetches all existing Team info,  including there players [if any]

    
    try {
        const lastReturnedDoc = req.query.lastReturnedDoc
        const results = await getAllTeams(lastReturnedDoc)
        res.status(200).json(results)
        
    } catch (error) {
        res.status(500).json({error:error.message})
        
    }


})

team.post("/info",async(req,res) => { //Fetches a single team info, including there players [if any]

    try {
        let teamID = req.body.teamID
        if(!teamID) {
            return res.status(400).send({error:"Please pass a team id"})
        }

        const info = await getSingleTeam(teamID)
        console.log(info)

        if(info === null) {
            return res.status(404).send({error:"Team not found."})
        }
        else {
            return res.status(200).json(info)
        }
        
    } catch (error) {
        return res.status(500).json({error:error.message})
        
    }

})

team.post("/update",async(req,res) => { //Updates a single team info, including there players [if any]

    try {



        let idToken = req.header("idToken")
        if (!idToken) {
            return res.status(400).send({ error: "Please pass an ID Token" });
        }

        if (await isValidAdmin(idToken) === false) {
            return res.status(401).send({ error: "Not Authorized" });
        }



        const isValidUrl = (string) => {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        };

        const teamData = req.body

        if (teamData.balance) {
            return res.status(400).send('Malformed Request. Cannot accept balance.');
        }
    
        // Check for players array
        if (teamData.players) {
            return res.status(400).send('Malformed Request. Cannot accept players.');
        }
    
        if (teamData.id) {
            return res.status(400).send('Malformed Request. Cannot accept team id.');
        }



        if (typeof teamData.managerUID !== 'string' || teamData.managerUID.trim() === '') {
            return res.status(400).send('Invalid manager UID.');
        }
    
    
        // Check for description in teamInfo
        if (typeof teamData.description !== 'string') {
            return res.status(400).send('Invalid description in teamInfo.');
        }
    
        // Check for teamTitle in teamInfo
        if (typeof teamData.teamTitle !== 'string') {
            return res.status(400).send('Invalid teamTitle in teamInfo.');
        }
    
        // Check for logoURL in teamInfo
        if (!isValidUrl(teamData.logoURL)) {
            return res.status(400).send('Invalid logoURL in teamInfo.');
        }

        teamData.balance = 1000
        teamData.players = []

        let resupdate = await updateSingleTeam(teamData)
        return res.status(200).json(resupdate)


    
        
    } catch (error) {
        return res.status(500).json({error:error.message})
        
    }

})

module.exports = {team}

