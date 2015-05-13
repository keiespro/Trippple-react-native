/* @flow */

'use strict';

var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

var {
  PixelRatio,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity,
  View,
} = React;

var cssVar = require('cssVar');
var Chat = require("./chat");
var ChatActions = require("../flux/actions/ChatActions");
var alt = require('../flux/alt')

var ROUTE_STACK = [
  {component: Settings, index: 0, title: 'Settings', id: 'settings'},
  {component: Potentials, index: 1, title: 'Potentials', id: 'potentials'},
  {component: Matches, index: 2, title: 'Matches', id: 'matches'},
];



  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {

      if(index == 3 || route.id == 'chat'){
        return (
          <TouchableOpacity
            onPress={() => navigator.pop()}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                back
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      return (
        <TouchableOpacity
          onPress={() => navigator.jumpTo(ROUTE_STACK[0])}>
          <View style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              settings
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    RightButton: function(route, navigator, index, navState) {
      if(index == 3 || route.id == 'chat') return null;
      return (
        <TouchableOpacity
          onPress={() => navigator.jumpTo(ROUTE_STACK[2])}>
          <View style={styles.navBarRightButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              matches
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    Title: function(route, navigator, index, navState) {
      if(index == 3 || route.id == 'chat') return null;

      return (
        <TouchableOpacity
          onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
          <View >
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              potentials
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

  };


  class Main extends React.Component{

    constructor(props){
      super(props);

    }



    selectScene(route, navigator){
        switch(route.id){
          case 'chat':
            return (<Chat style={styles.scene} route={route} matchID={route.passProps.matchID} navigator={navigator} />)
          case 'settings':
            return (<Settings style={styles.scene} route={route} navigator={navigator} />)
          case 'matches':
            return (<Matches user={this.props.user} style={styles.scene} route={route} navigator={navigator} />)
          case 'potentials':
          default:
            return (<Potentials style={styles.scene} route={route} navigator={navigator} />)
        }

    }

    render() {
      console.log('ren',ROUTE_STACK)
      return (
        <Navigator
          debugOverlay={true}
          key={'naaaaav'}
          initialRoute={ROUTE_STACK[1]}
          initialRouteStack={ROUTE_STACK}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.HorizontalSwipeJump
          }}
          style={styles.appContainer}
          renderScene={this.selectScene.bind(this)}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar}
            />
          }
        />
      );
    }

  }

  var styles = StyleSheet.create({
    messageText: {
      fontSize: 17,
      fontWeight: '500',
      padding: 15,
      marginLeft: 15,
    },
    appContainer: {
      overflow: 'hidden',
      backgroundColor: '#dddddd',
      flex: 1,
    },
    button: {
      backgroundColor: 'white',
      padding: 15,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: '#CDCDCD',
    },
    buttonText: {
      fontSize: 17,
      fontWeight: '500',
    },
    navBar: {
      backgroundColor: 'black',
      height: 60
    },
    navBarText: {
      fontSize: 16,
      marginVertical: 10,
    },
    navBarTitleText: {
      color: '#ffffff',
      fontWeight: '500',
      marginVertical: 9,
    },
    navBarLeftButton: {
      paddingLeft: 10,
    },
    navBarRightButton: {
      paddingRight: 10,
    },
    navBarButtonText: {
      color: '#dddddd'
    },
    scene: {
      flex: 1,
      paddingTop: 60,
      backgroundColor: '#ffffff',
      justifyContent: 'center'
    },
  });


module.exports = Main;
