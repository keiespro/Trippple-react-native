/* @flow */

'use strict';

var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

// var GearIcon = require('./svg/icon-gear');

var {
  PixelRatio,
  Navigator,
  ScrollView,
  StyleSheet,
  InteractionManager,
  Text,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity,
  View
} = React;
var CustomSceneConfigs = require('../utils/sceneConfigs')

var alt = require('alt');
var cssVar = require('cssVar');
var Chat = require("./chat");
var MatchActions = require("../flux/actions/MatchActions");

var ROUTE_STACK = [
  {component: Settings, index: 0, title: 'Settings', id: 'settings'},
  {component: Potentials, index: 1, title: 'Trippple', id: 'potentials'},
  {component: Matches, index: 2, title: 'Matches', id: 'matches'},
];


  //this thing is ugly

  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {
      if(route.id == 'settings') return false;
      if(route.id == 'photo' || route.id == 'photo2'){
        return (
          <TouchableOpacity
            onPress={() => {
              // navigator.jumpTo(ROUTE_STACK[0]);
              navigator.popToTop();

//////// the worst way do do it
              // navigator.immediatelyResetRouteStack(ROUTE_STACK);

////////// for resetting the routestack if opening up tangential pages in the same Navigator
              // navigator.jumpBack();
              // InteractionManager.runAfterInteractions(() => {
                // navigator.replaceAtIndex(ROUTE_STACK[1],1);
                // navigator.replaceAtIndex(ROUTE_STACK[2],2);
                // console.log(navigator.getCurrentRoutes())
              // });

              }}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                V
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      if(route.id == 'chat'){
        return (
          <TouchableOpacity
            onPress={() => {
              navigator.pop();
              }}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                back
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      if(route.id == 'matches'){
        return (
          <TouchableOpacity
            onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                Trippple
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
              {/*<GearIcon/>*/}
              gear
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    RightButton: function(route, navigator, index, navState) {
      if(route.id == 'photo' || route.id == 'chat' || route.id == 'matches') return null;

      if(route.id == 'settings'){
        return (
          <TouchableOpacity
            onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                Trippple
              </Text>
            </View>
          </TouchableOpacity>
        )
      }
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

      return (

          <View >
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              {route.title}
            </Text>
          </View>
      );
    },

  };


  class Main extends React.Component{

    constructor(props){
      super(props);

    }

    componentDidMount(){
      MatchActions.InitializeMatches();
    }

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      return (<route.component {...route.passProps} navigator={this.props.navigator} user={this.props.user} />);
    }

    render() {
      console.log(Navigator.SceneConfigs)
      return (
        <View style={styles.appContainer}>
          <Navigator
              initialRoute={ROUTE_STACK[1]}
              initialRouteStack={ROUTE_STACK}
              configureScene={(route) => { return  route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.HorizontalSlide}}
              navigator={this.props.navigator}
              renderScene={this.selectScene.bind(this)}
              navigationBar={ <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} style={styles.navBar} /> }
              onItemRef={ (ref) => { console.log('onItemRef',ref) }}
              onDidFocus={(x,y)=>{console.log('onDIDfocus',x,y)}}
              onWillFocus={(x,y)=>{console.log('onwillfocus',x,y)}}
          />
      </View>
      );
    }

  }

  Main.propTypes = { user: React.PropTypes.any };
  Main.defaultProps = { user: null };




  var styles = StyleSheet.create({
    messageText: {
      fontSize: 17,
      fontWeight: '500',
      fontFamily:'omnes',
      padding: 15,
      marginLeft: 15,
    },
    appContainer: {
      backgroundColor: '#292834',
      flex: 1,

      alignSelf:'stretch'
    },
    button: {
      backgroundColor: 'white',
      padding: 15,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: '#CDCDCD',
      fontFamily:'omnes'

    },
    buttonText: {
      fontSize: 17,
      fontWeight: '500',
      fontFamily:'omnes'
    },
    navBar: {
      backgroundColor: '#292834',
      height: 50,
      justifyContent:'space-around',
      alignSelf: 'stretch',
      alignItems:'flex-start',
      flexDirection:'column'
    },
    navBarText: {
      fontSize: 16,
    },
    navBarTitleText: {
      color: '#ffffff',
      fontWeight: '500',
      fontFamily:'omnes',
      height: 50,

    },
    navBarLeftButton: {
      paddingLeft: 10,
      height: 50,

    },
    navBarRightButton: {
      paddingRight: 10,
      height: 50,

    },
    navBarButtonText: {
      color: '#dddddd',
      fontFamily:'omnes'
    },
    scene: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: '#292834',
      justifyContent: 'center'
    },
  });


module.exports = Main;
