process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
var admin = require("firebase-admin");

var serviceAccount = require("./firevice.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyNmM2YTg0YWMwNjcwMDVjZTM0Y2VmZjliM2EyZTA4ZTBkZDliY2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnVjYy1iaWQiLCJhdWQiOiJidWNjLWJpZCIsImF1dGhfdGltZSI6MTcwNDE0NjU2NywidXNlcl9pZCI6InBoZVNkTGo3SzhlejJaM2lBTUprZzlzTnF6bjIiLCJzdWIiOiJwaGVTZExqN0s4ZXoyWjNpQU1Ka2c5c05xem4yIiwiaWF0IjoxNzA0MTQ2NTY3LCJleHAiOjE3MDQxNTAxNjcsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3QxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.EA8c_hpbrIxyNmAsxr2GKzLix7Mcw-BvlclPEHroCK7Xq5PlczLivk1jbv2Gp_JIMv6QqMYO0lvlq7B4FYfFFRJt7kUOT4RZRCUVr1upn6ox1ypLhzxj6Yvk87Sh2P7vM7kwbtLLDd242LwXbjIkf8bpTtK1jJ-ApxbKpGK2BcR40HigbJLZGzynWjuc9ih8s8JilIUY4ebfGhwUJkA_ZV-yHhKTF6FW94hTWf5GQ_b63aCaYqols6W9SiFE4UOsYPzcdYovE5uVpSqKCx5JdiPoss-4m1mGCLM7rDGl3CDcjEQwWbT41MwrBPTtKcoeU5UCpNFaADt9A_nIqI-ejQ"

// idToken comes from the client app
admin.auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    console.log(decodedToken)
    // ...
  })
  .catch((error) => {
    // Handle error
  });








