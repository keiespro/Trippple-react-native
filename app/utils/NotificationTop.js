
import React from 'react-native'
import { Image, Component, View, StyleSheet, Text } from 'react-native'
import colors from '../utils/colors'

import {BlurView} from 'react-native-blur';
import Overlay from 'react-native-overlay'


class Notification extends Component{

  constructor(props){
    super(props)
  }
  render(){
    console.log(this.props)
    return (
      <Overlay isVisible={true}>
        <BlurView style={styles.notificationOverlay} blurType="light">
          <View style={styles.notificationLeft}>
            <Image resizeMode={Image.resizeMode.contain} style={styles.notiImage} source={require('image!defaultuser')}/>
          </View>
          <View style={styles.notificationRight}>
            <Text style={styles.notiTitle}>Hello</Text>
            <Text style={styles.notiText}>This is a notification</Text>
          </View>
        </BlurView>
      </Overlay>
    )
  }
}

export default Notification

var styles = StyleSheet.create({
  notificationOverlay: {
    height:100,
    width:500,
    flex: 1,
    position:'absolute',
    top:0,
    left:0,
    padding: 20,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  notificationLeft:{
    width:80
  },
  notificationRight:{
    flex:1
  },

  notiText: {
    color:colors.white,
    fontFamily:'omnes',
    fontSize:22
  },

  notiTitle: {
    color:colors.white,
    fontFamily:'omnes',
    fontWeight:"500",

  },
  notiImage:{
    width:60,
    height:60,
    overflow:'hidden',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.white
  }

})
