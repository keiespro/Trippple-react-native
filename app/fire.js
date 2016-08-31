import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBwQ0d87ygSNxEpcxJSDxpH2e9sb0tpNE8",
  authDomain: "trippple-93bbc.firebaseio.com",
  databaseURL: "https://trippple-93bbc.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);


const checkFireLoginState = (fbUser) => new Promise((reject,resolve) => {
  if (fbUser) {
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!isUserEqual(fbUser, firebaseUser)) {
        const credential = firebase.auth.FacebookAuthProvider.credential(fbUser.accessToken);
        firebase.auth()
          .signInWithCredential(credential)
          .then(a => {resolve(s)})
          .catch((error) => {
          // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            reject(error)
          });
      } else {
        // User is already signed-in Firebase with the correct user.
        resolve()
      }
    });
  } else {
    reject()
    // User is signed-out of Facebook.
    firebase.auth().signOut();
  }
})

function isUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
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
