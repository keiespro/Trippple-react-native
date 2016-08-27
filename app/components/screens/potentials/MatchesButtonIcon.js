'use strict';

import {
  View,
  ActivityIndicator,
  Dimensions,
  AppState,
  NativeModules,
  TouchableOpacity,
  Image
} from 'react-native';
import React from "react";
import colors from '../../../utils/colors';
import styles from './styles';
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

@withNavigation
class MatchesButton extends React.Component{
  render(){
    return (
      <TouchableOpacity style={{paddingTop:5,paddingLeft:25,paddingBottom:5,}} onPress={() => this.props.navigator.push(this.props.navigation.router.getRoute('Matches'))}>
        <Image
          resizeMode={Image.resizeMode.contain}
          tintColor={colors.white}
          style={{width:28,top:0,height:30,marginRight:15,tintColor: __DEV__ ? colors.daisy : colors.white}}
          source={{uri:'assets/chat@3x.png'}}
        />
        {this.props.unread.total ? <View style={{width:5,height:5,borderRadius:10,backgroundColor:colors.mediumPurple, position:absolute,top:0,right:0}} /> : null}
      </TouchableOpacity>
    )
  }
}


const mapStateToProps = ({notifications, unread}, ownProps) => {

  return { ...ownProps, notifications, unread }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchesButton);
