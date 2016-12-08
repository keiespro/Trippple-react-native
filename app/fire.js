/*
* @flow
*/
import firebase from 'rn-firebase-bridge';
import {Platform} from 'react-native'

// const firebaseConfig = {
//   APIKey: 'AIzaSyBZKzo_aVFz4ldw0bQ-8dJMe88xF0q0N9U',
//   authDomain: 'trippple-93bbc.firebaseio.com',
//   databaseURL: 'https://trippple-93bbc.firebaseio.com',
//   googleAppID: `1:820434364878:${Platform.OS}:839f5cd266b5f573`
// };

// // Get default app

// const app = firebase.initializeDefaultApp()
const fireLogin = (fbUser, dispatch) => {

  const app = firebase.initializeDefaultApp(x => {//(firebaseConfig, 'Trippple', x => {

     const database = app.database();
    const auth = app.auth();
      // __DEV__ && console.log( auth);

  auth.onAuthStateChanged((firebaseUser) => {
    // __DEV__ && console.log(firebaseUser, auth);
    if(fbUser && !isUserEqual(fbUser, firebaseUser)) {
      const credential = app.auth.FacebookAuthProvider.credential(fbUser.accessToken);
      app.auth.signInWithCredential(credential)
      .then(firebaser => {
        dispatch({ type: 'FIREBASE_AUTH', payload: firebaser })
      })
      .catch((error) => {
        // __DEV__ && console.warn('catch fire', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        if(error) dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: error });
      });
    }else{
      dispatch({ type: 'FIREBASE_AUTH_CONFIRM', payload: firebaseUser })
    }
  }, app.auth);


  })
}

const checkFireLoginState = async (fbUser, dispatch) => {
  // console.log(fbUser, 'fbUserfbUserfbUserfbUserfbUserfbUser');
  if(fbUser) {
    const firebaseUser = await fireLogin(fbUser, dispatch)
    dispatch({ type: 'FIREBASE_AUTH_SUCCESS', payload: firebaseUser })
  }else{
    // __DEV__ && console.warn('User is signed-out of Facebook.')
    // auth.signOut();
    dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: 'User is signed-out of Facebook.' })
  }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
  let r = false;
  if(firebaseUser) {
    // console.log(firebaseUser);
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
  // console.log('isUserEqual', r);

  return r;
}


export default checkFireLoginState
