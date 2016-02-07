import React, {AsyncStorage} from 'react-native'
import App from './components/app'
import LoadingOverlay from './components/LoadingOverlay'
import Keychain from 'react-native-keychain'
import config from './config'
import alt from './flux/alt'

const {KEYCHAIN_NAMESPACE} = config
import AppActions from './flux/actions/AppActions'

class Boot extends React.Component{
  constructor(props){
    super();
    this.state = { booted: false }
  }

  componentDidMount(){
    this.getCredentials()
  }

  getCredentials(){
    Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then((creds)=>{
      AppActions.gotCredentials(creds)
    }).then((creds)=>{
      this.bootStrapData();
    }).catch((err)=>{
      this.setBooted()
    })
  }

  setBooted(){
    this.setState({booted:true})

  }
  bootStrapData(){

    // bootstrap stores from asyncstorage
    AsyncStorage.multiGet(['ChatStore','MatchesStore','UserStore'])
    .then((data) => {
      if (data){
        const savedMatches = JSON.parse(data[1][1]);
        const savedChats = JSON.parse(data[0][1]);
        const saved = {...JSON.parse(savedChats),...JSON.parse(savedMatches)}
        Log('Saved stores',saved);
        alt.bootstrap(JSON.stringify(saved));
        this.setBooted()
      }
    }).catch((err) => {
      this.setBooted()
    })
  }
  render(){
    return this.state.booted ? <App key="app"/> : <LoadingOverlay />
  }

}

export default Boot
