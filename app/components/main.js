/* @flow */


var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

// var GearIcon = require('./svg/icon-gear');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var {
  Component,
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
import FakeNavBar from '../controls/FakeNavBar'

var ROUTE_STACK = [
  {component: Settings, index: 0, title: 'Settings', id: 'settings',navigationBar:false},
  {component: Potentials, index: 1, title: 'Trippple', id: 'potentials'},
  {component: Matches, index: 2, title: 'Matches', id: 'matches',navigationBar:false,sceneConfig:Navigator.SceneConfigs.FloatFromRight},
];


  //this thing is ugly

  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {
      // if(route.id == 'matches' ){
      //    return (
      //      <View style={[styles.touchables,styles.navBarLeftButton]}>

      //        <TouchableOpacity onPress={() => navigator.jumpTo(ROUTE_STACK[1]) }>
      //          <View style={styles.navBarLeftButton}>
      //          <Image
      //            resizeMode={Image.resizeMode.contain}
      //            style={{width:15,height:15,marginTop:10,alignItems:'flex-start'}}
      //            source={require('image!close')} />
      //        </View>
      //        </TouchableOpacity>
      //        </View>

      //    )
      //  }

      if(route.id == 'potentials'){
        return (
          <View style={[styles.touchables,styles.navBarLeftButton]}>

            <TouchableOpacity onPress={() => navigator.jumpTo(ROUTE_STACK[0])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!gear')} />
            </TouchableOpacity>
          </View>
        )
      }


    },

    RightButton: function(route, navigator, index, navState) {
      if(route.id == 'photo' || route.id == 'chat' || route.id == 'matches') return null;

      if(route.id == 'potentials'){

      return (
        <View style={[styles.touchables,styles.navBarRightButton]}>

          <TouchableOpacity
            onPress={() => navigator.jumpTo(ROUTE_STACK[2])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!chat')} />
          </TouchableOpacity>
        </View>
        );
      }
    },

    Title: function(route, navigator, index, navState) {
      if(route.id == 'potentials'){

        return (
            <View>
              <Image resizeMode={Image.resizeMode.contain} style={{width:80,top:-2}} source={require('image!tripppleLogoText')} />
            </View>
        );
      }
    },

  };


  class Main extends Component{

    constructor(props){
      super(props);

    }

    componentDidMount(){
      // MatchActions.InitializeMatches();
      this.refs.nav.navigationContext.addListener('didfocus', (e)=>{
        console.log(e);
      })
    }

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
        const RouteComponent = route.component;
        let navBar = route.navigationBar
        if (route.id == 'disabled' || route.id == 'matches' || route.id == 'chat') {
          navBar = <FakeNavBar  navigator={navigator} route={route} {...route.passProps} />
        }
        return (
          <View style={{ flex: 1, }}>
            {navBar}
            <RouteComponent navigator={navigator} route={route} user={this.props.user}  {...route.passProps} />
          </View>
        );
    }

    render() {

      return (
        <View style={styles.appContainer}>
          <Navigator
            ref={'nav'}
              initialRouteStack={ROUTE_STACK}
              initialRoute={ROUTE_STACK[1]}
              configureScene={route => route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom}
              navigator={this.props.navigator}
              renderScene={this.selectScene.bind(this)}
              navigationBar={
                <Navigator.NavigationBar
                  routeMapper={NavigationBarRouteMapper}
                  style={[styles.navBar ]} />
              }
          />
      </View>
      );
    }

  }

  Main.propTypes = { user: React.PropTypes.any };
  Main.defaultProps = { user: null };




  var styles = StyleSheet.create({


    appContainer: {
      backgroundColor: '#000',
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
      backgroundColor: 'transparent',
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
      borderBottomWidth:0
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
