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
  View,
  Animated
} = React;
var CustomSceneConfigs = require('../utils/sceneConfigs')

var colors = require('../utils/colors');
var alt = require('alt');
var cssVar = require('cssVar');
var Chat = require("./chat");
var MatchActions = require("../flux/actions/MatchActions");
import MatchesStore from '../flux/stores/MatchesStore'

import Mixpanel from '../utils/mixpanel';
import FakeNavBar from '../controls/FakeNavBar';
import AppActions from '../flux/actions/AppActions'

  class Main extends Component{
    static propTypes = { user: React.PropTypes.any }

    static defaultProps = { user: null }

    constructor(props){
      super(props);

    }
    componentWillReceiveProps(nProps){
      console.log(nProps)
      console.log(this.refs.nav.navigationContext._currentRoute.id+' is the current route but should be '+nProps.currentRoute)

      if(nProps.currentRoute){
        if(nProps.currentRoute.route != this.refs.nav.navigationContext._currentRoute.id){
          this.refs.nav.push({
            ...ChatRoute,
            sceneConfig: Navigator.SceneConfigs.PushFromRight,
            passProps:{
              match_id: nProps.currentRoute.match_id,
              currentMatch: nProps.currentMatch,
              currentRoute: nProps.currentRoute,
            }
          })

        }
      }
    }
    componentWillMount(){
      // alt.bootstrap()
    }
    componentDidMount(){
      this.refs.nav.navigationContext.addListener('didfocus', (e)=>{
        console.log('New route:',e._data.route)
        // AppActions.updateRoute(e._data.route.id)
      })
    }

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      const RouteComponent = route.component;
      var navBar = route.navigationBar;
      Mixpanel.auth(this.props.user.username).track(`HO: On - ${route.id} Screen`);

      if (navBar) {
        navBar = React.addons.cloneWithProps(navBar, {
          navigator: navigator,
          route: route,
          style: styles.navBar,
        });
      }

      return (
        <View style={{ flex: 1, position:'relative'}}>
          {route.id == 'settings' && navBar}
          <RouteComponent navigator={navigator} route={route} navBar={navBar} AppState={this.props.AppState}
  {...route.passProps} user={this.props.user} pRoute={route.id == 'potentials' ? PotentialsRoute : null} />
          {route.id == 'potentials' || route.id == 'settings' || route.id == 'matches' ? null : navBar}
        </View>
      );
    }

    render() {

      return (
        <View style={styles.appContainer}>
          <Navigator
            ref={'nav'}
            initialRoute={ROUTE_STACK[0]}
            configureScene={route => route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom}
            navigator={this.props.navigator}
            renderScene={this.selectScene.bind(this)}
          />
        </View>
      );
    }

  }



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


const PotentialsRoute = {
  component: Potentials,
  index: 0,
  title: 'Trippple',
  id: 'potentials',
  navigationBar: (
    <FakeNavBar
      backgroundStyle={{backgroundColor:'transparent'}}
      customTitle={<Image resizeMode={Image.resizeMode.contain} style={{width:80}} source={require('../../newimg/tripppleLogoText.png')} />}
      onPrev={(navigator,route) => navigator.push(SettingsRoute)}
      customPrev={<Image resizeMode={Image.resizeMode.contain}  style={{width:28,top:-10,height:30,alignSelf:'flex-start',tintColor:colors.white,opacity:1}} source={require('../../newimg/gear.png')} />}
      onNext={(navigator,route) => {navigator.push(MatchesRoute)}}
      customNext={<Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30,alignSelf:'flex-end',tintColor:colors.white}} source={require('../../newimg/chat.png')} />}
    />)
};
const Yes = true;
const No  = false;

import {Theme, SCREEN_WIDTH, SCREEN_HEIGHT} from '../lib/Theme';

