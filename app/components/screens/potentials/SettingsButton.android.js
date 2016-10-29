import {
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  DrawerLayoutAndroid,
  TouchableNativeFeedback,
  Image
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';

import colors from '../../../utils/colors';
import Settings from '../settings/settings'



class SettingsButton extends React.Component{
  render(){
    return (
      <TouchableNativeFeedback
        hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}
        background={TouchableNativeFeedback.SelectableBackground()}
        onPress={this.props.openDrawer}
      >
      <View
      style={{paddingTop: 5, paddingRight: 25, paddingBottom: 5, }}
      >

        <Image
          tintColor={colors.white}
          resizeMode={Image.resizeMode.contain}
          style={{width: 28, top: 0, height: 30, marginLeft: 15, tintColor: colors.white}}
          source={require('./assets/gear@3x.png')}
        />
        </View>
      </TouchableNativeFeedback>

    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    openDrawer: () => dispatch({type: 'OPEN_DRAWER'})
  };
}

export default connect(null, mapDispatchToProps)(SettingsButton)
