/* @flow */

'use strict';

var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

// var GearIcon = require('./svg/icon-gear');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var {
  PixelRatio,
  Navigator,
  ScrollView,
  StyleSheet,
  InteractionManager,
  Text,
  Image,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity,
  View
} = React;
var CustomSceneConfigs = require('../utils/sceneConfigs')

var colors = require('../utils/colors');
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
            style={[styles.touchables,styles.navBarLeftButton]}
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
          <View style={[styles.touchables,styles.navBarLeftButton]}>

            <TouchableOpacity

              onPress={() => navigator.pop(ROUTE_STACK[0]) }>
              <View style={styles.navBarLeftButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText]}>
                  back
                </Text>
              </View>
            </TouchableOpacity>
            </View>

        )
      }

      if(route.id == 'matches'){
        return (
          <View style={[styles.touchables,styles.navBarLeftButton]}>
            <TouchableOpacity
              onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:25,marginTop:2,height:25}} source={require('image!tripppleLogo')} />

            </TouchableOpacity>
          </View>
        )
      }

      return (
        <View style={[styles.touchables,styles.navBarLeftButton]}>

          <TouchableOpacity

            onPress={() => navigator.jumpTo(ROUTE_STACK[0])}>
              <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!gear')} />

          </TouchableOpacity>
        </View>

      );
    },

    RightButton: function(route, navigator, index, navState) {
      if(route.id == 'photo' || route.id == 'chat' || route.id == 'matches') return null;

      if(route.id == 'settings'){
        return (
          <View style={[styles.touchables,styles.navBarRightButton]}>
            <TouchableOpacity
              onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:25,marginTop:2,height:25}} source={require('image!tripppleLogo')} />
            </TouchableOpacity>
          </View>
        )
      }
      return (
        <View style={[styles.touchables,styles.navBarRightButton]}>

          <TouchableOpacity
            onPress={() => navigator.jumpTo(ROUTE_STACK[2])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!chat')} />
          </TouchableOpacity>
        </View>
      );
    },

    Title: function(route, navigator, index, navState) {
      if(route.id == 'potentials'){

        return (
            <View>
              <Image resizeMode={Image.resizeMode.contain} style={{width:80,top:-2}} source={require('image!tripppleLogoText')} />
            </View>
        );
      }else if(route.id == 'matches'){
           return (
            <View>
              <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!chat')} />
            </View>
          )
      }else if(route.id == 'settings'){
           return (
            <View>
              <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!gear')} />
            </View>
          )
      }
    },

  };


  class Main extends React.Component{

    constructor(props){
      super(props);

    }

    componentDidMount(){
      // MatchActions.InitializeMatches();
    }

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      return (<route.component {...route.passProps} navigator={this.refs.nav} user={this.props.user} />);
    }

    render() {
      console.log(Navigator.SceneConfigs)
      return (
        <View style={styles.appContainer}>
          <Navigator
            ref={'nav'}
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


    appContainer: {
      backgroundColor: colors.outerSpace,
      flex: 1,
      flexDirection:'column',
      justifyContent:'space-between',
      height:DeviceHeight,
      width:DeviceWidth,
    },
    touchables:{
      margin:0,
      top:0,
    },

    navBar: {
      backgroundColor: colors.outerSpace,
      height: 60,
      justifyContent:'space-between',
      alignSelf: 'flex-start',
      alignItems:'flex-start',
      flexDirection:'row',
      flex:1,
      top:-10,
      padding:0,
      overflow:'hidden',
      margin:0,
      borderColor:colors.shuttleGray,
      borderBottomWidth:1
    },
    navBarText: {
      fontSize: 16,
    },


    navBarLeftButton: {

      paddingLeft:10

    },
    navBarRightButton: {

      paddingRight:10,


    },
    navBarButtonText: {
      color: colors.white,
      fontFamily:'omnes'
    },
    scene: {
      flex: 1,
      paddingTop: 40,
      backgroundColor: colors.outerSpace,
      justifyContent: 'center'
    },
  });


module.exports = Main;
