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

import { withNavigation } from '@exponent/ex-navigation';


@withNavigation
class SettingsButton extends React.Component{
    render(){

        return (
             <View
               style={{paddingTop:5,paddingRight:25,paddingBottom:5,}}
             >
               <Image
                 tintColor={colors.white}
                 resizeMode={Image.resizeMode.contain}
                 style={{width:28,top:0,height:30,marginLeft:15,tintColor: __DEV__ ? colors.mandy : colors.white}}
                 source={require('./gear.png')}
             />
           </View>
           
        )
    }
}
export default SettingsButton
