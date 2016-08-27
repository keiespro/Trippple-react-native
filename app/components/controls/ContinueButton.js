/**
 * @flow
 */

import React, {Component} from "react";

import {Text, Easing, Animated, TextInput, View, TouchableHighlight, StyleSheet, ActivityIndicator, Dimensions} from "react-native";

import {MagicNumbers} from '../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../../utils/colors'



class ContinueButton extends Component{

  static defaultProps = {
    canContinue: false
  };
  constructor(props){
    super();

    this.state = {
      submitting: false,
      yVal: new Animated.Value(0)
    }

  }
  componentWillReceiveProps(nProps){
    if(nProps.canContinue != this.props.canContinue){
      Animated.timing(this.state.yVal,{
        toValue: nProps.canContinue ? 1 : 0,
        duration:  200,
        // easing: Easing.in(Easing.easeInEase)
      }).start()
    }
  }

  handleContinue(){
    // if(this.state.submitting) { return false }
    // this.setState({submitting:true})
    this.props.handlePress()
  }
  nothing(){}
  render(){
    return (
      <Animated.View style={[styles.continueButtonWrap,
        {
          bottom: 0,
          backgroundColor: this.props.canContinue ? colors.mediumPurple : 'transparent',
          position:this.props.absoluteContinue ? 'absolute' : null,
          left:0,
          transform: [
            {
              translateY: this.state.yVal.interpolate({
                inputRange: [0, 1],
                outputRange: [80,0]
              })
            }
          ]
        }]}>
        <TouchableHighlight
           style={[styles.continueButton]}
           onPress={this.props.handlePress}
           underlayColor={colors.darkPurple}>
           <View>
        {this.props.loading ?  <ActivityIndicator style={{alignSelf:'center',alignItems:'center',flex:1,height:60,width:60,justifyContent:'center'}}  animating={true}/> :
        <Text style={[styles.continueButtonText,{
          color: this.props.canContinue ? colors.white : 'transparent'
        } ]}>{this.props.customText || 'CONTINUE'}</Text>}

        {/*this.state.submitting ? <ActivityIndicator style={{alignSelf:'center',alignItems:'center',flex:1,height:60,width:60,justifyContent:'center'}} animating={true} size={'large'}/> : <Text style={styles.continueButtonText}>CONTINUE</Text>*/}
          </View>
         </TouchableHighlight>
      </Animated.View>
    )
  }
}



const styles = StyleSheet.create({
  continueButtonWrap:{
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: MagicNumbers.continueButtonHeight,
    backgroundColor: colors.mediumPurple,
    width:DeviceWidth
  },
  continueButton: {
    height: MagicNumbers.continueButtonHeight,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButtonText: {
    padding: 4,
    fontSize: MagicNumbers.size18+8,
    fontFamily:'Montserrat',
    color: colors.white,
    textAlign:'center'
  }
});


export default ContinueButton
