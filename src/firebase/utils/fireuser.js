const {admin} = require("../index")

let auth = admin.auth()


let isValidAdmin = async function(idToken) {
    try {


        let decoded = await auth.verifyIdToken(idToken,true)
        let uid = decoded.uid

        let userInfo = await auth.getUser(uid)
        console.log(userInfo.customClaims.admin)

       if(userInfo.customClaims.admin){
        
        return true
       }
       else {
        return false
       }
        
        
        
    } catch (error) {

        return false
        
    }
}

let isValidManager = async function(idToken) {
    try {

        let decoded = await auth.verifyIdToken(idToken,true)
        let uid = decoded.uid

        let userInfo = await auth.getUser(uid)
        console.log(userInfo.customClaims.manager)

       if(userInfo.customClaims.admin){
        
        return true
       }
       else {
        return false
       }
        


    } catch (error) {

        return false
        
    }
}

module.exports = {
    isValidAdmin
}