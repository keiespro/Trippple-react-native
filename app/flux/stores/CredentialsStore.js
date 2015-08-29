import alt from '../alt'
import UserActions from '../actions/UserActions'
import AppActions from '../actions/AppActions'
import { datasource } from 'alt/utils/decorators'
import CredentialsSource from '../dataSources/CredentialsSource'
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

      this.bindListeners({
        handleInitApp: AppActions.INIT_APP,
        // handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
        // handleLogOut: UserActions.LOG_OUT,
        handleGotCredentials: AppActions.GOT_CREDENTIALS
      });
  }
  handleInitApp(){
    this.getInstance().init()
  }
  handleGotCredentials(creds){
    console.log(creds,'GOT CREDS')

    this.setState({ user_id: creds.username, api_key: creds.password })
  }
  handleVerifyPin(res){
    console.log(res)
    const { user_id, api_key } = res.response;

    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, user_id, api_key)
      .then((result)=> {
        console.log('Credentials saved successfully!',result)
        this.setState({ user_id, api_key })
      });


  }
  handleInitialize(){
    console.log('handleInitialize')
  }
  handleLogOut(){
    Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE)
    .then(() => {
      console.log('Credentials successfully deleted');
      this.setState({  api_key: null, user_id: null });
    })


  }
}
export default alt.createStore(CredentialsStore, 'CredentialsStore');

