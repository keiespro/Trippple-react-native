'use strict';

import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeModules
} from 'react-native';
import React from "react";

import FadeInContainer from '../../FadeInContainer';
import SettingsBasic from '../settings/SettingsBasic';
import colors from '../../../utils/colors';
import styles from './styles';
import config from '../../../../config'
import profileOptions from '../../../data/get_client_user_profile_options'
import {MagicNumbers} from '../../../utils/DeviceConfig'
const {FBAppInviteDialog} = NativeModules
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const {INVITE_FRIENDS_APP_LINK} = config
class PotentialsPlaceholder extends React.Component{
  constructor(props){
    super()
  }
  onDidShow(){
    this.props.onDidShow && this.props.onDidShow(true)
  }
  openProfileEditor(){

    this.props.navigator.push(this.props.navigation.router.getRoute('SettingsBasic',{
      style:styles.container,
      settingOptions:profileOptions,
      startPage:1,
    }))
  }

  inviteFriends(){
    FBAppInviteDialog.show({applinkUrl: INVITE_FRIENDS_APP_LINK})
  }

  render(){
    const {user} = this.props;
    const attrs = ['drink', 'smoke', 'height', 'body', 'ethnicity', 'eye_color', 'hair_color'];
    const userProfileIncomplete = attrs.reduce((acc,el)=>{
      if(!user[el]){
        return true
      }else{
        return false
      }
    },false);

    return (
        <FadeInContainer
          delayAmount={2000}
          duration={300}
          didShow={this.onDidShow.bind(this)}
        >
          <View
            style={[
              styles.dashedBorderImage,
              {
                height: DeviceHeight,
                width:DeviceWidth,
                backgroundColor:colors.outerSpace,
                position: 'relative',
              }]}
            >

            <Image
              source={{uri: 'assets/placeholderDashed@3x.png'}}
              style={{
                alignSelf: 'stretch',
                height: MagicNumbers.is5orless ? DeviceHeight-90 : DeviceHeight-55-MagicNumbers.screenPadding/2,
                marginHorizontal: MagicNumbers.is4s ? MagicNumbers.screenPadding : 15,
                marginVertical: MagicNumbers.is4s ? MagicNumbers.screenPadding : 15,
                width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                flexDirection: 'column',
              }}
              resizeMode={MagicNumbers.is4s ? Image.resizeMode.stretch : Image.resizeMode.contain}
            >
              <Image
                source={{uri: 'assets/tripppleLogoCopy@3x.png'}}
                style={{
                  alignSelf: 'center',
                  height: 160,
                  width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom:50
                }}
                resizeMode={Image.resizeMode.contain}
              />
              <Text
                style={{
                  color: colors.white,
                  fontSize: MagicNumbers.size18+2,
                  textAlign: 'center',
                  fontFamily:'Montserrat-Bold',
                }}>YOU'RE OUT OF MATCHES</Text>

              {userProfileIncomplete && 
                <Button 
                  btnText={'COMPLETE YOUR PROFILE'}
                  labelText={`GET MORE MATCHES`}
                  onTap={this.openProfileEditor.bind(this)}
                />
              }

              {!userProfileIncomplete && 
                <Button 
                  btnText={'INVITE FRIENDS'}
                  onTap={this.inviteFriends.bind(this)}
                />
              }

          </Image>
        </View>
      </FadeInContainer>
    )
  }
}

const Button = ({labelText,btnText,onTap}) => (
    <View 
      style={{alignSelf:'stretch',
        marginTop:30,
        width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
      }}
    >
      {labelText && 
        <Text
          style={{
            color: colors.rollingStone,
            fontSize: MagicNumbers.size18-2,
            textAlign: 'center'
          }}
        >{labelText}</Text> 
      }

    <TouchableOpacity
      onPress={onTap}
      style={{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        borderWidth:1,
        paddingVertical:15,
        borderColor:colors.white,
        marginTop:15,
        marginBottom:20,
        marginHorizontal:MagicNumbers.screenPadding
      }}
    >
      <View>
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontFamily:'Montserrat-Bold'
          }}
        >
          {btnText}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

PotentialsPlaceholder.displayName = "PotentialsPlaceholder"
export default PotentialsPlaceholder
