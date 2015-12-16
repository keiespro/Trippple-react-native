import React, { AppRegistry } from 'react-native'
import App from './components/app'
import LoadingOverlay from './components/LoadingOverlay'
import Keychain from 'react-native-keychain'
import {KEYCHAIN_NAMESPACE} from  './config'
import AppActions from './flux/actions/AppActions'

export default class Boot extends React.Component{
  constructor(props){
    super();
    this.state = { booted: false }
  }

  componentDidMount(){
    this.getCredentials()
  }

  getCredentials(){
    console.log('getCredentials')
    Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then((creds)=>{
      console.log(creds);
      AppActions.gotCredentials(creds)
      this.setBooted()
    })
    .catch((err)=>{
      console.log(err);
      AppActions.noCredentials(err)
      this.setBooted()
    })
  }
  setBooted(){
    this.setState({booted:true})
  }
  render(){
    return this.state.booted ? <App key="app"/> : <LoadingOverlay />
  }

}

