/* @flow */


import React, {Component, PropTypes} from "react";
import { StyleSheet, Image, Text, ActivityIndicator, View, TouchableHighlight, NativeModules, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'
import styles from '../modals/purpleModalStyles'
import BlurModal from '../modals/BlurModal'
import BackButton from '../components/BackButton'

const { RNMessageComposer } = NativeModules;

class CouplePin extends React.Component{

  handleSendMessage(){
    RNMessageComposer.composeMessageWithArgs(
      {
        'messageText':'Come join me on Trippple! ',
        'recipients':[]
      },
      (result) => {
        switch(result) {
          case RNMessageComposer.Sent:
            console.log('SENT')
            break;
          case RNMessageComposer.Cancelled:
            break;
          case RNMessageComposer.Failed:
            break;
          case RNMessageComposer.NotSupported:
            break;
          default:
            break;
        }
      }
    );
  }
  render(){
    const couple = this.props.couple;

    return (
      <BlurModal user={this.props.user}>
          <View style={{width:100,height:50,left:10,top:-10,alignSelf:'flex-start'}}>
             <BackButton navigator={this.props.navigator}/>
           </View>
           <View style={[{width:DeviceWidth, paddingTop:50,paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

          <View style={{height:120,marginVertical:30,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <View
              style={{width:116,height:116,borderRadius:60,marginRight:-100,borderColor:colors.white,borderWidth:3,borderStyle:'dashed'}} ></View>
            <Image style={[{width:120,height:120,borderRadius:60,marginLeft:-100}]}
              source={ {uri: this.props.user.image_url} }
              defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
          </View>

          <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10 }]}>
            YOUR COUPLE CODE
          </Text>

          <View style={{flexDirection:'column' }} >
            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,
                marginVertical:10,
                color:'#fff',
                marginBottom:15,
                flexDirection:'column'
              }]}>
              Share this number with your partner to help them connect with you on trippple.
            </Text>
          </View>

          <Text style={[styles.rowtext,styles.bigtext,{
              fontSize:50,
              marginVertical:30,
              color:'#fff',
              fontFamily:'Montserrat-Bold',
            }]}>
            {couple.pin}
          </Text>

          <View style={{}}>
            <TouchableHighlight
              style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:10,marginTop:20,marginBottom:15}}
              onPress={this.handleSendMessage.bind(this)}>
              <View style={{paddingVertical:20,}} >
                <Text style={{fontFamily:'Montserrat-Bold', fontSize:18,textAlign:'center', color:'#fff',}}>
                  TEXT CODE TO MY PARTNER
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <TouchableOpacity
            onPress={()=>{
              const currentRoutes = this.props.navigator.getCurrentRoutes();
              if(currentRoutes[1].id == 'Settings'){
                this.props.navigator.popToRoute(currentRoutes[1]);
              }
            }}>
             <Text style={{ fontSize:16,textAlign:'center', marginTop:40,color:colors.rollingStone,}}>
                Skip
              </Text>
           </TouchableOpacity>
        </View>

      </BlurModal>
    )
  }
}


export default CouplePin
