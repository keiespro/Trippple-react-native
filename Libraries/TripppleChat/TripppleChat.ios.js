/**
 * @providesModule TripppleChat
 * @flow
 */
'use strict';

var invariant = require('invariant');

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

var NativeTripppleChat = requireNativeComponent('TripppleChat',TripppleChat);

/**
 * High-level docs for the TripppleChat iOS API can be written here.
 */

class TripppleChat extends React.Component{
  propTypes: {
    matchID: React.PropTypes.number,

  }
  render(){
    
    return (<NativeTripppleChat matchID="30"/>)
  }
};

module.exports = TripppleChat;
