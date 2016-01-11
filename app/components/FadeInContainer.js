import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  Easing,
  Animated,
} from 'react-native';


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
    console.warn('fadein')
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
        delay: this.props.delayAmount || 0,
        easing: Easing.in(Easing.ease)
      }
    ).start( () => {
      this.props.didShow && this.props.didShow()
    })

    if(this.props.delayRender){
      this.setTimeout(()=>{
        this.setState({shouldRenderChildren:true})
      }, (this.props.delayAmount/2));
    }
  }
  render(){
      return (
        <View><Animated.View style={{flex:1,opacity:this.state.fadeAmount,...this.props.style,alignSelf:'stretch'}}>
          {this.state.shouldRenderChildren ? React.Children.map(this.props.children, (child) =>{
            return (
              React.cloneElement(child, {...this.props})
            )
          })  : <View/>}
        </Animated.View></View>
      )
  }



}

reactMixin.onClass(FadeInContainer, TimerMixin)

export default FadeInContainer
