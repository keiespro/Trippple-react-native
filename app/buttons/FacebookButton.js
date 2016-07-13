import React from "react";
import {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, Dimensions,NativeMethodsMixin, View, NativeModules, requireNativeComponent, TouchableHighlight, Alert, TouchableOpacity} from "react-native";

import { FBLoginManager } from 'NativeModules'
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


  static Events = FBLoginManager.Events;

  static propTypes = {
    buttonText:PropTypes.string,
    buttonType: PropTypes.oneOf(['upload','connectionStatus','onboard','settings'])
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
      fbUser: null
    }
  }
  componentDidMount(){

    FBLoginManager.getCredentials((error, data)=>{
      if (!error) {
        this.setState({ fbUser : data.credentials });

      } else {
        this.setState({ fbUser : null });
      }
    });
  }
  componentWillUnmount(){
    var {subscriptions} = this.state;
    subscriptions && subscriptions.forEach(function(subscription){
      subscription.remove();
    });
  }
  componentDidUpdate(){

  }
  onPress(e){
    // this.handleLogout();
    // return
    if( !this.state.fbUser){
      FBLoginManager.getCredentials((error, data)=>{

        if (!error) {
          this.setState({ fbUser : data.credentials });
          this.props._onPress && this.props._onPress(data.credentials);
        } else {
          this.handleLogin();

          this.setState({ fbUser : null });

        }
      });
    }else{
      if(this.props.shouldLogoutOnTap){
        Alert.alert(
            'Log Out of Facebook',
            'Are you sure you want to log out of Facebook?',
            [
              {text: 'Yes', onPress: () => {this.handleLogout()}},
              {text: 'No', onPress: () => {return false}},
            ]
          )
        }
      this.props._onPress && this.props._onPress(this.state.fbUser);
    }

  }
  handleLogin(){

    // if(true){
      FBLoginManager.loginWithPermissions(["email","user_photos","user_friends"],  (error, data) => {
              if (!error && data && data.credentials) {

              this.setState({ fbUser : data.credentials});
              UserActions.updateUser({
                facebook_user_id: data.credentials.userId,
                facebook_oauth_access_token: data.credentials.token
              });
              this.props._onPress && this.props._onPress(this.state.fbUser);

              this.props.onLogin && this.props.onLogin(data);
            }else {
              // console.log(error,data);
              this.setState({ fbUser : null });
            }


        });


    // }else{
    //   FBLoginManager.login(  (error, data) => {
    //     if (!error && data) {
    //       this.setState({ fbUser : data.credentials});
    //       UserActions.updateUser({
    //         facebook_user_id: data.credentials.userId,
    //         facebook_oauth_access_token: data.credentials.token
    //       });
    //
    //       this.props.onLogin && this.props.onLogin(data);
    //     } else {
    //       this.setState({ fbUser : null });
    //     }
    //
    //
    //   });
    // }
  }

  handleLogout(){

    FBLoginManager.logout((error, data)=>{
      if (!error) {
        this.setState({ fbUser : null});
        this.props.onLogout && this.props.onLogout();

      } else {

      }
    });
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
      case 'settings':
        buttonText = this.state.fbUser ? `VERIFY NOW` : `VERIFY NOW`
      break;
    }

    // ( this.state.fbUser ? 'CONNECTED' : 'CONNECT WITH FB')
    return(

      <BoxyButton
        text={buttonText}
        buttonText={this.props.buttonTextStyle}
        outerButtonStyle={styles.iconButtonOuter}
        leftBoxStyles={styles.buttonIcon}
        innerWrapStyles={styles.button}
        underlayColor={colors.mediumPurple20}
        _onPress={this.onPress.bind(this)}>

          <Image source={{uri: 'assets/fBlogo@3x.png'}}
                    resizeMode={Image.resizeMode.cover}
                        style={{height:40,width:20}} />
        </BoxyButton>

    )

  }
}
reactMixin.onClass(FacebookButton, NativeMethodsMixin)

export default FacebookButton

const styles = StyleSheet.create({
  LogoBox: {
    width: 40
  },
  iconButtonOuter:{
    alignSelf:'stretch',
    flex:1,
    alignItems:'stretch',
    flexDirection:'row',
    marginVertical:15
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },

  button:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  buttonIcon: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
})
