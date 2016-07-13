/* @flow */


import React, {Component, PropTypes} from "react";
import { StyleSheet, Image, Text, Settings, ScrollView, Animated, ActivityIndicator, Alert, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'
import styles from '../modals/purpleModalStyles'
import BlurModal from '../modals/BlurModal'
import BackButton from '../components/BackButton'
import UserActions from '../flux/actions/UserActions'
import AppActions from '../flux/actions/AppActions'

import {SHOW_COUPLING} from '../utils/SettingsConstants'


class CouplePin extends React.Component{
  constructor(props){
    super()
    const startState = props.startState || {}

    this.state = {
      success:false,
      bounceValue: new Animated.Value(0),
      ...startState
    }
  }

  componentWillReceiveProps(nProps){
    if( nProps.couple && nProps.couple.hasOwnProperty('verified') && nProps.couple.verified ){
      this.setState({
        success: true,
      })
      this.props.exit();

    }

  }

  handleSendMessage(){
    this.setState({ submitting:true });
    const couple = this.props.couple || {};
    const pin = couple.pin;
    const messageText = `Join me on Trippple! My couple code is ${pin}. trippple://join.couple/${pin}`;
    this.props.exit()

    AppActions.sendMessageScreen({ pin, messageText })

    // setTimeout(()=>{
    // },10)

  }
  componentDidMount(){
    // UserActions.updateUser.defer({generatedCoupleCode:true});
    Settings.set({[SHOW_COUPLING]:false})
    if(this.state.success){
      this.animateSuccess()
    }
  }
  animateSuccess(){
    Animated.sequence([
        Animated.delay(700),

        Animated.spring(
          this.state.bounceValue,
          {
            toValue: 1.0,
            tension: 0,
            velocity: 3,  // Velocity makes it move
            friction: 1,
          }
        )
    ]).start(()=>{
      // this.setState({ success:false });
    })
  }
  componentDidUpdate(pProps,pState){
    if(!pState.success && this.state.success){
      this.animateSuccess()
    }
  }
  renderSuccess(){
    return (
      <View style={{height:DeviceHeight,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>

        <Animated.View
          style={{
            width:DeviceWidth,
            height:200,
            alignItems:'center',
            justifyContent:'center',
            flex:1,
            transform: [ {scale: this.state.bounceValue ? this.state.bounceValue : 1}, ],
          }}
        >
          <Image
            source={{uri: 'assets/checkMark@3x.png'}}
            style={{width:200,height:200,tintColor:colors.mediumPurple }}
            resizeMode={Image.resizeMode.contain}
          />
        </Animated.View>

        <View style={{flex:1,height:DeviceHeight*0.75,paddingHorizontal:MagicNumbers.screenPadding/2,width:DeviceWidth,flexDirection:'column'}}>


         <Text
          style={[styles.rowtext,styles.bigtext,{
            backgroundColor:'transparent',
            fontSize:24,
            color:'#ffffff',
            marginTop: 0,
            fontFamily:'Montserrat-Bold',
          }]}>INVITE SENT</Text>

          <Text style={[styles.rowtext,styles.bigtext,{
            fontSize:20,
            backgroundColor:'transparent',
            marginVertical:10,
            color:'#fff',
            marginBottom:15,
            flexDirection:'column'
          }]}>You can access your couple code at any time in your Trippple settings screen.</Text>

        <TouchableHighlight
            underlayColor={colors.white20}
            style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:10,marginTop:30,marginBottom:15}}
            onPress={this.popToTop.bind(this)}>
            <View style={{paddingVertical:20,}} >
              <Text style={{fontFamily:'Montserrat-Bold', backgroundColor:'transparent',fontSize:18,textAlign:'center', color:'#fff',}}>
              THANKS</Text>
            </View>
          </TouchableHighlight>

      </View>
    </View>
    )
  }
  popToTop(){
    this.props.exit()
  }

  renderMain(){

    const couple = this.props.couple || {};

    return (
      <View style={{left:0}}>
        <View style={[{width:DeviceWidth, paddingTop:MagicNumbers.is5orless ? 30 : 50,paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

          <View style={{height:120,marginVertical:MagicNumbers.is5orless ? 10 : 30,flexDirection:'row',alignItems:'center',justifyContent:'center',transform:[{scale:MagicNumbers.is5orless ? .8 : 1 }]}}>
            <View
              style={{width:116,height:116,borderRadius:60,marginRight:-100,borderColor:colors.white,borderWidth:3,borderStyle:'dashed'}} ></View>
            <Image style={[{width:120,height:120,borderRadius:60,marginLeft:-100}]}
            source={ {uri: this.props.user.image_url} }
            defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
          </View>

          <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', backgroundColor:'transparent', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10 }]}>
            YOUR COUPLE CODE
          </Text>

          <View style={{flexDirection:'column' }} >
            <Text style={[styles.rowtext,styles.bigtext,{
              fontSize:MagicNumbers.is5orless ? 17 : 20,
              marginVertical:10,
              color:'#fff',
              marginBottom:15,
              backgroundColor:'transparent',
              flexDirection:'column'
            }]}>
            Share this number with your partner to help them connect with you on trippple.
          </Text>
        </View>

        <Text style={[styles.rowtext,styles.bigtext,{
          fontSize:50,
          marginVertical:MagicNumbers.is5orless ? 10 : 30,
          color:'#fff',
          backgroundColor:'transparent',
          fontFamily:'Montserrat-Bold',
        }]}>
        {couple.pin}
        </Text>

        <View style={{alignItems:'center',justifyContent:'center'}}>

          {this.state.submitting ?
              <ActivityIndicator style={[ {width:80,height: 80}]} size="large" animating={true}/> :
            <TouchableHighlight
            underlayColor={colors.white20}
            style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:0,marginTop:20,marginBottom:15}}
            onPress={this.handleSendMessage.bind(this)}>
            <View style={{paddingVertical:20,paddingHorizontal:MagicNumbers.is5orless ? 10 : 20}} >
              <Text style={{fontFamily:'Montserrat-Bold', backgroundColor:'transparent', fontSize:MagicNumbers.is5orless ? 16 : 18,textAlign:'center', color:'#fff',}}>
                TEXT CODE TO MY PARTNER
              </Text>
            </View>
          </TouchableHighlight>
          }
        </View>
        <TouchableOpacity onPress={this.popToTop.bind(this)}>
          <Text style={{backgroundColor:'transparent', fontSize:16,textAlign:'center', marginVertical:MagicNumbers.is5orless ? 5 : 40,color:colors.rollingStone,}}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>

    </View>
    )
  }
  render(){
    return (
      <ScrollView>
      { this.state.success ? this.renderSuccess() : this.renderMain() }
      </ScrollView>
    )
  }
}


export default CouplePin
