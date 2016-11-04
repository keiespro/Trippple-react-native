import {
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import React from 'react';

import ThreeDots from './ThreeDots';
import Action from '../modals/Action';
import ActionMan from '../../actions'
import { connect } from 'react-redux'
import Btn from '../Btn'
import colors from '../../utils/colors'


const ThreeDotsActionButton = ({open, dotColor=colors.white, style}) => (
  <Btn
    color={colors.white}
    style={style}
    onPress={open}
  >
    <ThreeDots
      dotColor={dotColor}
    />
  </Btn>
)

// const mapDispatchToProps = (dispatch) => ({
//   actionModal: () => {
//
//   }
// })

export default  ThreeDotsActionButton
