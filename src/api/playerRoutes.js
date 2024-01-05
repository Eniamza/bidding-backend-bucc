const express = require('express');
const player = express.Router();
const { getAllPlayers, getSinglePlayer, updateSinglePlayer } = require("../firebase/utils/firestore");
const { isValidAdmin } = require("../firebase/utils/fireuser");

player.get("/all", async (req, res) => {
    try {
        const lastReturnedDoc = req.query.lastReturnedDoc;
        const results = await getAllPlayers(lastReturnedDoc);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

player.post("/info", async (req, res) => {
    try {
        let ign = req.body.ign;
        if (!ign) {
            return res.status(400).send({ error: "Please pass an IGN" });
        }

        const info = await getSinglePlayer(ign);
        console.log(info);

        if (info === null) {
            return res.status(404).send({ error: "Player not found." });
        } else {
            return res.status(200).json(info);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

player.post("/update", async (req, res) => {
    try {
        let idToken = req.header("idToken");
        if (!idToken) {
            return res.status(400).send({ error: "Please pass an ID Token" });
        }

        if (await isValidAdmin(idToken) === false) {
            return res.status(401).send({ error: "Not Authorized" });
        }

        let playerInfo = req.body;
        const { skills, stats, basePrice, aucHist, profileImage, ign, category, mains } = playerInfo;

        function isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        }

        if (!Array.isArray(skills) || !skills.every(skill => typeof skill === 'string')) {
            return res.status(400).send('Invalid skills array.');
        }
        if (!isValidUrl(stats)) {
            return res.status(400).send('Invalid stats URL.');
        }
        if (typeof basePrice !== 'number' || basePrice < 0) {
            return res.status(400).send('Invalid base price.');
        }
        if (!Array.isArray(aucHist)) {
            return res.status(400).send('Invalid auction history.');
        }
        if (!isValidUrl(profileImage)) {
            return res.status(400).send('Invalid profile image URL.');
        }
        if (typeof ign !== 'string' || ign.trim() === '') {
            return res.status(400).send('Invalid IGN.');
        }

        if (typeof category !== 'string' || category.trim() === '') {
            return res.status(400).send('Invalid category.');
        }

        if (!Array.isArray(mains) || !mains.every(main => typeof main === 'string') || mains.length > 3) {
            return res.status(400).send('Invalid mains array. Please choose 3 main agents');
        }

        let resUpdate = await updateSinglePlayer(playerInfo)
        console.log()
        return res.status(200).json({playerid:resUpdate})

    } catch (error) {
        return res.status(500).send('Something went wrong on the server');
    }
});


module.exports = { player };
