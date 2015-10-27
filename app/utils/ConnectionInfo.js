import React from 'react-native'
import { NetInfo, AppStateIOS, Text, View } from 'react-native'
/////////////////////////////////////////////////////////////////////////
//
//  ReachabilitySubscription
//
//


class ReachabilitySubscription extends React.Component{
  constructor(props) {
    super()
    this.state = {
      reachabilityHistory: [],
    }
  }
  componentDidMount() {
    NetInfo.addEventListener( 'change', this._handleReachabilityChange.bind(this) )
  }
  componentWillUnmount() {
    NetInfo.removeEventListener( 'change', this._handleReachabilityChange.bind(this) )
  }
  _handleReachabilityChange(reachability) {
    const reachabilityHistory = this.state.reachabilityHistory.slice() //is slice nesseary anymore with const?
    reachabilityHistory.push(reachability)

    this.setState({
      reachabilityHistory
    })
  }
  render() {
    return <View style={{position:'absolute'}}/>
  }
}

exports.ReachabilitySubscription = ReachabilitySubscription
///////////////////////////////////////////////////////////////////////////////////
//
//  NetInfo.isConnected. Asynchronously load and observe connectivity
//  Example:
//      render(): ReactElement { return <IsConnected /> }
//

class Connectivity extends React.Component{
  constructor(props) {
    super()
    this.state = {
      isConnected: null,
    }
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener( 'change', this._handleConnectivityChange.bind(this) )
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}) }
    )}
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener( 'change', this._handleConnectivityChange.bind(this) )
  }
  _handleConnectivityChange(isConnected) {
    this.setState({ isConnected, })
  }
  render() {
    return ( !this.state.isConnected ? <View style={{position:'absolute'}}/> : null )
  }
}

exports.Connectivity = Connectivity
///////////////////////////////////////////////////////////////////////////////////
//
//
//  AppStateIOS
//  Listens for foreground background transition events
//


class AppVisibility extends React.Component{
  constructor(props){
    super()

    console.log(AppStateIOS.currentState)
    this.state = {
      appState: AppStateIOS.currentState,
    }
  }

  componentDidMount(){
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount(){
    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange =(appState)=> {
    this.setState({ appState })
  }
  render() {
    return ( !this.state.isConnected ? <View style={{position:'absolute'}}/> : null )
  }
}

exports.Visibility = AppVisibility


export default { Connectivity, ReachabilitySubscription, AppVisibility }
