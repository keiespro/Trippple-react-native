'use strict';


import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React from 'react';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../../utils/colors'
import {MagicNumbers} from '../../../utils/DeviceConfig'

import styles from '../../modals/purpleModalStyles'
import { BlurView, VibrancyView } from 'react-native-blur'

export default class CoupleSuccess extends React.Component{
  constructor(props){
    super()
    this.state = {
      pin: '',
      submitting: false,
      absoluteContinue: true,
      verifyError: null,
      inputFieldValue:''
    }
  }
  popToTop(){
    this.props.goBack && this.props.goBack()

    if(this.props.navigator){
      this.props.navigator.pop()
    }
    if(this.props.hideModal){
      this.props.hideModal()
    }
    if(this.props.close){
      this.props.close()
    }
  }

  render(){
    return (
      <ScrollView contentContainerStyle={[{width:DeviceWidth,height:DeviceHeight,flexDirection:'column',justifyContent:'center',flex:1,top:0 }]} >

        <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'Montserrat-Bold',fontSize:20,color:'#fff',marginVertical:10 }]}>
          SUCCESS
        </Text>
        {this.props.user.partner ?  <View style={{height:120,marginVertical:30,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Image style={[{width:120,height:120,borderRadius:60,marginRight:-100}]}
          source={ {uri: this.props.user.partner.image_url} }
          defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
          />

        <Image style={[{width:120,height:120,borderRadius:60,marginLeft:-100}]}
        source={ {uri: this.props.user.image_url} }
        defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
        />
        </View> : <View>

        <Text style={[styles.rowtext,styles.bigtext,{
          fontSize:18,
          marginVertical:10,
          color:'#fff',
          marginBottom:15,textAlign:'center',
          flexDirection:'column'
        }]}>Your couple will be set up shortly.</Text></View>}

        <TouchableHighlight
          underlayColor={colors.white20}
          style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:MagicNumbers.screenPadding,marginTop:50,marginBottom:15}}
          onPress={this.popToTop.bind(this)}>
          <View style={{paddingVertical:20,paddingHorizontal:20}} >
            <Text style={{fontFamily:'Montserrat-Bold', fontSize:18,textAlign:'center', color:'#fff',}}>
              CONTINUE
            </Text>
          </View>
        </TouchableHighlight>

      </ScrollView>
    )
  }
  }
