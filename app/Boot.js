import React from "react";
import {AsyncStorage, Settings} from "react-native";
import App from './components/app'
import LoadingOverlay from './components/LoadingOverlay'
import Keychain from 'react-native-keychain'
import config from './config'
import alt from './flux/alt'
import TouchID from 'react-native-touch-id'
import Analytics from './utils/Analytics'

import LockFailed from './LockFailed'
const {KEYCHAIN_NAMESPACE} = config
import AppActions from './flux/actions/AppActions'


class Boot extends React.Component{
  constructor(props){
    super();
    this.state = {
      booted: false,
      isLocked: Settings._settings['LockedWithTouchID']
    }
  }
  componentWillMount(){
    if(this.state.isLocked){
      this.checkTouchId()
    }
  }
  componentDidMount(){
    this.getCredentials()
  }

  getCredentials(){
    Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then((creds)=>{
      AppActions.gotCredentials(creds)
    }).then((creds)=>{
      this.checkSettings();
    }).catch((err)=>{
      Analytics.err(err)
      this.setBooted()
    })
  }

  checkTouchId(){

    TouchID.authenticate('Access Trippple')
      .then(success => {
        this.setState({
          lockFailed: false,
          isLocked: false
        })
        // Success code
      })
      .catch(error => {
        // Failure code
        Analytics.err(err)

        this.setState({
          lockFailed: true
        })

      });
  }
  setBooted(){
    this.setState({booted:true})

  }
  checkSettings(){

    const savedJSVersion = Settings.get('TripppleVersion');
    const currentJSVersion = ReactNativeAutoUpdater.jsCodeVersion;
    if(!savedJSVersion){
      // Delete local storage data for matches to prepare app for distinct matches / new matches endpoint change
      // and saved Settings.TripppleVersion for the first time

      AsyncStorage.setItem('MatchesStore','{}')
      .then(()=>{
        Settings.set({TripppleVersion:currentJSVersion})
        this.bootStrapData()
      })
      .catch((err)=>{
        Analytics.err(err)
        this.setBooted()

      })
    }else{
      this.bootStrapData()

    }
  }
  bootStrapData(){

    // bootstrap stores from asyncstorage
    AsyncStorage.multiGet(['ChatStore','MatchesStore','UserStore'])
    .then((data) => {
      if (data){
        const savedMatches = JSON.parse(data[1][1]);
        const savedChats = JSON.parse(data[0][1]);
        const saved = {...JSON.parse(savedChats),...JSON.parse(savedMatches)}
        Analytics.log('Saved stores',saved);
        alt.bootstrap(JSON.stringify(saved));
        this.setBooted()
      }
    }).catch((err) => {
      Analytics.err(err)

      this.setBooted()
    })
  }
  render(){
    return this.state.lockFailed ? <LockFailed retry={this.checkTouchId.bind(this)}/> :
      !this.state.isLocked && this.state.booted ? <App key="app"/> : <LoadingOverlay />

  }

}
Boot.displayName = 'Boot'

export default Boot
