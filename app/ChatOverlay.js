import { StatusBar, View, Dimensions, Modal,Animated,  NavigationExperimental, } from 'react-native';
import React from "react";

import ActionMan from './actions/';
import AppNavigation from './components/AppNavigation'
import Chat from './components/screens/chat/chat';
import XButton from './components/buttons/XButton'
import { connect } from 'react-redux';
import colors from './utils/colors';

import { actions } from 'react-native-navigation-redux-helpers';

const {
  popRoute,
  pushRoute,
  jumpTo
} = actions;


const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack,
  Transitioner: NavigationTransitioner,
  Card: NavigationCard,
} = NavigationExperimental;

const {
  PagerPanResponder: NavigationPagerPanResponder,
  PagerStyleInterpolator: NavigationPagerStyleInterpolator,
} = NavigationCard;



const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

export default class ChatOverlay extends React.Component{
  constructor(props){
    super()
    this.state={
      slide: new Animated.Value(DeviceWidth),
      pan: new Animated.ValueXY(0),

    }
  }
  componentDidMount(){
    Animated.timing(this.state.slide, {
      toValue: 0,
      duration:300
    }).start(()=>{
      this.setState({showchat: true})
      // this._nav.dispatchProps.dispatch(pushRoute({
      //   component: Chat,
      //   key:`chat${this.props.match_id}`,
      //   label: 'x',
      //   config:{
      //     inside:'pushFromRight'
      //   },
      //   passProps: {
      //     matchInfo: this.props.matchInfo,
      //     match_id: this.props.match_id
      //   }
      // },'global'))



    })
  }
_render(){
  return (
      <View style={{backgroundColor:colors.mediumPurple,width:DeviceWidth,height:DeviceHeight}}>
        <Chat {...this.props}/>
        <XButton navigator={{pop: ()=>{this.props.dispatch(ActionMan.popChat())}}}/>
      </View>
  )
}
  render(){
    const {match_id} = this.props

       panHandlers = (  NavigationPagerPanResponder.forHorizontal({
          ...this.props,
          gestureResponseDistance: 20,
          // onNavigateBack: () => dispatch(popRoute("global")),
          // onNavigateForward: this.props.navigate.bind(this,'')
          onPanResponderMove: Animated.event([null, {
            dx: this.state.pan.x,
            dy: this.state.pan.y,
          }]),
        }));
    return (
    <Animated.View
{...panHandlers}
 style={{
zIndex:9999,backgroundColor:'white',width:DeviceWidth,height:DeviceHeight,position:'absolute',transform: [
      {
        translateX: this.state.slide.interpolate({
          inputRange: [0,1],
          outputRange: [0,1]
        })
      },
    ]
}}>{this._render()}
{/* <NavigationTransitioner
    style={{
      transform: [
        {
          translate: [this.state.pan.x,this.state.pan.y]
     }]}}
    navigationState={this.props.navigationState}
    render={this._render}

  /> */}

</Animated.View>

    )
  }
}


class Inner extends React.Component{

  render(){
    return <Chat isVisible={true} match_id={this.props.match_id} />

  }
}
