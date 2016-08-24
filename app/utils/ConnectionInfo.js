import React from "react";
import { NetInfo, View } from 'react-native'

export default class ConnectionInfo extends React.Component{
  componentDidMount() {
    NetInfo.isConnected.addEventListener( 'change', this._handleConnectivityChange.bind(this) )
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this._handleConnectivityChange(isConnected) }
    )}
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener( 'change', this._handleConnectivityChange.bind(this) )
  }
  _handleConnectivityChange(isConnected) {
    this.props.dispatch({type:'CONNECTION_CHANGE',payload:isConnected})
  }
  render() {
    return <View style={{position:'absolute'}}/>
  }
}
