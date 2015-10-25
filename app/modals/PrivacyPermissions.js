/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  CameraRoll,
  View,
  TouchableHighlight,
  Dimensions,
  PixelRatio,
  TouchableOpacity
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'

export default class PrivacyPermissionsModal extends Component{

  constructor(props) {
    super();
    this.state = {
      hasFacebookPermissions: false,
      hasContactsPermissions: false
    }
  }
  cancel(){
    this.props.goBack();
  }
  continue(){
    this.props.navigator.push(this.props.nextRoute)
  }

  handleTapContacts(){
    this.setState({hasContactsPermissions:!this.state.hasContactsPermissions})
  }
  handleTapFacebook(){
    this.setState({hasFacebookPermissions:!this.state.hasFacebookPermissions})

  }

  render(){

    const {hasFacebookPermissions,hasContactsPermissions} = this.state

    return (
    <PurpleModal>
      <View style={[styles.col,{justifyContent:'space-around',paddingVertical:0}]}>
        <Image
          resizeMode={Image.resizeMode.contain}

          style={[{width:120,height:120,marginBottom:10,marginTop:30}]}
          source={require('image!iconPrivacyMask')} />

        <View style={styles.insidemodalwrapper}>
            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat-Bold',fontSize:20,marginVertical:0
              }]}>PROTECT YOUR PRIVACY</Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:18,marginVertical:10,color: colors.white,marginHorizontal:10
              }]}>
              Hide from your Facebook Friends and Phone Contacts
            </Text>

            <View style={{marginTop:10}}>



            <BoxyButton
              text={"BLOCK FACEBOOK"}
              buttonText={buttonStyles.buttonText}
              underlayColor={colors.mediumPurple20}
              innerWrapStyles={buttonStyles.innerWrapStyles}
              leftBoxStyles={  buttonStyles.grayIconbuttonLeftBox}

              _onPress={this.handleTapFacebook.bind(this)}>

              {hasFacebookPermissions ?
                      <Image source={require('image!checkmarkWhiteSmall') }
                        resizeMode={Image.resizeMode.cover}
                            style={{height:21,width:30}} /> :
                            <View style={{backgroundColor:colors.mediumPurple,height:20,width:20,borderRadius:10,alignSelf:'center'}} /> }
            </BoxyButton>

            <BoxyButton
                text={"BLOCK CONTACTS"}
                outerButtonStyle={buttonStyles.iconButtonOuter}
                buttonText={buttonStyles.buttonText}
                underlayColor={colors.mediumPurple20}
                innerWrapStyles={buttonStyles.innerWrapStyles}
                leftBoxStyles={ buttonStyles.grayIconbuttonLeftBox}
                _onPress={this.handleTapContacts.bind(this)}>

              {hasContactsPermissions ?
                <Image source={require('image!checkmarkWhiteSmall') }
                  resizeMode={Image.resizeMode.cover}
                      style={{height:21,width:30}} /> :
                      <View style={{backgroundColor:colors.mediumPurple,height:20,width:20,borderRadius:10,alignSelf:'center'}} /> }
          </BoxyButton>

          <View >
            <TouchableOpacity
              underlayColor={colors.mediumPurple}
              style={{marginTop:20,marginBottom:20}}
              onPress={this.props.cancel}>
              <View style={[styles.cancelButton,{backgroundColor:'transparent'}]} >
                <Text style={{color:colors.white,textAlign:'center'}}>no thanks</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>

      </PurpleModal>
    )
  }
}


const buttonStyles = StyleSheet.create({

  privacyStyle:{
    height:60,
  },
  innerWrapStyles:{
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius:10,
    overflow:'hidden',
    backgroundColor:colors.sapphire50
  },
  grayIconbutton:{
    borderColor: colors.purple,
    borderWidth: 1,
    alignSelf:'stretch',
    width: DeviceWidth * .7,
    flex:1

  },
  iconButtonOuter:{
    marginTop:10
  },
  grayIconbuttonLeftBox:{
    backgroundColor: '#582A99',
    borderRightColor: colors.purple,
    borderRightWidth: 1,
  },


  iconButtonMale:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1,
    width: DeviceWidth * .7,

  },
  iconButtonFemale:{
    borderColor: colors.mandy,
    borderWidth: 1,
    width: DeviceWidth * .7,

  },


  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  },

  buttonText:{
    color:colors.white,
    fontSize:18,
    fontFamily:'Montserrat-Bold'
},

})
