const { getFirestore } = require('firebase-admin/firestore');
let db = getFirestore()

let teamRef = db.collection('teams');
let playerRef = db.collection('players');
let auctionRef = db.collection('auctions');

const {getSingleAuction,getSinglePlayer,getAllTeams, getSinglePlayerByID} = require("../firebase/utils/firestore")

const fs = require('fs').promises;

let currentBidPlayer = {}
let currentAuctionBids = []
let currentAuction
let currentHighestBid = 0
let currentHighestBidder = ""
let currentBidStatus = ""    // "open" or "closed"
let teamBalances = {} // {teamId: balance}
let teamLoans = {} // {teamId: loanedAmount} Loaned amount must be less than the team Balance
let bidQueue = []




    // When the bid starts, this script should update the variables with the current player
    // and then an updateBid is called, this script should update the variables with the new bid
    // Write the neccesary variables

let checkCurrentBid = async function (bidder, bid) {

    if (currentBidStatus === "closed") {
        return false
    }

    if (bid <= currentHighestBid) {
        return false
    }

    if (bid > teamBalances[bidder]) {
        return false
    }

    if (bid > teamBalances[bidder] + teamLoans[bidder]) {
        return false
    }

    return true


}

let replytoBidStart = async function () {

    try {

        let message = {
            currentBidStatus,
            currentBidPlayer,
            currentHighestBid,
            currentHighestBidder,
            currentAuction
    
        }
    
        return message
        
    } catch (error) {

        console.log(error)
        return false
        
    }

}

let startBidPlayer = async function (playerid,auctionid) {
    try {

        if (currentBidStatus === "open") {
            console.log("Bid is already running")
            return false
        }

        if(playerid === undefined || auctionid === undefined){
            console.log("Player or Auction ID is undefined")
            return false
        }

        let player = await getSinglePlayerByID(playerid)
        let auction = await getSingleAuction(auctionid)

        console.log(auction)


        if(player === null || auction === null){

            console.log("Player or Auction is null. Please provide proper IDs")
            return false
        }

        if(auction.players.indexOf(playerid) === -1){

            console.log("Player isn't listed in the auction")
            return false
        }




        let allTeams = await getAllTeams() 
        allTeams = allTeams.teams

        allTeams.forEach(team => {

            teamBalances[team.id] = team.balance


        });

        console.log(teamBalances)

        currentBidPlayer = player
        currentAuction = auction
        currentHighestBid = 0
        currentHighestBidder = ""
        currentBidStatus = "open"
        teamLoans = {}
        bidQueue = []

        console.log(await replytoBidStart())

        await saveData();
        return await replytoBidStart()

    } catch (error) {
        console.log(error)
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
        currentHighestBidder,
        currentBidStatus,
        teamLoans,
        bidQueue,
        aucHistory,
        currentAuction,
        currentAuctionBids
    };
    await fs.writeFile('data.json', JSON.stringify(data));
}

let loadData = async function() {
    try {
        const data = JSON.parse(await fs.readFile('data.json'));
        currentBidPlayer = data.currentBidPlayer;
        currentHighestBid = data.currentHighestBid;
        currentHighestBidder = data.currentHighestBidder;
        currentBidStatus = data.currentBidStatus;
        teamLoans = data.teamLoans;
        bidQueue = data.bidQueue;
        aucHistory = data.aucHistory;
        currentAuction = data.currentAuction;
        currentAuctionBids = data.currentAuctionBids;

    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Load the data when the module is loaded
loadData();

module.exports = {
    startBidPlayer,
    replytoBidStart
}