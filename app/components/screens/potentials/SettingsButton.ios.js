import {
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import React from "react";
import colors from '../../../utils/colors';

import { withNavigation } from '@exponent/ex-navigation';


@withNavigation
class SettingsButton extends React.Component{
    render(){
        return (
            <TouchableOpacity
              style={{paddingTop:10,paddingRight:25,paddingBottom:5,}}
              onPress={() => this.props.navigator.push(this.props.navigation.router.getRoute('Settings')) }
            >
              <Image
                tintColor={colors.white}
                resizeMode={Image.resizeMode.contain}
                style={{width:28,top:0,height:30,marginLeft:15,tintColor: colors.white}}
                source={require('./assets/gear@3x.png')}
            />
          </TouchableOpacity>
        )
    }
}
export default SettingsButton
