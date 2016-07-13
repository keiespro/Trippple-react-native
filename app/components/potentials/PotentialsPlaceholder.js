/* @flow */

import React from "react";

import {StyleSheet, Text, View, Image, Dimensions, TouchableHighlight,Navigator} from "react-native";
import {MagicNumbers} from '../../DeviceConfig'
import FadeInContainer from '../FadeInContainer'
import colors from '../../utils/colors';
import styles from './styles'
import SettingsBasic from '../SettingsBasic'
import profileOptions from '../../get_client_user_profile_options'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class PotentialsPlaceholder extends React.Component{
  constructor(props){
    super()
  }
  onDidShow(){
          this.props.onDidShow(true)

  }
  openProfileEditor(){

    this.props.navigator.push({
      component: SettingsBasic,
      sceneConfig:Navigator.SceneConfigs.PushFromBottom,
      user:this.props.user,
      id:'settingsbasic',
      name: 'SettingsBasic GENERAL',
      passProps: {
        style:styles.container,
        settingOptions:profileOptions,
        user:this.props.user,
        startPage:1
      }
    })
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

              position: 'relative',
            }]}
          >

          <Image
          source={{uri: 'assets/placeholderDashed@3x.png'}}
            style={{
              alignSelf: 'stretch',

              height: MagicNumbers.is4s ? DeviceHeight-70 : DeviceHeight-55-MagicNumbers.screenPadding/2,
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
              source={{uri: 'assets/iconClock@3x.png'}}
              style={{
                height: MagicNumbers.is4s ? MagicNumbers.screenWidth/2 - 20 : MagicNumbers.screenWidth/2,
                width: MagicNumbers.is4s ? MagicNumbers.screenWidth/2 - 20 : MagicNumbers.screenWidth/2,
                marginBottom: MagicNumbers.is4s ? 0 : MagicNumbers.screenPadding,
                marginTop: MagicNumbers.is4s ? 40 : MagicNumbers.screenPadding*2
              }}
            />
            <Text
              style={{
                color: colors.white,
                fontFamily: 'Montserrat-Bold',
                fontSize:  (MagicNumbers.size18+2),
                marginVertical: 10
              }}
            >
            COME BACK AT MIDNIGHT
            </Text>
            <Text
              style={{
                color: colors.rollingStone,
                fontSize: MagicNumbers.size18,
                marginHorizontal: MagicNumbers.is5orless ? 30 : 70,
                marginBottom: 180,
                textAlign: 'center'
              }}
            >
              You’re all out of potential matches for today.
            </Text>

            {userProfileIncomplete &&
              <View style={{position:'absolute',bottom:0,alignSelf:'stretch',
              width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
            }}>
                <Text
                  style={{
                    color: colors.rollingStone,
                    fontSize: MagicNumbers.size18-2,
                    textAlign: 'center'
                  }}
                >
                  Get better matches...
                </Text>

                <TouchableHighlight
                onPress={this.openProfileEditor.bind(this)}
                underlayColor={colors.mediumPurple}
                 style={{justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:1,paddingVertical:15,borderColor:colors.white,marginTop:15,marginBottom:20,
                marginHorizontal:MagicNumbers.screenPadding}}>
                  <View>
                    <Text
                      style={{
                        color: colors.white,
                        textAlign: 'center',
                        fontFamily:'Montserrat-Bold'
                      }}
                    >
                      COMPLETE YOUR PROFILE
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

            }
          </Image>
        </View>
      </FadeInContainer>
    )
  }
}
export default PotentialsPlaceholder
