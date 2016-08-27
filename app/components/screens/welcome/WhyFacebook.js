import { StyleSheet, Text, Dimensions, View, TouchableOpacity,ScrollView,Image } from 'react-native';
import React, { Component } from "react";
import {BlurView} from 'react-native-blur'

import colors from '../../../utils/colors'
import { MagicNumbers } from '../../../utils/DeviceConfig'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class WhyFacebook extends Component {

  static propTypes = {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  };

  constructor(props) {
    super()

  }

  render() {
    return (
      <BlurView blurType="dark">
        <ScrollView style={ { width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.transparent,padding:MagicNumbers.screenPadding} }>
          <View style={{flexDirection:'column',justifyContent:'space-around',height: DeviceHeight-50,flex:1}}>
            <Text style={[styles.allText,styles.titleText,{textAlign:'center',marginTop:20}]}>WHY FACEBOOK?</Text>
            <View>
              <Text style={[styles.allText,styles.titleText,{}]}>USER PRIVACY</Text>
              <Text style={[styles.allText,{}]}>By singing up with Facebook, we can block your profile from your Facebook friends.</Text>
            </View>
            <View>
              <Text style={[styles.allText,styles.titleText,{}]}>NO FAKE USERS</Text>
              <Text style={[styles.allText,{}]}>Facebook does a pretty good job at purging fake users. Signing up with Facebook lowers the chances of fake users joining Trippple.</Text>
            </View>
            <TouchableOpacity style={{backgroundColor:colors.shuttleGray,padding:10,alignSelf:'center',borderRadius:50}} onPress={(x)=>{ this.props.navigator.pop()}}>
              <Image source={{uri: 'assets/close.png'}} style={{width:15,height:15}}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BlurView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: MagicNumbers.screenPadding / 2,
    paddingTop: 0,
    backgroundColor: colors.outerSpace
  },
  LogoBox: {
    width: 40
  },
  iconButtonOuter: {
    alignSelf: 'stretch',
    marginVertical: 15
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },
  allText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'omnes',
    textAlign: 'left',
  },
  titleText:{
    fontSize:16,
    fontFamily: 'Montserrat-Bold',

  },
  iconButtonCouples: {
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  bottomwrap: {
  }
});

export default WhyFacebook;
