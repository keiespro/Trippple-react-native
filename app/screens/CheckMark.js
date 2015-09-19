


import React from 'react-native';

import { Component, View, Dimensions, Image, Animated, Text, TouchableOpacity } from 'react-native';

import colors from '../utils/colors'

import AppActions from '../flux/actions/AppActions'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

var inviteText = (partnerName)=>{
          return (
            <View>
                <Text style={{
                  fontSize:22,
                  textAlign:'center',
                  color:colors.white,
                  marginBottom:40
                }}>
                We've sent {partnerName} an invitation to join Trippple as your partner.</Text>
                <Text style={{
                  fontSize:22,
                  textAlign:'center',
                  color:colors.white,
                }}> To complete the registration, <Text style={{color:colors.sushi}}> {partnerName} must download Trippple</Text> and select you as their partner.</Text>
              </View>
          )
}

class CheckMarkScreen extends Component{

  constructor(props){
    super();
    this.state = {
      // scale: new Animated.Value(0),
      // opacity:
      buttonOpacity: new Animated.Value(1.0),
      bounceValue:new Animated.Value(0.1),
      textOpacityValue: new Animated.Value(1.0)
    }
  }

  componentDidMount() {
    if(!this.props.isVisible){ return false}

    // this.state.bounceValue.setValue(0);     //
    this.state.bounceValue.setValue(0.05);
    this.state.textOpacityValue.setValue(0.0);
    this.state.buttonOpacity.setValue(0.0);

    // this.state.bounceValue.setValue(1.5);     // Start large
Animated.sequence([
    Animated.spring(                          // Base: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 1.0,
        tension:2,
        friction: 3,
      }
    ),
    Animated.timing(                          // Base: spring, decay, timing
      this.state.textOpacityValue,                 // Animate `bounceValue`
      {
        toValue: 1.0,
      }
    ),
    Animated.timing(                          // Base: spring, decay, timing
      this.state.buttonOpacity,                 // Animate `bounceValue`
      {
        toValue: 1.0,
        delay: 2000
      }
    )]).start()
                    // Start the animation

  }
  render(){
    if(!this.props.isVisible){ return false}

    return (
      <View style={{
        top:0,
        left:0,
        position:'absolute',
        width:DeviceWidth,
        height:DeviceHeight,
        backgroundColor:colors.outerSpace,
        alignItems:'center',
        justifyContent:'center'
      }}>
          <Animated.Image source={require('image!checkMark')}
          style={{width:200,height:200,
            opacity:this.state.bounceValue,
            transform: [                        // `transform` is an ordered array
              {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
            ],

          }}
          />
          <Animated.Text
          style={{
            opacity:this.state.textOpacityValue,
            fontSize:24,
            color:'#ffffff',
            marginTop:40,
            fontFamily:'Montserrat-Bold',
          }}>{this.props.checkMarkCopy && this.props.checkMarkCopy.title || ''}</Animated.Text>

        <Animated.View
          style={{
            opacity:this.state.textOpacityValue,
            margin:40,
          }}>
         {this.props.checkMarkCopy && this.props.checkMarkCopy.partnerName && inviteText(this.props.checkMarkCopy.partnerName) }
        </Animated.View>

        {this.props.checkmarkRequireButtonPress &&
          <Animated.View
          style={{
            opacity:this.state.buttonOpacity,
            margin:40,
          }}>
            <TouchableOpacity onPress={()=>{AppActions.hideCheckmark()}}>
              <View>
                <Text style={{
                fontSize:22,
                textAlign:'center',
                color:colors.white,
              }}>OK</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          }


        </View>
      )

  }

}

export default CheckMarkScreen
