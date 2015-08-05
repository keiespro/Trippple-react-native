/*
* @providesModule trippple
* @flow
*/

'use strict';

var React = require('react-native');
var {
  AppRegistry
} = React;

var App = require('./app/components/app.js');

var AppRoot = '/Users/alexlopez/code/Trippple/Native/app/components/';
(function(global){
  global.AppRoot = AppRoot;
}(window ? window : global));
console.log(this);
class trippple extends React.Component{

  render(){
    return (
      <App key="app"/>
    );
  }

}

module.exports = trippple;

AppRegistry.registerComponent('trippple', () => trippple);

window.react = React;
