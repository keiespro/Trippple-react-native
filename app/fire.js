import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBwQ0d87ygSNxEpcxJSDxpH2e9sb0tpNE8",
    authDomain: "trippple-93bbc.firebaseio.com",
    databaseURL: "https://trippple-93bbc.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);


const checkFireLoginState = (fbUser,dispatch) => {
    if (fbUser) {
        firebase.auth().onAuthStateChanged((firebaseUser) => {

            if (!isUserEqual(fbUser, firebaseUser)) {
                const credential = firebase.auth.FacebookAuthProvider.credential(fbUser.accessToken);

                firebase.auth()
                  .signInWithCredential(credential)
                  .then(firebaser => {
                      dispatch({ type: 'FIREBASE_AUTH', payload: firebaser })
                  })
                  .catch((error) => {
                      __DEV__ && console.warn('catch fire',error);
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      const email = error.email;
                      if(error) dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: error });

                  });
            } else {
              // User is already signed-in Firebase with the correct user.
                dispatch({ type: 'FIREBASE_AUTH_CONFIRM', payload: firebaseUser.toJSON() })
            }
        });
    } else {
        __DEV__ && console.warn('User is signed-out of Facebook.')
        firebase.auth().signOut();
        dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: 'User is signed-out of Facebook.' })

    }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
    let r= false;
    if (firebaseUser) {
        let providerData = firebaseUser.providerData;
        for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID) {
        // We don't need to re-auth the Firebase connection.
                r = true;
            }
        }
    }
    console.log('isUserEqual',r);

    return r;
}


export default checkFireLoginState
