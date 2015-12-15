import alt from '../alt'

import Keychain from 'react-native-keychain'

import {KEYCHAIN_NAMESPACE} from '../../config'

import Device from 'react-native-device'
// import Log from '../../Log'
var AppActions = require('../actions/AppActions');
var UserActions = require('../actions/UserActions')



class CredentialsStore {

  constructor() {
      this.user_id = '';
      this.api_key = '';

      this.on('init', () => {
        Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
        .then((creds) => { AppActions.gotCredentials(creds) })
        .catch((err) => { AppActions.noCredentials })
        console.log(AppActions)
        AppActions.initApp()

      /*noop*/
      });
      this.on('error', (err, payload, currentState) => {
        // Log.log(err, payload, currentState);
      })
      console.log(AppActions,UserActions,alt)

      this.bindListeners({
        handleInitApp: AppActions.INIT_APP,
        handleGotCredentials: AppActions.GOT_CREDENTIALS,
      });
      this.exportPublicMethods({
        saveCredentials: this.saveCredentials.bind(this)
      })


  }
  handleInitApp(){
    this.getInstance().init()

  }
  handleGotCredentials(creds){
    this.setState({ user_id: creds.username+'' , api_key: creds.password+'' })
  }
  handleVerifyPin(res){
    const { user_id, api_key } = res.response;
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, user_id+'' , api_key)
      .then((result)=> {
      })
      .catch((err)=> {
      });

    this.setState({ user_id, api_key })
  }
  saveCredentials(response){
    const { user_id, api_key } = response;
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, user_id+'' , api_key)
      .then((result)=> {
      })
      .catch((err)=> {
      });

    this.setState({ user_id, api_key })

  }

  handleVerifyPin(res){
    // doesnt work. setting is done manually thru public method saveCredentials

    const { user_id, api_key } = res;
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, user_id, api_key)
      .then((result)=> {
        this.setState({ user_id, api_key })
      });


  }
  handleInitialize(){

  }
  handleLogOut(){

  }
}
export default alt.createStore(CredentialsStore, 'CredentialsStore');
