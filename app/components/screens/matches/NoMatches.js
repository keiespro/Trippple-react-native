'user strict';

import { Text, Image, View, Dimensions, ScrollView } from 'react-native';
import React, {Component} from "react";

import FadeInContainer from '../../FadeInContainer';
import colors from '../../../utils/colors';

import {MagicNumbers} from '../../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class NoMatches extends Component{

  render(){
    return (
      <ScrollView
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth,paddingTop:60,height:DeviceHeight}}
       automaticallyAdjustContentInsets={true}
        style={{
          backgroundColor:colors.outerSpace,
          flex:1,
          alignSelf:'stretch',
          width:DeviceWidth
        }}
        >
        <FadeInContainer delayAmount={1000} duration={1000}>
          <View
            style={{flex:3,flexDirection:'column',padding:MagicNumbers.screenPadding/2,justifyContent:'flex-start',alignItems:'center',alignSelf:'stretch',paddingBottom:0,paddingTop: 20}}
            >
            <Image
              style={{width:DeviceWidth-MagicNumbers.screenPadding,
                height:MagicNumbers.is5orless ? 70 : 80,
                marginBottom:20 }}
              source={require('./assets/listing.png')}
              resizeMode={Image.resizeMode.contain}
            />
            <Image
              style={{width:DeviceWidth-MagicNumbers.screenPadding,
                height:MagicNumbers.is5orless ? 70 : 80,
                marginBottom:20 }}
              source={require('./assets/listing.png')}
              resizeMode={Image.resizeMode.contain}
              />
           <Image
              style={{width:DeviceWidth-MagicNumbers.screenPadding,
                height:MagicNumbers.is5orless ? 70 : 80,
                marginBottom:50 }}
              source={require('./assets/listing.png')}
              resizeMode={Image.resizeMode.contain}
            />

            <Text style={{
                color:colors.white,
                fontSize: MagicNumbers.is5orless ? 18 : 22,
                fontFamily:'montserrat',fontWeight:'800',textAlign:'center',marginBottom:20}}>{
              `WAITING FOR MATCHES`
            }</Text>
            <Text style={{color:colors.shuttleGray,fontSize:MagicNumbers.is5orless ? 18 : 20,fontFamily:'omnes',textAlign:'center'}}>{
              `Your conversations with your matches will appear in this screen.`
            }</Text>
          </View>
        </FadeInContainer>

      </ScrollView>
    )
  }
}

export default NoMatches;
