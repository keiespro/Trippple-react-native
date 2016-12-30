import React, {Component} from 'react';
import {StyleSheet, BackAndroid, Text, View, Platform, Dimensions, TouchableOpacity} from 'react-native';
import colors from '../../../utils/colors'
import Carousel from './carousel'
import Analytics from '../../../utils/Analytics'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import FacebookButton from '../../buttons/FacebookButton/welcomeScreen';
import ActionMan from '../../../actions/'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


@reactMixin.decorate(TimerMixin)
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


  }





  whyFacebookModal(){
    this.props.dispatch(ActionMan.showInModal({component: 'WhyFacebook', passProps: {} }))
  }


  login(){
    this.setState({busy: true})
    this.setTimeout(()=>{
      this.setState({busy: false})
    },2000)

    this.props.dispatch(ActionMan.loginWithFacebook())
  }

  render(){
    return (
      <View style={[styles.container]}>
        <View>
          <Carousel/>
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
            busy={this.state.busy}
          />
        <TouchableOpacity
          style={{marginVertical: 20, height:30,width:100,zIndex:9999}}
          onPress={this.whyFacebookModal.bind(this)}
        >
          <View>
            <Text
              style={{
                color: colors.rollingStone,
                fontFamily: 'omnes',
                fontSize: 12,
                textDecorationLine: 'underline',
                textAlign:'center'
              }}
            >Why Facebook?</Text>
          </View>
        </TouchableOpacity>
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
    height: 140,
    alignItems: 'center',
    justifyContent: 'space-around',
    //
    alignSelf: 'stretch',
    width: undefined,
    marginBottom: 20
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
