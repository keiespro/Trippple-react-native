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
import ActionMan from '../../../actions'


class SettingsButton extends React.Component{
  render(){
    return (
      <TouchableNativeFeedback
        hitSlop={{top: 10, bottom: 10, left: 10, right: 50}}

        style={{ width: 42, height: 42, borderRadius:21,}}
        onPress={this.props.openDrawer}

        background={TouchableNativeFeedback.SelectableBackground()}
      >
      <View
      style={{ paddingVertical:5, paddingHorizontal:7,width: 42, height: 42, borderRadius:21, marginLeft:10}}
      >

        <Image
          tintColor={colors.white}
          resizeMode={Image.resizeMode.contain}
          style={{width: 28, top: 0, height: 30, tintColor: colors.white}}
          source={require('./assets/gear@3x.png')}
        />
        </View>
      </TouchableNativeFeedback>

    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    openDrawer: () => {
      dispatch(ActionMan.getUserInfo())
      dispatch({type: 'OPEN_DRAWER'})
    }
  };
}

export default connect(null, mapDispatchToProps)(SettingsButton)
