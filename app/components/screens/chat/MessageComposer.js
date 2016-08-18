

import React, {Component} from "react";

import {StyleSheet, Text, PixelRatio, View, Image, TextInput, TouchableHighlight, TouchableOpacity, Animated, Dimensions} from "react-native";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../../utils/DeviceConfig'

import colors from '../../../utils/colors'
import { BlurView, VibrancyView } from 'react-native-blur'
import Analytics from '../../../utils/Analytics';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);



class MessageComposer extends React.Component{

  static defaultProps = {
    textInputValue: ''
  };

  constructor(props){
    super()
    this.state = {
      inputFocused: false,
      height:0,
      bottomColor: new Animated.Value(0)

    }
  }

  sendMessage(message){
    if(this.state.textInputValue == ''){ return false }

    this._textInput.setNativeProps({text: ''});
    this.setState({height:0})

    this.props.sendMessage(message)
  }

  render(){
    return (

      <View style={styles.messageComposer}>

        <AnimatedTextInput
          multiline={true}
          autoGrow={true}
          ref={component => this._textInput = component}
          style={[styles.messageComposerInput,{
            borderBottomColor: this.state.bottomColor ? this.state.bottomColor.interpolate({
              inputRange: [0, 100],
              outputRange: [colors.shuttleGrayAnimate,colors.whiteAnimate],
            }) : colors.shuttleGray,
            height: Math.max(40, this.state.height)+6
          }]}
          returnKeyType={'default'}
          keyboardAppearance={'dark'}
          autoCorrect={true}
          placeholder={'Type Message...'}
          placeholderTextColor={colors.shuttleGray}
          autoFocus={false}
          selectionColor={colors.mediumPurple}
          clearButtonMode={'never'}
          onFocus={(e)=>{
            Animated.timing(this.state.bottomColor, {
              toValue: 100,
              duration: 300
            }).start((r => {
              this.setState({inputFocused:true})
            }))
        }}
        onBlur={(e)=>{
              Animated.timing(this.state.bottomColor, {
                toValue: 0,
                duration: 300,
              }).start((r => {
                this.setState({inputFocused:false})
              }))

            }}
            onChange={(event)=>{
              this.setState({
                height: event.nativeEvent.contentSize.height,
              });
              this.props.onTextInputChange(event.nativeEvent.text)
            }}
            >
            <Text style={{ fontSize:18, padding:1, height: Math.max(40, this.state.height+6), flex:1,color:colors.white, }} >{
                this.props.textInputValue || ''
            }</Text>
        </AnimatedTextInput>

        <TouchableOpacity
          style={[styles.sendButton,{backgroundColor:colors.dark}]}
          onPress={this.props.textInputValue.length ? this.sendMessage.bind(this) : null}
          >
          <Text style={[styles.sendButtonText,{
            backgroundColor:'transparent',
              color: this.props.textInputValue.length ? colors.white : colors.white20,
              fontFamily:'Montserrat',
              textAlign:'center'
            }]}>SEND</Text>
        </TouchableOpacity>
      </View>


    )
  }
}


export default MessageComposer


const styles = StyleSheet.create({


  inputField: {
    height: 50,
    backgroundColor:colors.dark,
    margin:0,
    bottom:0
  },
  sendButton:
  {
    margin: 0,
    padding: 5,
    marginLeft: 5,
    borderRadius: 5,
    // paddingVertical: 0,
    marginBottom:10,
    // backgroundColor: colors.dark,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  sendButtonText:{
    textAlign:'center',
    fontFamily:'omnes',
    fontSize:18,
    color:colors.white
  },
  messageComposer: {
    flexDirection:'row',
    backgroundColor:colors.dark,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'flex-end',
    width:DeviceWidth,
    margin:0,
    minHeight:80,
    bottom:0,
    paddingLeft:20,
    paddingVertical:15,
    paddingRight:10,
    bottom:60,
    position:'relative',
    borderTopWidth: 1 / PixelRatio.get() ,
    borderTopColor:'#000'
  },
  messageComposerInput:{
    flex:1,
    paddingHorizontal:0,
    paddingTop:0,
    paddingBottom:0,

    fontSize:18,
    color:colors.white,
    borderBottomColor:colors.white,
    borderBottomWidth:1,
    overflow:'hidden',
  },

});
