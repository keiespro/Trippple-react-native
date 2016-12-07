import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Navigator,
  Dimensions, Text
} from 'react-native';
import React from 'react';
import FadeInContainer from '../../FadeInContainer';
import colors from '../../../utils/colors';
import Intro from './intro';
import TimerMixin from 'react-timer-mixin'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import CustomSceneConfigs from '../../../utils/sceneConfigs'
import Swiper from 'react-native-swiper'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


const Welcome = React.createClass({

  componentDidMount() {
      // this.refs.nav.navigationContext.addListener('willfocus', (e)=>{
      //   // dismissKeyboard();
      // })
  },

  renderScene(route, navigator) {
    return (
      <route.component
        {...route.passProps}
        dispatch={this.props.dispatch}
        key={route.id}
        navigator={navigator}
      />
    );
  },

  render() {
    return (
      <View style={{backgroundColor: colors.outerSpace, width: DeviceWidth, height: DeviceHeight}}>
        <StatusBar animated barStyle="light-content" hidden />
        <FadeInContainer
          delayAmount={global.__TEST__ ? 0 : 800}
          duration={global.__TEST__ ? 0 : 500}
        >

          <Navigator
            initialRoute={{
              component: Intro,
              title: 'intro',
              id: 'intro',
            }}
            key={'innerNav'}
            configureScene={route => (route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.VerticalSlide)}
            renderScene={this.renderScene}
          />

        </FadeInContainer>
      </View>
    );
  },


});

Welcome.displayName = 'Welcome'

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.mediumPurple,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: colors.mediumPurple
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: DeviceWidth,
    margin: 0,
    padding: 0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
  },
  textplain: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'omnes',
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: colors.white,
    alignSelf: 'center',
    fontFamily: 'montserrat'
  },
  carousel: {
    flex: 1,
    marginTop: 50,
  },
  slide: {
    width: DeviceWidth,
    flexDirection: 'column',
    height: DeviceHeight - 150,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    padding: MagicNumbers.screenPadding / 2
  },


  bottomarea: {
    height: 140,
    width: undefined,
    alignSelf: 'stretch',
    bottom: 100
  },
  textwrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagebg: {
    flex: 1,
    alignSelf: 'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  bottomButton: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: colors.shuttleGray,
  },
  activeButton: {
    backgroundColor: colors.outerSpace,
  },
  registerButton: {
    backgroundColor: colors.mediumPurple,
  },
  wrap: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: undefined,
    paddingBottom: 100
  },
  bottomButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    width: undefined
  },
  // dot: {
  //   backgroundColor: colors.shuttleGray,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderColor: colors.shuttleGray
  // },
  // activeDot: {
  //   backgroundColor: colors.mediumPurple20,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderWidth: 2,
  //   borderColor: colors.mediumPurple
  // }
});


export default Welcome
