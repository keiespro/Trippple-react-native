/*
* @providesModule trippple
* @flow
*/



var React = require('react-native');
var { Component, AppRegistry } = React;

var App = require('./app/components/app');

var AppRoot = '/Users/alexlopez/code/Trippple/Native/app/components/';
(function(global){
  global.AppRoot = AppRoot;
}(window ? window : global));
console.log(this);

class trippple extends Component{

  render(){
    return (
      <App key="app"/>
    );
  }

}

module.exports = trippple;

AppRegistry.registerComponent('trippple', () => trippple);

window.react = React;
