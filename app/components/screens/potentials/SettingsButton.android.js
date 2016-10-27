import {
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  DrawerLayoutAndroid,
  Image
} from 'react-native';
import React from "react";
import colors from '../../../utils/colors';
import Settings from '../settings/settings'

import { connect } from 'react-redux';


class SettingsButton extends React.Component{
    render(){

        return (
            <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}
              style={{paddingTop:5,paddingRight:25,paddingBottom:5,}}
              onPress={this.props.openDrawer}
            >
               <Image
                 tintColor={colors.white}
                 resizeMode={Image.resizeMode.contain}
                 style={{width:28,top:0,height:30,marginLeft:15,tintColor: colors.white}}
                 source={require('./assets/gear.png')}
             />
           </TouchableOpacity>

        )
    }
}




const mapDispatchToProps = (dispatch) => {
  return {
    openDrawer: () => dispatch({type: 'OPEN_DRAWER'})
  };
}

export default connect(null,mapDispatchToProps)(SettingsButton)
