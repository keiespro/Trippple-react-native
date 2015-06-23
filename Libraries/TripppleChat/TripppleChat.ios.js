/**
 * @providesModule TripppleChat
 * @flow
 */
'use strict';

var NativeTripppleChat = require('NativeModules').TripppleChat;
var invariant = require('invariant');

/**
 * High-level docs for the TripppleChat iOS API can be written here.
 */

var TripppleChat = {

  render: function(){
    
    return (<NativeTripppleChat/>)
  }
};

module.exports = TripppleChat;
