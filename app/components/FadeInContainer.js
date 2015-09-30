import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';


import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

@reactMixin.decorate(TimerMixin)
class FadeInContainer extends Component{
  static defaultProps = {
    delayAmount: 700,
    duration: 500,
    delayRender: false
  }

  constructor(props){
    super()

    this.state = {
      shouldRenderChildren: props.delayRender ? false : true,
      fadeAmount: new Animated.Value(0)
    }

  }
  componentDidMount(){
    Animated.timing( this.state.fadeAmount,
      {
        toValue: 1,
        duration: this.props.duration,
        delay: this.props.delayAmount
      }
    ).start( () => {});

    if(this.props.delayRender){
      this.setTimeout(()=>{
        this.setState({shouldRenderChildren:true})
      }, (this.props.delayAmount/2));
    }
  }
  render(){
      return (
        <Animated.View style={{flex:1,opacity:this.state.fadeAmount}}>

          {this.state.shouldRenderChildren ? this.props.children : null}

        </Animated.View>
      )
  }



}
export default FadeInContainer
