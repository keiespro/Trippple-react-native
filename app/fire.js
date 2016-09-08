import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBwQ0d87ygSNxEpcxJSDxpH2e9sb0tpNE8",
  authDomain: "trippple-93bbc.firebaseio.com",
  databaseURL: "https://trippple-93bbc.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);


const checkFireLoginState = (fbUser) => new Promise((reject,resolve) => {
  if (fbUser) {
    return firebase.auth().onAuthStateChanged((firebaseUser) => {
      console.log(fbUser,firebaseUser);
      if (!isUserEqual(fbUser, firebaseUser)) {
        const credential = firebase.auth.FacebookAuthProvider.credential(fbUser.accessToken);
        firebase.auth()
          .signInWithCredential(credential)
          .then(a => {
            console.log(a);
            resolve(firebaseUser)
          })
          .catch((error) => {
          // Handle Errors here.
            console.log('isUserEqual',error);
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            reject(error)
          });
      } else {
        // User is already signed-in Firebase with the correct user.
        resolve(firebaseUser)
      }
    });
  } else {
    // User is signed-out of Facebook.
    firebase.auth().signOut();
    reject()
  }
})

function isUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    let providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}


export default checkFireLoginState
