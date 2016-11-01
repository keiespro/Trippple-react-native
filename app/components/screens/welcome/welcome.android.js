import React, {Component} from 'react';
import {StyleSheet, BackAndroid, Text, View, Platform, Dimensions, TouchableOpacity} from 'react-native';
import colors from '../../../utils/colors'
import Carousel from './carousel'
import Analytics from '../../../utils/Analytics'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import FacebookButton from '../../buttons/FacebookButton/welcomeScreen';
import ActionMan from '../../../actions/'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class Welcome extends Component{
  static displayName: 'Intro';

  constructor() {
    super()
    this.state = {isAnimating: false}
  }

  componentDidMount() {
      // setTimeout(() => {
    Analytics.screen('Welcome Screen')
      // }, 1000);
    if(!iOS){
      this._backandroid = BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid)
    }
  }

  componentWillUnmount(){
    if(this._backandroid){
      this._backandroid.remove()
      // BackAndroid.EventListener('hardwareBackPress', this.handleBackAndroid)
    }
  }

  handleBackAndroid(){
    this.props.navigator.pop();
    return true;
  }

  whyFacebookModal(){
    this.props.dispatch(ActionMan.showInModal({component: 'WhyFacebook', passProps: {} }))
  }


  login(){
    this.props.dispatch(ActionMan.loginWithFacebook())
  }

  render(){
    return (
      <View style={[styles.container]}>
        <View>
          <Carousel/>

          <TouchableOpacity
            style={{position: 'absolute', bottom: 0, right: 5}}
            onPress={this.whyFacebookModal.bind(this)}
          >
            <Text
              style={{
                color: colors.rollingStone,
                fontFamily: 'omnes',
                fontSize: 12,
                textDecorationLine: 'underline'
              }}
            >Why Facebook?</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.bottomButtons}>

          <FacebookButton
            shouldAuthenticate
            buttonText={'LOG IN WITH FACEBOOK'}
            onPress={this.login.bind(this)}
            buttonStyles={{backgroundColor: colors.cornFlower, borderWidth: 0, height: 80}}
            outerButtonStyle={{height: 100, marginVertical: 0}}
            leftBoxStyles={{height: 80}}
            iconTintColor={'#fff'}

          />
        </View>
      </View>
    )
  }
}


export default Welcome

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    borderWidth: 2,

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
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  container: {
    width: DeviceWidth,
    margin: 0,
    padding: 0,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignSelf: 'stretch',

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
    marginTop: 0,
    width: DeviceWidth,
    height: DeviceHeight - 200,

  },
  slide: {
    width: DeviceWidth,
    flexDirection: 'column',
    height: DeviceHeight - 150,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    height: 50,
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
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingBottom: 0
  },
  bottomButtons: {
    height: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor:'red',
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
