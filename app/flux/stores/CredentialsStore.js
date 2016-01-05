import alt from '../alt'
import UserActions from '../actions/UserActions'
import Keychain from 'react-native-keychain'
import AppActions from '../actions/AppActions'

import config from '../../config'
const {KEYCHAIN_NAMESPACE} = config
import Device from 'react-native-device'

import Log from '../../Log'

class CredentialsStore {

  constructor() {
    this.user_id = '';
    this.api_key = '';

    this.on('init', () => {
      console.log('init credentials store', KEYCHAIN_NAMESPACE,config);
    /*noop*/})

    this.on('error', (err, payload, currentState) => {
      Log(err, payload, currentState);
    })

    this.bindListeners({
      handleGotCredentials: AppActions.GOT_CREDENTIALS,
    });

    this.exportPublicMethods({
      saveCredentials: this.saveCredentials.bind(this),
      getCredentials: this.getCredentials.bind(this),
    })

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

  getCredentials(){
    const { user_id, api_key } = this
    return { user_id, api_key }
  }
}
export default alt.createStore(CredentialsStore, 'CredentialsStore');
