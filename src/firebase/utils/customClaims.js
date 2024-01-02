const {admin} = require("../index")

let auth = admin.auth()

auth
  .setCustomUserClaims("pheSdLj7K8ez2Z3iAMJkg9sNqzn2", { admin: true })
  .then(() => {
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
  });