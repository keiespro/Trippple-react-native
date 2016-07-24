

import React, {Component} from "react";

import {StyleSheet, Text, PixelRatio, View, Image, TextInput, TouchableHighlight, TouchableOpacity, Animated, Dimensions} from "react-native";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../DeviceConfig'

import colors from '../../utils/colors'
import { BlurView, VibrancyView } from 'react-native-blur'
import Analytics from '../../utils/Analytics';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);



class MessageComposer extends React.Component{

  static defaultProps = {
    textInputValue: ''
  };

  constructor(props){
    super()
    this.state = {
      inputFocused: false,
      bottomColor: new Animated.Value(0)

    }
  }

  sendMessage(message){
    if(this.state.textInputValue == ''){ return false }

    this._textInput.setNativeProps({text: ''});
    this.props.sendMessage(message)
  }

  render(){
    console.log(this.props.textInputValue.length);
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
            onChangeText={this.props.onTextInputChange}
            >
            <Text style={{ fontSize:17, padding:1, paddingBottom:7.5, color:colors.white, }} >{
                this.props.textInputValue || ''
            }</Text>
        </AnimatedTextInput>

        <TouchableHighlight
          style={styles.sendButton}
          underlayColor={colors.outerSpace}
          onPress={this.props.textInputValue.length ? this.sendMessage.bind(this) : null}
          >
          <Text style={[styles.sendButtonText,{
              color: this.props.textInputValue.length ? colors.white : colors.shuttleGray,
              fontFamily:'Montserrat',
              textAlign:'center'
            }]}>SEND</Text>
        </TouchableHighlight>
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
    paddingVertical: 10,
    backgroundColor: colors.dark,
    flexDirection: 'column',
    alignItems: 'center',
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
    width:DeviceWidth,
    margin:0,
    height:80,
    paddingLeft:20,
    paddingVertical:15,
    paddingRight:10,
    borderTopWidth: 1 / PixelRatio.get() ,
    borderTopColor:'#000'
  },
  messageComposerInput:{
    flex:1,
    paddingHorizontal:3,
    paddingTop:0,
    paddingBottom:10,
    fontSize:17,
    color:colors.white,
    borderBottomColor:colors.white,
    borderBottomWidth:1,
    overflow:'hidden',
  },

});
