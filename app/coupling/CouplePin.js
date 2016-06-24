/* @flow */


import React, {Component, PropTypes} from "react";
import { StyleSheet, Image, Text, Settings, Animated, ActivityIndicatorIOS, Alert, View, TouchableHighlight, NativeModules, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'
import styles from '../modals/purpleModalStyles'
import BlurModal from '../modals/BlurModal'
import BackButton from '../components/BackButton'
import UserActions from '../flux/actions/UserActions'

const { RNMessageComposer } = NativeModules;

class CouplePin extends React.Component{
  constructor(props){
    super()
    this.state = {
      success:false,
      bounceValue: new Animated.Value(0)
    }
  }
  handleSendMessage(){
        // this.setState({ success:true });
    // return
    this.setState({ submitting:true });
    // 
    const couple = this.props.couple || {};

    const pin = couple.pin;
    
    RNMessageComposer.composeMessageWithArgs(
      {
      'messageText':'Join me on Trippple! My couple code is '+pin+'. trippple://join.couple/'+pin,
      'recipients':[]
    },
    (result) => {
      this.setState({ submitting:false });
      
      switch(result) {
        case RNMessageComposer.Sent:
          this.setState({ success:true });
          break;
        case RNMessageComposer.Cancelled:
          break;
        case RNMessageComposer.Failed:
          Alert.alert('Whoops','Try that again')
          break;
        case RNMessageComposer.NotSupported:
          break;
        default:
          break;
      }
    }
    );

  }
  componentDidMount(){
    UserActions.updateUser.defer({generatedCoupleCode:true});
    
    Settings.set({'co.trippple.showCoupling':false})
  }    
  componentDidUpdate(pProps,pState){
    if(!pState.success && this.state.success){
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
      })  // Start the animation

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

        <View style={{flex:1,height:DeviceHeight*0.75,paddingHorizontal:30,width:DeviceWidth,flexDirection:'column'}}>


         <Text
          style={[styles.rowtext,styles.bigtext,{

            fontSize:24,
            color:'#ffffff',
            marginTop: 0,
            fontFamily:'Montserrat-Bold',
          }]}>INVITE SENT</Text>

          <Text style={[styles.rowtext,styles.bigtext,{
            fontSize:20,
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
              <Text style={{fontFamily:'Montserrat-Bold', fontSize:18,textAlign:'center', color:'#fff',}}>
              THANKS</Text>
            </View>
          </TouchableHighlight>
        
      </View>
    </View>
    )
  }
  popToTop(){
    const currentRoutes = this.props.navigator.getCurrentRoutes();
    if(currentRoutes[1].id == 'Settings'){
      this.props.navigator.popToRoute(currentRoutes[1]);
    }else{
      this.props.navigator.popToRoute(currentRoutes[0]);
    }
  }    
  renderMain(){

    const {couple} = this.props;
    
    return (
      <View>
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

        <View style={{alignItems:'center',justifyContent:'center'}}>

          {this.state.submitting ? 
              <ActivityIndicatorIOS style={[ {width:80,height: 80}]} size="large" animating={true}/> :
            <TouchableHighlight
            underlayColor={colors.white20}
            style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:10,marginTop:20,marginBottom:15}}
            onPress={this.handleSendMessage.bind(this)}>
            <View style={{paddingVertical:20,paddingHorizontal:20}} >
              <Text style={{fontFamily:'Montserrat-Bold', fontSize:18,textAlign:'center', color:'#fff',}}>
                TEXT CODE TO MY PARTNER
              </Text>
            </View>
          </TouchableHighlight>
          }
        </View>
        <TouchableOpacity onPress={this.popToTop.bind(this)}>
          <Text style={{ fontSize:16,textAlign:'center', marginTop:40,color:colors.rollingStone,}}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }
  render(){

    return (
      <BlurModal user={this.props.user}>
        {this.state.success ? this.renderSuccess() : this.renderMain()}
      </BlurModal>
    )
  }
}


export default CouplePin
