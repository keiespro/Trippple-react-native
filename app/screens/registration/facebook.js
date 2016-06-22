import React, {Component} from "react";
import {StyleSheet, Text, Image, Dimensions, View, TouchableHighlight, TouchableOpacity} from "react-native";

import colors from '../../utils/colors'
import UserActions from '../../flux/actions/UserActions'
import BoxyButton from '../../controls/boxyButton'
import BackButton from './BackButton'
import FBPhotoAlbums from '../../components/fb.login'
import {MagicNumbers} from '../../DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import OnboardingActions from '../../flux/actions/OnboardingActions'

import FacebookButton from '../../buttons/FacebookButton'


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

  handleCredentials(fbUserData){

    if(!fbUserData || fbUserData && !fbUserData.credentials ) { return false}

    var fbUser = fbUserData.credentials;
    this.setState({fbUser})
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}?fields=name,first_name,email,age_range,gender,timezone,locale,verified,updated_time&access_token=${fbUser.token}`;


    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {

        var {
          email,
          first_name,
          gender,
          facebook_id,
          verified,
          locale,
          age_range,
          timezone,
          updated_time
        } = responseData;

        const fbData = {
          fb_name: first_name,
          fb_gender: gender == 'male' ? 'm' : 'f',
          facebook_id,
          fb_verified:verified,
          fb_timezone: timezone,
          fb_updated_time:updated_time,
          fb_bday_year: new Date().getFullYear() - age_range.min
        }
        OnboardingActions.proceedToNextScreen(fbData);
        // UserActions.updateUser({email,timezone})


     })
     .catch((err) => {
       dispatch({error: err})
     })
  }


  skipFacebook(){
    OnboardingActions.proceedToNextScreen({});
  }

  render() {
    return (
      <View style={{width:DeviceWidth,height:DeviceHeight,position:'relative',backgroundColor:colors.outerSpace}}>

        <View style={[styles.container,{}]}>

          <View style={styles.middleTextWrap}>
            <Text style={styles.middleText}>Save time. Get more matches.</Text>
          </View>
          <View style={{alignSelf:'stretch'}}>
            <FacebookButton buttonType={'onboard'} buttonText={'VERIFY WITH FB'} onLogin={this.handleCredentials.bind(this)} />

            <View style={styles.middleTextWrap}>
              <Text style={[styles.middleText,{fontSize:16,marginTop:20,textAlign:'center',width:MagicNumbers.screenWidth}]}>Don’t worry, we won't ever tell your friends or post on your wall.</Text>
            </View>
          </View>
          <View style={[styles.middleTextWrap,styles.bottomwrap]}>
            <TouchableOpacity
              onPress={this.skipFacebook.bind(this)}
            ><Text style={styles.middleText}>No thanks</Text>
            </TouchableOpacity>
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

export default Facebook;
