import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React from 'react';

import ThreeDots from './ThreeDots';
import Action from '../modals/Action';
import ActionMan from '../../actions'
import { connect } from 'react-redux'

class ThreeDotsActionButton extends React.Component{
  constructor(props){
    super()
    this.state = {}
    console.log(props);
  }


  render(){
    return (
      <TouchableOpacity onPress={()=> this.props.dispatch(ActionMan.showInModal({
        component:Action,
        passProps:{
          ...this.props,
        }
      }))
      }>
          <ThreeDots dotColor={this.props.dotColor || '#fff'}/>
        </TouchableOpacity>
    )
  }
}



const dp = (dispatch) => {
  return { dispatch };
}

export default connect(null, dp)(ThreeDotsActionButton);
