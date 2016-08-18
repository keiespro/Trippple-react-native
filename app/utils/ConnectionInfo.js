import React from "react";

import NoInternetBanner from '../components/controls/NoInternetBanner';

import { NetInfo, AppState, Text, View } from 'react-native'

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
      isConnected: true,
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
    return ( !this.state.isConnected ? <NoInternetBanner/> : null )
  }
}

exports.Connectivity = Connectivity
///////////////////////////////////////////////////////////////////////////////////
//
//
//  AppState
//  Listens for foreground background transition events
//


class AppVisibility extends React.Component{
  constructor(props){
    super()

    this.state = {
      appState: AppState.currentState,
    }
  }

  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange(appState){

    if(appState === 'background'){

    }
    this.setState({ appState })
  }
  render() {

    return ( !this.state.isConnected ? <View style={{position:'absolute'}}/> : null )
  }
}

exports.AppVisibility = AppVisibility


export default { Connectivity, ReachabilitySubscription, AppVisibility }
