
import React from "react";
import {Component} from "react";
import {StyleSheet, Text, View, TouchableOpacity, Image} from "react-native";

const styles = StyleSheet.create({
  navBarLeftButton:{
    position:'absolute',
    top:50,
    width:50,
    height:50,
    backgroundColor:'transparent',
    left:10
  }
})

export default class XButton extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (


        <TouchableOpacity
          onPress={()=>{this.props.navigator.pop()}}
          style={{padding:20,position:'absolute',top:12,zIndex:999}}
        >
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{width:15,height:15,marginTop:0,alignItems:'flex-start'}}
          source={{uri: 'assets/close@3x.png'}}
        />
      </TouchableOpacity>

    )
  }
}
