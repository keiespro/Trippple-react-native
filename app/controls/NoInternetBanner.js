import React, { View, Text, Image, Dimensions } from 'react-native'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'

class NoInternetBanner extends React.Component{


  render(){
    return (
      <View style={{backgroundColor:colors.mandy,flexDirection:'row',height:80,width:DeviceWidth,position:'absolute',alignItems:'center',justifyContent:'space-around',top:0,left:0,right:0}}>

        <Image
          source={require('../../newimg/iconWifi.png')}
          resizeMode={Image.resizeMode.cover}
          style={{width:40,height:31,marginHorizontal: 30}}
        />

      <View style={{flexDirection:'column',flex:1}}>
          <Text style={{fontFamily:'MONTSERRAT',color:colors.white}}>NO NETWORK CONNECTION</Text>
          <Text style={{fontFamily:'omnes',color:colors.white}}>We can’t detect an internet connection.</Text>
        </View>

      </View>
    )


  }
}
export default NoInternetBanner
