import React from "react";
import { NetInfo, View } from 'react-native'

export default class ConnectionInfo extends React.Component{
  componentDidMount() {
    NetInfo.isConnected.addEventListener( 'change', this._handleConnectivityChange.bind(this) )
    NetInfo.isConnected.fetch().done( isConnected => this._handleConnectivityChange(isConnected)  );
    NetInfo.addEventListener( 'change', this._handleConnectionTypeChange.bind(this) )
    NetInfo.fetch().done(
      (isConnected) => { this._handleConnectionTypeChange(isConnected) }
    )}

  componentWillUnmount() {
    NetInfo.removeEventListener( 'change', this._handleConnectionTypeChange.bind(this) )
    NetInfo.isConnected.removeEventListener( 'change', this._handleConnectivityChange.bind(this) )
  }

  _handleConnectionTypeChange(connectionType) {
    this.props.dispatch({type:'CONNECTION_CHANGE',payload: {connectionType}})
  }
  _handleConnectivityChange(isConnected) {
    this.props.dispatch({type:'CONNECTION_CHANGE',payload: {isConnected}})
  }
  render() {
    return <View style={{position:'absolute'}}/>
  }
}
