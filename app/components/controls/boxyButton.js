import React, {Component} from "react";
import {StyleSheet, ActivityIndicator, Text, View, Image, TouchableHighlight, LayoutAnimation} from "react-native";

import colors from '../../utils/colors'
import {MagicNumbers} from '../../utils/DeviceConfig'

class BoxyButton extends Component{

  constructor(props){
    super(props)
    this.state = {
      busy:false
    }
  }

  _onPress(e){
    this.setState({busy:true})
    this.props._onPress(e)
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this._onPress.bind(this)}
        style={[this.props.outerButtonStyle,]}
        underlayColor={this.props.underlayColor || colors.dark}>
        <View style={[styles.iconButton, this.props.innerWrapStyles]}>
          <View style={[styles.iconButtonLeftBox,this.props.leftBoxStyles]}>
            {this.props.children}
          </View>
          <View style={styles.iconButtonRightBox}>
              {this.state.busy ? <ActivityIndicator style={{top:0,height:30,width:30,}} color={colors.white20} animating={true} size={'small'}/> : <Text style={[styles.textplain, styles.iconButtonText, this.props.buttonText]}>{this.props.text}</Text>}
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default BoxyButton


const styles = StyleSheet.create({

  iconButton:{
    height:70,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignSelf:'stretch',
    flex: 1,
    width: undefined
    // marginVertical:10
  },
  iconButtonLeftBox: {
    width: 80,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:10,
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  iconButtonLeftBoxSingles: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1

  },
  iconButtonRightBox: {
    width: undefined,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:20,
    flex: 1
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonSingles:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1
  },
  iconButtonSelected:{
    // backgroundColor:,
  },
  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 14,
    textAlign: 'center'
  },
});
