const express = require('express');
const team = express.Router();

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

module.exports = {team}