const DeckScrollViewOptions = {
  key: "Deck",
  flex: 1,
  scrollEventThrottle: 100,
  automaticallyAdjustContentInsets: Yes,
  snapToAlignment: "center",
  directionalLockEnabled: No,
  snapToInterval: SCREEN_HEIGHT/2,
  showsVerticalScrollIndicator: No,
  snapToAlignment: 'end',
  pagingEnabled: No,
  onScroll: (evt: nativeEvent) => {
              console.log('onScroll!',JSON.stringify(evt.nativeEvent.contentOffset),evt.nativeEvent.contentOffset.x,evt.nativeEvent.contentOffset.y);
            }

}

class Deck extends Component{
  render() {

    const Jake = (
      <View>
      <Animated.View
        key={`jake`}
        style={ {
            ...Theme.FullScreenContainer,
            backgroundColor:  colors.white,
            marginLeft: 15
        }}
        ref={''}>
        <Animated.Image
          source={{uri:"http://1.bp.blogspot.com/--eaCDQhqGQg/TkDCGj9sC7I/AAAAAAAAGkw/yXsraLKzdQc/s1600/Christina_Milian_Hot_In_Bikini_Picture_1024x768_216.jpg"}}
          key={`jake-img`}
          style={[Theme.FullSCreenImage]}
          resizeMode={Image.resizeMode.cover} />
        </Animated.View>
        </View>
    );

    return (
      <View style={Theme.Potentials.Housing}>
        <ScrollView
          {...DeckScrollViewOptions}
          style={[Theme.Potentials.Deck, Theme.Potentials.Card]}
          >
          <View key={'jk-1'}>{Jake}</View>
          <View key={'jk-2'}>{Jake}</View>
          <View key={'jk-3'}>{Jake}</View>
        </ScrollView>
      </View>
    );
  }
}

const demoRoute = {
  component: Deck,
  index: 0,
  title: 'Dante-Rocks',
  id: 'potentials',
  navigationBar: (<FakeNavBar/>)
};

const SettingsRoute = {
  component: Settings,
  index: 1,
  title: 'Settings',
  id: 'settings',
  navigationBar: (
    <FakeNavBar
      blur={true}
      backgroundStyle={{backgroundColor:colors.shuttleGray}}
      hideNext={true}

      customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}} source={require('../../newimg/close.png')}/>}
      onPrev={(nav,route)=> nav.pop()}
          title={'SETTINGS'}
          titleColor={colors.white}


    />)
}

const MatchesRoute = {

  component: Matches,
  index: 2,
  title: 'MESSAGES',
  id: 'matches',
  navigationBar: (
    <FakeNavBar
      hideNext={true}
      backgroundStyle={{backgroundColor:colors.shuttleGray}}
      titleColor={colors.white}

      title={'MESSAGES'} titleColor={colors.white}
      onPrev={(nav,route)=> nav.pop()}
      customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}} source={require('../../newimg/close.png')} />
      }
    />
  ),
    // sceneConfig: Navigator.SceneConfigs.FloatFromRight
}


const ChatRoute = {

  component: Chat,
  index: 2,
  title: 'Matches',
  id: 'matches',
  navigationBar: (
    <FakeNavBar
      hideNext={true}
      backgroundStyle={{backgroundColor:'transparent'}}
          titleColor={colors.white}

      blur={true}
      title={'Matches'} titleColor={colors.white}
      onPrev={(nav,route)=> nav.pop()}
      customPrev={   <View style={[styles.navBarLeftButton,{marginTop:10}]}>
          <Text textAlign={'left'} style={[styles.bottomTextIcon]}>◀︎ </Text>
          <Text textAlign={'left'} style={[styles.bottomText]}>Go back</Text>
        </View>
      }
    />
  ),
    // sceneConfig: Navigator.SceneConfigs.FloatFromRight
}
var MAIN = 0 == 0 ? demoRoute : PotentialsRoute;
var ROUTE_STACK = [MAIN];//,SettingsRoute,MatchesRoute];
