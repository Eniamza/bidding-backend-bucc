const {admin} = require("../index")

let auth = admin.auth()

auth
  .setCustomUserClaims("tqG7qhYqJcc6zcX6td33zB69iC83", { manager: true })
  .then(() => {
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
  });