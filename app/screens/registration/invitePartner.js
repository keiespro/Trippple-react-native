import React from 'react-native'

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Component,
  Dimensions
}  from 'react-native'


var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;


import colors from '../../utils/colors'
import UserActions from '../../flux/actions/UserActions'
import BoxyButton from '../../controls/boxyButton'
import Contacts from '../contacts'
import Facebook from './facebook'
import BackButton from '../../components/BackButton'

class InvitePartner extends Component{
  constructor(props){
    super(props);
  }
  onPress(){
    this.props.navigator.push({
        component: Contacts,
       passProps: {
         nextRoute: Facebook
      }
     })
  }

  goBack(){
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{width:100,height:50,left:20,top:0,alignSelf:'flex-start',position:'absolute'}}>
          <BackButton navigator={this.props.navigator}/>
         </View>

        <View style={[styles.middleTextWrap,styles.pushDown]}>
          <Text style={[styles.middleText,{marginBottom:10}]}>Invite Your Partner </Text>
          <Text style={[styles.middleText,{marginBottom:50}]}>Select your Partner in your address book to invite them to Trippple</Text>
        </View>

        <BoxyButton
            text={"INVITE YOUR PARTNER"}
            leftBoxStyles={styles.iconButtonLeftBoxCouples}
            innerWrapStyles={styles.iconButtonCouples}
            underlayColor={colors.mediumPurple20}
            _onPress={this.onPress.bind(this)}>

            <Image source={require('image!ovalInvite')}
                      resizeMode={Image.resizeMode.contain}
                          style={{height:30,width:101}} />

        </BoxyButton>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    padding:0,
    height: DeviceHeight,
    position:'relative',
    width: DeviceWidth,
    backgroundColor: colors.outerSpace
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60,
    marginHorizontal:20
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 18,

    textAlign:'center',
  },
  middleTextSmall:{
    fontSize: 17
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
  goBackButton:{
    padding:10,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
  underPinInput: {
    marginTop: 10,
    height: 30,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
  },
  pushDown:{
    marginBottom:20
  }
});

export default InvitePartner;
