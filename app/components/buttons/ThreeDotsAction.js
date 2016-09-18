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
  }


  render(){
    const passProps = {
      // ...this.props.sendProps,
      ...this.props.route.params
    }
console.log(passProps);
    return (
      <TouchableOpacity onPress={()=> this.props.dispatch(ActionMan.showInModal({
        component:'Action',
        passProps
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
