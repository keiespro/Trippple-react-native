import React, {Component} from "react";
import {StyleSheet, Text, Image, Dimensions, View, TouchableHighlight, TouchableOpacity} from "react-native";

import colors from '../../utils/colors'
import UserActions from '../../flux/actions/UserActions'
import BoxyButton from '../../controls/boxyButton'
import FBPhotoAlbums from '../fb.login'
import {MagicNumbers} from '../../DeviceConfig'
import FacebookButton from '../../buttons/FacebookButton'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import OnboardingActions from '../../flux/actions/OnboardingActions'
import FBSDK from 'react-native-fbsdk'
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK

import Login from './login';

class Facebook extends Component{
  static propTypes = {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  };

  constructor(props){
    super()
    this.state ={
      user: null,
    }
  }
  componentDidMount(){
  }

 

  login(){

    this.props.dispatch(ActionMan.facebookAuth())
  }


  triggerPhoneLogin(){
    this.props.navigator.push({
      component:Login,
      title: 'Log in ',
      id:'login',
      passProps: {

      }
    });

  }

  render() {
    return (
      <View style={{width:DeviceWidth,height:DeviceHeight,backgroundColor:colors.outerSpace}}>

        <View style={[styles.container,{}]}>


          <View style={{alignSelf:'stretch'}}>

            <FacebookButton shouldAuthenticate={true} onPress={this.login.bind(this)}/>

            <View style={styles.middleTextWrap}>
              <Text style={[styles.middleText,{fontSize:16,marginTop:20,textAlign:'center',width:MagicNumbers.screenWidth}]}>We will never post without your permission</Text>
            </View>
          </View>
          <View style={[styles.middleTextWrap,styles.bottomwrap]}>
            {/*<TouchableOpacity
              onPress={this.skipFacebook.bind(this)}
              ><Text style={styles.middleText}>{this.state.fbUser ? 'Continue' : 'No thanks'}</Text>
            </TouchableOpacity>*/}
            {this.props.tab == 'login' && <TouchableOpacity onPress={this.triggerPhoneLogin.bind(this)}>
              <Text>Login</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf:'stretch',
    padding:MagicNumbers.screenPadding/2,
    paddingTop:0,
    backgroundColor: colors.outerSpace
  },
  LogoBox: {
    width: 40
  },
  iconButtonOuter:{
    alignSelf:'stretch',
    marginVertical:15
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color:colors.rollingStone,
    fontSize:20,
    fontFamily:'omnes',
    textAlign:'center',
    marginVertical:20
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  bottomwrap:{
  }
});
Facebook.displayName = 'Facebook'

export default Facebook;
