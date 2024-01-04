const fs = require('fs').promises;

let currentBidPlayer = {}
let currentHighestBid = 0
let currentHighestBidder = ""
let currentBidStatus = ""    // "open" or "closed"

let startBidPlayer = async function (player) {
    try {

        if (currentBidStatus === "open") {
            return false
        }

        currentBidPlayer = player
        currentHighestBid = 0
        currentHighestBidder = ""
        currentBidStatus = "open"
        await saveData();
        return true
    } catch (error) {
        return false
    }
}

let updateBidPlayer = async function (player) {
    try {
        currentBidPlayer = player
        await saveData();
        return true
    } catch (error) {
        return false
    }
}

let updateBidVariables = async function (bidder, bid) {
    try {
        currentHighestBid = bid
        currentHighestBidder = bidder
        await saveData();
        return true
    } catch (error) {
        return false
    }
}

let saveData = async function() {
    const data = {
        currentBidPlayer,
        currentHighestBid,
        currentHighestBidder
    };
    await fs.writeFile('data.json', JSON.stringify(data));
}

let loadData = async function() {
    try {
        const data = JSON.parse(await fs.readFile('data.json'));
        currentBidPlayer = data.currentBidPlayer;
        currentHighestBid = data.currentHighestBid;
        currentHighestBidder = data.currentHighestBidder;
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Load the data when the module is loaded
loadData();