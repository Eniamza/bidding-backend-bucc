
var admin = require("firebase-admin");

var serviceAccount = require("./firevice.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



module.exports = {admin}








