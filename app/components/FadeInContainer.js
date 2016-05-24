import React, {Component,Children} from "react";
import {StyleSheet, Text, View, Easing, Animated} from "react-native";
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
class FadeInContainer extends Component{
  static defaultProps = {
    delayAmount: 0,
    duration: 500,
    delayRender: false
  };

  constructor(props){
    super()
    this.state = {
      shouldRenderChildren: true,// !props.delayRender,
      fadeAmount: new Animated.Value(0.0)
    }
  }
  componentDidMount(){
    // console.log(this.props)
    this.fadeIn()
  }
  componentWillReceiveProps(nProps){
    if(nProps.shouldStop){
      this.cancelFadeIn()
    }
  }
  cancelFadeIn(){
    this.state.fadeAmount.stopAnimation(()=>{
      //console.log('animation stopped')
    })
  }
  fadeIn(){
    Animated.timing( this.state.fadeAmount,
      {
        toValue: 1.0,
        duration: this.props.duration || 500,
        delay: this.props.delayAmount || 0,
        // easing: Easing.in(Easing.ease)
      }
    ).start( () => {
      this.props.didShow && this.props.didShow()
    })

  }
  render(){
      return (


      <Animated.View style={{flex:1,opacity:this.state.fadeAmount,...this.props.style,alignSelf:'stretch'}}>
        {this.state.shouldRenderChildren ? React.Children.map(this.props.children, (child) =>{
            return (
            React.cloneElement(child, {...this.props})
            )
          })  : <View/>}
        </Animated.View>
      )
  }



}

reactMixin.onClass(FadeInContainer, TimerMixin)

export default FadeInContainer
