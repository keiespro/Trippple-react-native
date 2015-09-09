import alt from '../alt'
import AppActions from '../actions/AppActions'
import { datasource } from 'alt/utils/decorators'
import CredentialsSource from '../dataSources/CredentialsSource'
import UserActions from '../actions/UserActions'
import Keychain from 'react-native-keychain'

const KEYCHAIN_NAMESPACE =  'trippple.co'

var Device = require('react-native-device');


// @datasource(CredentialsSource)
class CredentialsStore {

  constructor() {
      this.user_id = null;
      this.api_key = null;

      this.registerAsync(CredentialsSource);

      this.on('init', () => console.log('Credentials store init'))
      console.log(UserActions,AppActions);
      this.bindListeners({
        handleInitApp: AppActions.INIT_APP,
        handleGotCredentials: AppActions.GOT_CREDENTIALS
      });
  }
  handleInitApp(){
    this.getInstance().init()
  }
  handleGotCredentials(creds){
    this.setState({ user_id: creds.username, api_key: creds.password })
  }
  handleVerifyPin(res){
    console.log(res);
    if(res.status != 200){ return false; }

    const { user_id, api_key } = res.response;
    console.log('verify pin credentials store')
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, user_id, api_key)
      .then((result)=> {
        console.log('Credentials saved successfully!',result)
        this.setState({ user_id, api_key })
      });


  }
  handleInitialize(){

  }
  handleLogOut(){

  }
}
export default alt.createStore(CredentialsStore, 'CredentialsStore');

