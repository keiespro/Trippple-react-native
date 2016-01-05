import React from 'react-native'
import App from './components/app'
import LoadingOverlay from './components/LoadingOverlay'
import Keychain from 'react-native-keychain'
import config from './config'
const {KEYCHAIN_NAMESPACE} = config
import AppActions from './flux/actions/AppActions'

 class Boot extends React.Component{
  constructor(props){
    super();
    console.log('xo')

    this.state = { booted: false }
  }

  componentDidMount(){
    this.getCredentials()
  }

  getCredentials(){
    console.log('getCredentials')

    Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then((creds)=>{
      console.log('gotCredentials')

      AppActions.gotCredentials(creds)
      this.setBooted()
    })
    .catch((err)=>{
      console.log('noCredentials')
      this.setBooted()

      AppActions.noCredentials(err)
    })
  }

  setBooted(){
    console.log('booted')

    this.setState({booted:true})
  }

  render(){
    return this.state.booted ? <App key="app"/> : <LoadingOverlay />
  }

}

export default Boot
