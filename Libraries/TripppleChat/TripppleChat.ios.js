/**
 * @providesModule TripppleChat
 * @flow
 */
'use strict';

var invariant = require('invariant');
// var NativeTripppleChat = require('NativeModules').TripppleChat;

var React = require('react-native');
var {
  View,
  PropTypes,
  StyleSheet,
  requireNativeComponent,
} = React;


type Props = {
  matchID: int;
}
// 
var NativeTripppleChat = requireNativeComponent('TripppleChat',TripppleChat);

/**
 * High-level docs for the TripppleChat iOS API can be written here.
 */

class TripppleChat extends React.Component{
  constructor(props){
    super(props);
  }
  
  propTypes: {
    matchID: React.PropTypes.number,
  }

  render(){
    return (<NativeTripppleChat messages={this.props.messages} matchID={this.props.matchID}/>)
  }
};

module.exports = TripppleChat;
