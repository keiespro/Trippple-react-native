/* @flow */

import React, {Component} from "react";

import {StyleSheet, Text, Image, View, Dimensions, ScrollView} from "react-native";

import colors from '../../utils/colors'
import FadeInContainer from '../FadeInContainer'
import {MagicNumbers} from '../../DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class NoMatches extends Component{

  render(){
    return (
      <ScrollView
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth, height:DeviceHeight}}
        scrollEnabled={false}
        centerContent={true}
        style={{
          backgroundColor:colors.outerSpace,
          flex:1,
          alignSelf:'stretch',
          width:DeviceWidth
        }}
        >
        <FadeInContainer delayAmount={1000} duration={1000}>
          <View
            style={{flex:1,flexDirection:'column',padding:20,justifyContent:'center',alignItems:'center',alignSelf:'stretch',paddingBottom:80,}}
            >
            <Image
              style={{width:300,
                height:MagicNumbers.is4s ? 70 : 100,
                marginBottom:0 }}
              source={{uri: 'assets/listing@3x.png'}}
              resizeMode={Image.resizeMode.contain}
            />
            <Image
              style={{width:300,
                height:MagicNumbers.is4s ? 70 : 100,
                marginBottom:20 }}
              source={{uri: 'assets/listing@3x.png'}}
              resizeMode={Image.resizeMode.contain}
            />
            <Text style={{
                color:colors.white,
                fontSize: MagicNumbers.is4s ? 18 : 22,
                fontFamily:'Montserrat-Bold',textAlign:'center',marginBottom:20}}>{
              `WAITING FOR MATCHES`
            }</Text>
            <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes',textAlign:'center'}}>{
              `Your conversations with your matches will appear in this screen`
            }</Text>
          </View>
        </FadeInContainer>

      </ScrollView>
    )
  }
}

export default NoMatches;
