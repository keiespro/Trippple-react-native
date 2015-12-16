


import React, { Component, View, Dimensions, Image, Animated, Text, TouchableOpacity } from 'react-native'

import colors from '../utils/colors'

import AppActions from '../flux/actions/AppActions'

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'


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
                }}>To complete the registration, <Text style={{color:colors.sushi}}> {partnerName} must download Trippple</Text> and select you as their partner.</Text>
              </View>
          )
}

@reactMixin.decorate(TimerMixin)
class CheckMarkScreen extends Component{

  constructor(props){
    super();
    this.state = {
      buttonOpacity: new Animated.Value(0.0),
      bounceValue:new Animated.Value(0.0),
      textOpacityValue: new Animated.Value(0.0)
    }
  }
  componentWillMount(){
    this.state.bounceValue.setValue(0.0);

  }
  componentDidMount() {
    // if(!this.props.isVisible){ return false}

    Animated.sequence([
      Animated.spring(
        this.state.bounceValue,
        {
          toValue: 1.0,
          tension:10,
          friction: 3,
        }
      ),
      Animated.timing(
        this.state.textOpacityValue,
        {
          toValue: 1.0,
          duration:1000

        }
      ),
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 1.0,
          delay: 2000,
          duration:1000
        }
      )
    ]
  ).start(()=>{
      if(this.props.continueAfter){
        this.setTimeout(()=>{
          this.props.exitCheckMarkScreen()
        },this.props.continueAfter)
      }
    })  // Start the animation

  }
  render(){
    // if(!this.props.isVisible){ return false}

    return (
      <View style={{
        width:DeviceWidth,
        height:DeviceHeight,
        backgroundColor:colors.outerSpace,
        alignItems:'center',
flexDirection:'column',
        top:0,
        left:0,
        position:'absolute',
        justifyContent:'center',
        flex:1
      }}>

      <Animated.View
        style={{
          width:DeviceWidth,
          height:200,
          alignItems:'center',
          justifyContent:'center',
          flex:1,
          transform: [
            {scale: this.state.bounceValue ? this.state.bounceValue : 1},
          ],
        }}
        >
        <Image
          source={require('../../newimg/checkMark.png')}
          style={{width:200,height:200, }}
          resizeMode={Image.resizeMode.contain}
        />
        </Animated.View>

        {!this.props.checkMarkCopy.partnerName && <Animated.View
          style={{
            opacity: this.state.textOpacityValue,
            top: -120
          }}>
            <Text
              style={{
              fontSize:24,
              color:'#ffffff',
              marginTop: 0,
              fontFamily:'Montserrat-Bold',
            }}>{this.props.checkMarkCopy && this.props.checkMarkCopy.title || ''}</Text></Animated.View>}

        {this.props.checkMarkCopy.partnerName && <Animated.View
            style={{ opacity:this.state.textOpacityValue}}>
            <Text
              style={{
              fontSize:24,
              color:'#ffffff',
              marginTop: 40,
              fontFamily:'Montserrat-Bold',
            }}>{this.props.checkMarkCopy && this.props.checkMarkCopy.title || ''}</Text></Animated.View>}

        <Animated.View
          style={{
            opacity:this.state.textOpacityValue,
            margin:30,
          }}>
         {this.props.checkMarkCopy && this.props.checkMarkCopy.partnerName && inviteText(this.props.checkMarkCopy.partnerName) }
        </Animated.View>

        {this.props.checkmarkRequireButtonPress &&
          <Animated.View
          style={{
            opacity:this.state.buttonOpacity,
            margin:30,
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
