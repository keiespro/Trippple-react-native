/*
* @flow
*/
import firebase from 'rn-firebase-bridge';

const firebaseConfig = {
  APIKey: 'AIzaSyBwQ0d87ygSNxEpcxJSDxpH2e9sb0tpNE8',
  authDomain: 'trippple-93bbc.firebaseio.com',
  databaseURL: 'https://trippple-93bbc.firebaseio.com',
  googleAppID: '1:820434364878:android:1a79f2b518e181b2'
};

// // Get default app
const app = firebase.initializeApp(firebaseConfig, 'com.trippple', (x) => console.log(x))

const database = app.database();
const auth = app.auth();

const fireLogin = (fbUser, dispatch) => {
  auth.onAuthStateChanged((firebaseUser) => {
    console.log(firebaseUser, auth);
    if(fbUser && !isUserEqual(fbUser, firebaseUser)) {
      const credential = firebase.auth.FacebookAuthProvider.credential(fbUser.accessToken);
      auth.signInWithCredential(credential)
      .then(firebaser => {
        dispatch({ type: 'FIREBASE_AUTH', payload: firebaser })
      })
      .catch((error) => {
        __DEV__ && console.warn('catch fire', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        if(error) dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: error });
      });
    }else{
      dispatch({ type: 'FIREBASE_AUTH_CONFIRM', payload: firebaseUser })
    }
  }, auth);
}

const checkFireLoginState = async (fbUser, dispatch) => {
  console.log(fbUser, 'fbUserfbUserfbUserfbUserfbUserfbUser');
  if(fbUser) {
    const firebaseUser = await fireLogin(fbUser, dispatch)
    dispatch({ type: 'FIREBASE_AUTH_SUCCESS', payload: firebaseUser })
  }else{
    __DEV__ && console.warn('User is signed-out of Facebook.')
    auth.signOut();
    dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: 'User is signed-out of Facebook.' })
  }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
  let r = false;
  if(firebaseUser) {
    console.log(firebaseUser);
    // const providerData = firebaseUser.providerData;
    // for(let i = 0; i < providerData.length; i++) {
    //   if(providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
    //       providerData[i].uid === facebookAuthResponse.userID) {
    //     // We don't need to re-auth the Firebase connection.
    //     r = true;
    //   }
    // }
    r = true //STUBBED
  }
  console.log('isUserEqual', r);

  return r;
}


export default checkFireLoginState
