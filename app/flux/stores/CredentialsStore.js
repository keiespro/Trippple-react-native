import alt from '../alt'
import { datasource } from 'alt/utils/decorators'
import CredentialsSource from '../dataSources/CredentialsSource'
import UserActions from '../actions/UserActions'
import Keychain from 'react-native-keychain'
import AppActions from '../actions/AppActions'

const KEYCHAIN_NAMESPACE =  'trippple.co'

var Device = require('react-native-device');


@datasource(CredentialsSource)
class CredentialsStore {

  constructor() {
      this.user_id = '';
      this.api_key = '';

      this.on('init', () => console.log('Credentials store init',UserActions))
      this.bindListeners({
        handleInitApp: AppActions.INIT_APP,
        handleGotCredentials: AppActions.GOT_CREDENTIALS,
      });
      this.exportPublicMethods({
        saveCredentials: this.saveCredentials
      })

      this.registerAsync(CredentialsSource);

  }
  handleInitApp(){
    this.getInstance().init()
  }
  handleGotCredentials(creds){
    this.setState({ user_id: creds.username+'' , api_key: creds.password+'' })
  }

  saveCredentials(response){
    const { user_id, api_key } = response;
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, user_id+'' , api_key)
      .then((result)=> {
        console.log('Credentials saved successfully!',result)
      })
      .catch((err)=> {
        console.log('Credentials saving failed!',err)
      });

    this.setState({ user_id, api_key })

  }

  handleVerifyPin(res){
    // doesnt work. setting is done manually thru public method saveCredentials
    console.log(res,'handleVerifyPin');

    const { user_id, api_key } = res;
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
