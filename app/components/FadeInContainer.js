import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';

class FadeInContainer extends Component{

  constructor(props){
    super()

    this.state = {
      fadeAmount: new Animated.Value(0)
    }

  }
  componentDidMount(){
    Animated.timing( this.state.fadeAmount,
      {
        toValue: 1,
        duration: this.props.duration || 500,
        delay: this.props.delayAmount || 500
      }
    ).start();
  }
  render(){
      return (
        <Animated.View style={{flex:1,opacity:this.state.fadeAmount}}>

          {this.props.children}

        </Animated.View>
      )
  }



}
export default FadeInContainer
