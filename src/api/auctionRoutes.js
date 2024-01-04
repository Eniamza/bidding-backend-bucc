const express = require('express');
const auction = express.Router();

const { getAllAuctions,updateSingleAuction,getSingleAuction} = require("../firebase/utils/firestore.js")

auction.get("/all",async(req,res) => { //Fetches all existing Auction info,  including there players [if any]

    try {
        const lastReturnedDoc = req.query.lastReturnedDoc;
        const results = await getAllAuctions(lastReturnedDoc);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

auction.post("/update",async(req,res) => { //Creates a new Auction

    try {
        let idToken = req.header("idToken");
        if (!idToken) {
            return res.status(400).send({ error: "Please pass an ID Token" });
        }

        if (await isValidAdmin(idToken) === false) {
            return res.status(401).send({ error: "Not Authorized" });
        }

        let auctionInfo = req.body;



        const {date,teams,auctionTitle,bids,status} = auctionInfo

        if(!date || !teams || !auctionTitle ||  !status){
            return res.status(400).send({error:"Please pass all required fields"})
        }

        if(!Array.isArray(teams)){
            return res.status(400).send({error:"Please pass a valid array of teams"})
        }

        if(bids !== undefined && !Array.isArray(bids)){
            return res.status(400).send({error:"Please pass a valid array of bids"})
        }
        else if(bids === undefined){
            auctionInfo.bids = []
        }

        if(status !== "active" && status !== "pending" && status !== "ended"){
            return res.status(400).send({error:"Please pass a valid status"})
        }

        if(!date){
            return res.status(400).send({error:"Please pass a valid date"})
        }

        if(!auctionTitle){
            return res.status(400).send({error:"Please pass a valid auction title"})
        }

        let res = await updateSingleAuction(auctionInfo)
        return res.status(200).json({id:res})


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }


})

auction.post("/info",async(req,res) => { //Fetches a single Auction info,  including there players [if any]

    try {
        let auctionID = req.body.auctionID;
        if (!auctionID) {
            return res.status(400).send({ error: "Please pass an Auction ID" });
        }

        const info = await getSingleAuction(auctionID);

        if (info === null) {
            return res.status(404).send({ error: "Auction not found." });
        } else {
            return res.status(200).json(info);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

})

module.exports = {auction}