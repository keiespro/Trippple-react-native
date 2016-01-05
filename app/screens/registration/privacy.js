import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Navigator,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import BoxyButton from '../../controls/boxyButton'
import OnboardingActions from '../../flux/actions/OnboardingActions'
import BackButton from './BackButton'
import {MagicNumbers} from '../../DeviceConfig'
import ContinueButton from '../../controls/ContinueButton'
import PrivacyPermissionsModal from '../../modals/PrivacyPermissions'

class PrivacyScreen extends Component{

  constructor(props){

    super(props);

    this.state = {
      selection: props.user && props.user.privacy || null
    }
  }

  _selectPublic(){

    this.setState({
      selection: this.state.selection == 'public' ? null : 'public'
    })
  }

  _selectPrivate(){
    if(this.state.selection != 'private'){
      this.props.navigator.push({
        component: PrivacyPermissionsModal,
        passProps:{
          ...this.props,
          success: () =>{
            this.setState({
              selection: 'private'
            })
            // this.props.navigator.pop()
            OnboardingActions.proceedToPrevScreen()

          },
          cancel: ()=>{
            // this.props.navigator.pop()
            OnboardingActions.proceedToPrevScreen()


          }
        },
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom
      }

      )
    }

  }
  _continue(){

    OnboardingActions.proceedToNextScreen({privacy: this.state.selection})

  }
  render() {

    return (
      <View style={[styles.container]}>
        <View style={{width:100,height:50,left:MagicNumbers.screenPadding/2,alignSelf:'flex-start'}}>
        <BackButton/>
      </View>

        <View style={styles.topWrap}>
          <Text style={[styles.labelText,{fontSize:22,marginBottom:5,color:colors.white,fontFamily:'Montserrat-Bold'}]}>{"YOUR PRIVACY"} </Text>

          <Text style={[styles.labelText,{fontSize:20,marginBottom:MagicNumbers.screenPadding/2}]}>{"Select your perfered privacy setting"}</Text>
          <TouchableHighlight
            underlayColor={this.state.selection == 'public' ? colors.mediumPurple : colors.mediumPurple20}
            style={{marginVertical:MagicNumbers.screenPadding/2}}
            onPress={this._selectPublic.bind(this)}>
            <View style={[styles.privacyWrap,
              (this.state.selection == 'public' ? styles.selectedbutton : null)]}>
              <Image
                source={this.state.selection == 'public' ? require('../../../newimg/ovalSelected.png') : require('../../../newimg/ovalDashed.png')}
                resizeMode={Image.resizeMode.contain}
                style={styles.cornerDot}
              />
              <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'space-around',flex:1,width:100}}>
                <Text style={styles.boxTitle}>PUBLIC</Text>
                <Text style={styles.boxP}>Your profile is visible to all Trippple members</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={this.state.selection == 'private' ? colors.mediumPurple : colors.mediumPurple20}
            style={{marginTop:MagicNumbers.screenPadding/2}}
            onPress={this._selectPrivate.bind(this)}>
            <View style={[styles.privacyWrap,
                (this.state.selection == 'private' ? styles.selectedbutton : null)]}>

              <Image
                source={this.state.selection == 'private' ? require('../../../newimg/ovalSelected.png') : require('../../../newimg/ovalDashed.png')}
                resizeMode={Image.resizeMode.contain}
                style={styles.cornerDot}
              />
              <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'space-around',flex:1,width:100}}>
                <Text style={styles.boxTitle}>PRIVATE</Text>
                <Text style={styles.boxP}>Your profile is hidden from your facebook friends and phone contacts. Facebook required.</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <ContinueButton canContinue={this.state.selection ? true : false} handlePress={this._continue.bind(this)} />
      </View>
    );
  }


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: DeviceHeight,
    width: DeviceWidth,
    padding:0,
    flexDirection:'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace
  },
  selectedbutton:{
    backgroundColor:colors.mediumPurple20,
    borderWidth:2,
    borderColor:colors.mediumPurple
  },

  boxTitle:{
    marginVertical:5,
    color: colors.white,
    fontSize:20,
    fontFamily:'Montserrat-Bold',
    textAlign: 'left',
  },
  boxP:{
    color: colors.white,
    fontFamily: 'Omnes',
    fontSize: 16,
    textAlign: 'left'
  },
  cornerDot: {
    height:30,
    width:30,
    marginLeft:10,
    marginRight:20
  },
  topWrap:{
    justifyContent: 'center',
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    alignSelf:'stretch',
  },
  privacyWrap:{
    justifyContent: 'flex-start',
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    alignSelf:'stretch',
    width: MagicNumbers.screenWidth,
    padding:10,
    borderWidth:2,
    borderColor:colors.shuttleGray,
    height:DeviceHeight > 568 ? 120 : 150,
    marginHorizontal:0
  },
  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'left',
  },
});

export default PrivacyScreen;
