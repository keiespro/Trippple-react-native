import React from 'react';

function mockComponent(type) {
  const Component = React.createClass({
    displayName: type,
    propTypes: { children: React.PropTypes.node },
    render() { return React.createElement(React.DOM.div, this.props, this.props.children); },
  });
  return Component;
}

const componentsToMock = [
  'View',
  'Text',
  'Component',
  'ScrollView',
  'TextInput',
  'TouchableHighlight',
];


class Dimensions {
  static get(what){
    return {
      width: 640,
      height:7000
    }
  }
}
class Navigator{
  SceneConfigs(){
    return {}
  }
}
class PixelRatio {
  static get(what){
    return 0.1
  }
}
const   Platform = {
  OS:'iOS'
}
global.navigator = {
  geolocation: {
    get(){ }
  }
}
class NativeModules {
  static RnAppInfo(){
    return {}
  }
  static DeviceUtil(){
    return {}
  }
}
class  FileTransfer{
  static upload(){
    return {}
  }
}
class  RNAppInfo{
  static getInfoiOS(){
    return {}
  }
}
const ReactNativeAutoUpdater = {
  jsCodeVersion:'0.0'
}

NativeModules.FileTransfer = FileTransfer
NativeModules.ReactNativeAutoUpdater = ReactNativeAutoUpdater
NativeModules.RNAppInfo = RNAppInfo

const MockComponents = componentsToMock.reduce((agg, type) => {
  agg[type] = mockComponent(type);
  return agg;
}, {});

class Image extends React.Component{
  static resizeMode = {
    cover:'cover',
    contain:'contain'
  };
  static displayName = 'Image';
  static propTypes = { children: React.PropTypes.node };
  render() {
    return React.createElement(React.DOM.div, this.props, this.props.children);
  }
}

class LayoutAnimation{
  static Types = {
    easeInEaseOut: ''
  };
  static Presets = {
    easeInEaseOut: ''
  };
  static Properties = {
    opacity: ''
  };
  static configureNext = ()=>{};
}

MockComponents.Platform = Platform;
MockComponents.NativeModules = NativeModules;
MockComponents.PixelRatio = PixelRatio;
MockComponents.Dimensions = Dimensions;
MockComponents.Navigator = Navigator;
MockComponents.LayoutAnimation = LayoutAnimation;
MockComponents.Image = Image;

exports.MockComponents = MockComponents

var ReactNative = {
  ...React,
  ...MockComponents,
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
  dismissKeyboard:function(){ return true}
};

module.exports = ReactNative;

exports.BlurView = mockComponent('View')
exports.dismissKeyboard = function(){ return true}
