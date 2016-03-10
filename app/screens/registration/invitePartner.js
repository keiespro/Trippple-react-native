import React, {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
  Navigator
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import OnboardingActions from '../../flux/actions/OnboardingActions'
import colors from '../../utils/colors'
import UserActions from '../../flux/actions/UserActions'
import BoxyButton from '../../controls/boxyButton'
import Contacts from '../contacts'
import Facebook from './facebook'
import BackButton from './BackButton'
import {MagicNumbers} from '../../DeviceConfig'

class InvitePartner extends React.Component{
  constructor(props){
    super(props);
  }
  onPress(){

    this.props.navigator.push({
      component: Contacts,
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{width:100,height:50,left:MagicNumbers.screenPadding/2,alignSelf:'flex-start',position:'absolute',top:0}}>
          <BackButton />
         </View>

        <View style={[styles.middleTextWrap,styles.pushDown]}>
          <Text style={[styles.middleText,{marginBottom:10}]}>Invite Your Partner </Text>
          <Text style={[styles.middleText,{marginBottom:50}]}>Select your Partner in your address book to invite them to Trippple</Text>
        </View>

        <BoxyButton
            text={"INVITE YOUR PARTNER"}
            leftBoxStyles={styles.iconButtonLeftBoxCouples}
            innerWrapStyles={styles.iconButtonCouples}
            outerButtonStyle={{
              alignSelf:'stretch',
              flexDirection:'row',
              marginHorizontal:MagicNumbers.screenPadding/2
            }}
            underlayColor={colors.mediumPurple20}
            _onPress={this.onPress.bind(this)}>

            <Image source={{uri: 'assets/ovalInvite@3x.png'}}
                      resizeMode={Image.resizeMode.contain}
                          style={{height:30,width:101}} />

        </BoxyButton>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    marginBottom:50
  }
});

export default InvitePartner;
