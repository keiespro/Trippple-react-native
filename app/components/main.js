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
  TouchableOpacity,
  View,
} = React;

var cssVar = require('cssVar');


var ROUTE_STACK = [
  {component: Settings, index: 0, title: 'Settings'},
  {component: Potentials, index: 1, title: 'Potentials'},
  {component: Matches, index: 2, title: 'Matches'}
];



  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {


      return (
        <TouchableOpacity
          onPress={() => navigator.jumpTo(ROUTE_STACK[0])}>
          <View style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              s
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    RightButton: function(route, navigator, index, navState) {
      return (
        <TouchableOpacity
          onPress={() => navigator.jumpTo(ROUTE_STACK[2])}>
          <View style={styles.navBarRightButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              m
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    Title: function(route, navigator, index, navState) {
      return (
        <TouchableOpacity
          onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
          <View >
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              p
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

        switch(route.index){
          case 0:
            return (<Settings route={route} navigator={navigator} />)
          case 2:
            return (<Matches route={route} navigator={navigator} />)
          case 1:
          default:
            return (<Potentials route={route} navigator={navigator} />)
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
          configureScene={() => ({
            ...Navigator.SceneConfigs.HorizontalSwipeJump,
          })}
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
      marginTop: 50,
      marginLeft: 15,
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
      backgroundColor: 'white',
    },
    navBarText: {
      fontSize: 16,
      marginVertical: 10,
    },
    navBarTitleText: {
      color: cssVar('fbui-bluegray-60'),
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
      color: cssVar('fbui-accent-blue'),
    },
    scene: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#EAEAEA',
    },
  });


module.exports = Main;
