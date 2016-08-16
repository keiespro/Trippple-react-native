import React from "react";
import {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, Dimensions,NativeMethodsMixin, View, NativeModules, requireNativeComponent, TouchableHighlight, Alert, TouchableOpacity} from "react-native";
import {MagicNumbers} from '../DeviceConfig'

import FBSDK from 'react-native-fbsdk'
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK

import colors from '../utils/colors'
import UserActions from '../flux/actions/UserActions'
import BoxyButton from '../controls/boxyButton'
import BackButton from '../components/BackButton'
import FBLogin from '../components/fb.login'
import reactMixin from 'react-mixin'
import AppActions from '../flux/actions/AppActions'

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const FACEBOOK_LOCALSTORAGE_KEY = 'facebook'

class FacebookButton extends React.Component{


  // static Events = LoginManager.Events;

  static propTypes = {
    buttonText:PropTypes.string,
    buttonType: PropTypes.oneOf(['login','upload','connectionStatus','onboard','settings'])
  };

  static defaultProps = {
    buttonText: 'FACEBOOK',
    shouldLogoutOnTap:false
  };
  // propTypes: {
  //  onPress:PropTypes.func,
  //   style: StyleSheetPropType(LayoutPropTypes),
  //   permissions: PropTypes.array, // default: ["public_profile", "email"]
  //   onLogin: PropTypes.func,
  //   onLogout: PropTypes.func,
  //   onLoginFound: PropTypes.func,
  //   onLoginNotFound: PropTypes.func,
  //   onError: PropTypes.func,
  //   onCancel: PropTypes.func,
  //   onPermissionsMissing: PropTypes.func,
  // },

  constructor(props){
    super()


    this.state = {
      subscriptions: [],
      fbUser: props.fbUser
    }
  }
  componentDidMount(){
    // LoginManager.setLoginBehavior(2)
    // LoginManager.getCredentials((error, data)=>{
    //   if (!error) {
    //     this.setState({ fbUser : data.credentials });
    //
    //   } else {
    //     this.setState({ fbUser : null });
    //   }
    // });
  }
  componentWillUnmount(){
    var {subscriptions} = this.state;
    // subscriptions && subscriptions.forEach(function(subscription){
    //   subscription.remove();
    // });
  }
  componentDidUpdate(){

  }
  onPress(e){


    const superPress = this.props.onPress || this.props._onPress;
    console.log(this.state.fbUser);
    if(this.props.shouldAuthenticate){

      LoginManager.logInWithReadPermissions([  'email', 'public_profile', 'user_birthday', 'user_friends', 'user_likes', 'user_location', 'user_photos']).then(fb => {
        console.log(fb);

          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data);
            this.setState({ fbUser : data });
            superPress(data);
          })

      }).catch(err =>{
        console.log(err);
      })

    }else{
      superPress();
    }
    if( !this.state.fbUser){
      

    }else{
      superPress(this.state.fbUser);

    }
  }

  render(){
    var buttonText = this.props.buttonText;
    switch(this.props.buttonType){
      case  'uploadImage':
        buttonText = 'UPLOAD FROM FB'
      break;
      case 'connectionStatus':
        buttonText = this.state.fbUser ? 'CONNECTED' : 'CONNECT WITH FB';
      break;
      case 'onboard':
        buttonText = this.state.fbUser ? `VERIFIED` : `VERIFY WITH FB`
      break;
      case 'login':
        buttonText =  `LOG IN WITH FACEBOOK`
      break;
      case 'settings':
        buttonText = this.state.fbUser ? `VERIFY NOW` : `VERIFY NOW`
      break;
    }

    // ( this.state.fbUser ? 'CONNECTED' : 'CONNECT WITH FB')
    return(

      <BoxyButton
        text={`LOG IN WITH FACEBOOK`}
        buttonText={this.props.buttonTextStyle}
        outerButtonStyle={styles.iconButtonOuter}
        leftBoxStyles={styles.buttonIcon}
        innerWrapStyles={styles.button}
        underlayColor={colors.cornFlower}
        _onPress={this.onPress.bind(this)}>

          <Image source={{uri: 'assets/fBlogo@3x.png'}}
                    resizeMode={Image.resizeMode.contain}
                        style={{height:30,width:20,}} />
        </BoxyButton>

    )

  }
}
reactMixin.onClass(FacebookButton, NativeMethodsMixin)

export default FacebookButton

const styles = StyleSheet.create({
  LogoBox: {
  },
  iconButtonOuter:{
    alignSelf:'stretch',
    flex:1,
    alignItems:'stretch',
    flexDirection:'row',
    height:MagicNumbers.is5orless ? 50 : 60,
    marginVertical:15,
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },

  button:{
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height:MagicNumbers.is5orless ? 50 : 60,

  },
  buttonIcon: {
    width:60,
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    backgroundColor: colors.cornFlower20,

  },
})
