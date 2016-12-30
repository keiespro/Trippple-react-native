import { StyleSheet, Image, Platform, View, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { BlurView, VibrancyView } from 'react-native-blur'
import colors from '../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const BlurModal = ({children, backgroundColor = 'transparent'}) => (

  <View
    style={{flexGrow: 1}}
  >
    {iOS && <VibrancyView blurType="dark" style={localstyles.blurstyle} />}


    <ScrollView

      showsVerticalScrollIndicator={false}
      style={[localstyles.modalscroll,{
        backgroundColor
      }]}
      contentContainerStyle={localstyles.modalscrollcontainer}
    >
      {children}
    </ScrollView>


  </View>
)


export default BlurModal

const localstyles = StyleSheet.create({
  blurstyle: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    width: DeviceWidth,
    height: DeviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  modalscroll: {
    // padding: 0,
    width: DeviceWidth,
    height:DeviceHeight,

    flexGrow: 1,
    position: 'absolute'
  },
  modalscrollcontainer: {
    // justifyContent:'center',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: DeviceWidth,
    height: DeviceHeight,
    // position:'absolute'
    // alignItems:'center',
    // height:DeviceHeight,width:DeviceWidth
  }
})
