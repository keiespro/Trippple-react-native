import React from 'react-native'
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
    Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then((creds)=>{
      AppActions.gotCredentials(creds)
      this.setBooted()
    })
    .catch((err)=>{
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

