/* @flow */

const MIN_AGE = 18
const MAX_AGE = 50
const MIN_AGE_GROUP_DISTANCE = 4 ///years

import React from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  TouchableOpacity,
  PanResponder

} from  'react-native'

import Dimensions from 'Dimensions'
import UserActions from '../flux/actions/UserActions'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'


class  AgePrefs extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      dots:[],
      match_age_min: new Animated.Value(props.user.match_age_min || MIN_AGE),
      match_age_max: new Animated.Value(props.user.match_age_max || MAX_AGE),
    }
  }
  componentDidMount(){

    var possibleRange = MAX_AGE - MIN_AGE,
        numberGroups = (possibleRange / MIN_AGE_GROUP_DISTANCE)
    var dots = [];

    for (let i = 0; i <= numberGroups; i++) {
      dots.push({index:i,start_age:MIN_AGE+(MIN_AGE_GROUP_DISTANCE*i)})
    }

    console.log(dots)
    this.setState({dots,numberGroups})
  }
  setNativeProps(np){
    this.refs.incard && this.refs.incard.setNativeProps(np)
  }

componentWillReceiveProps(nProps){
  // if(this.props.panX && this.props.profileVisible != nProps.profileVisible){
  //   this.props.panX.removeAllListeners();
  //   this.setState({
  //     isMoving: false
  //   });
  // }
  console.log(nProps)
  // this.state.match_age_min.setValue(nProps.match_age_min);     // Start 0
  // this.state.match_age_max.setValue(nProps.match_age_max);     // Start 0

}
  render(){
    var {match_age_max,match_age_min,dots} = this.state
    var insideWidth = DeviceWidth
    var dotWidth = insideWidth / this.state.numberGroups

        return (
          <View style={{width:DeviceWidth,flexDirection:'column',height:80,paddingHorizontal:30}}>

          <Text style={{alignSelf:'flex-end',color:colors.white}}>{`${this.state.match_age_min} - ${this.state.match_age_max}`}</Text>

        <View style={{width:DeviceWidth,flexDirection:'row',height:80,alignItems:'center'}}>

          {dots.map((dot,i) => {
            var highlighted =  match_age_min <= dot.start_age && match_age_max >= dot.start_age + MIN_AGE_GROUP_DISTANCE - 1 || Math.abs(match_age_max - dot.start_age) < MIN_AGE_GROUP_DISTANCE
            var lineHighlighted = match_age_max <= dot.start_age + MIN_AGE_GROUP_DISTANCE - 1 ? false : true
            console.log(highlighted)
            return (


              <View style={{width:dotWidth,height:80}} >

              { dot.start_age == MAX_AGE ? null : <View style={{
                    flex:1,backgroundColor:'transparent',
                    borderTopWidth:1,height:45,width:dotWidth,
                    // marginLeft:dotWidth / 2 * -1,
                    borderTopColor: highlighted && lineHighlighted ? colors.mediumPurple : colors.white
                   }}/>
               }
               <View style={{
                  flex:1,backgroundColor:highlighted ? colors.mediumPurple : colors.white,height:10,width:10,borderRadius:5,position:'absolute',left:-5,top:-5
               }}/>

                  {/* Math.abs(cursorMax - dot.start_age) < MIN_AGE_GROUP_DISTANCE ?
                  <View style={{
                      borderRadius:20,borderTopLeftRadius:30, borderTopRightRadius:30,
                      height:40,width:40,position:'absolute',bottom:20,left:-20,
                    backgroundColor: colors.mediumPurple
                  }}><Text style={{backgroundColor:'transparent',color:colors.white,fontSize:12}}>{dot.start_age}</Text></View> :  null */}

               </View>


            )
          })}
          <ActiveDot key={'minimum_dot'} toggleScroll={this.props.toggleScroll} updateVal={(type,val) => {
            console.log(val,'MIN VAL')}}
                      ageVal={this.state.match_age_min} />
                    <ActiveDot key={'maximum_dot'} toggleScroll={this.props.toggleScroll} updateVal={(type,val) => {
                    console.log(val,'MAX VAL')}}
                      ageVal={this.state.match_age_max} />

          </View>

          </View>



    )
  }
}


class ActiveDot extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ageValue: props.MIN_AGE
    }
  }
  componentWillMount(){
    this.initializePanResponder();
    this.props.ageVal.addListener((val)=>{
      this.setState({ ageValue: val })
    })
  }

  initializePanResponder(){
    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e,gestureState) => {

         return true;
      },

      onMoveShouldSetPanResponder: (e,gestureState) => {
        return true
      },

      onStartShouldSetPanResponder: (e,gestureState) => {
        return true
      },
      onPanResponderGrant: (e, gestureState) => {
        this.props.toggleScroll('off')
      },
      onPanResponderEnd: (e, gestureState) => {
        this.props.toggleScroll('on')
      },
      onPanResponderReject: (e, gestureState) => {
        console.log('onPanResponderReject',e.nativeEvent,{gestureState})
      },

      onPanResponderMove: Animated.event( [null, {dx: this.props.ageVal}] ),

      onPanResponderRelease: (e, gestureState) => {
        console.log('dx:',gestureState.dx,'val:',MIN_AGE+parseInt(gestureState.dx/DeviceWidth)*(MAX_AGE-MIN_AGE))
        //
        // UserActions.updateUser({
        //    match_age_min: MIN_AGE+parseInt(gestureState.dx/DeviceWidth)*(MAX_AGE-MIN_AGE),
        //  })
        //  this.props.updateVal('min',MIN_AGE+(gestureState.dx/DeviceWidth)*(MAX_AGE-MIN_AGE))
      }
    })
  }
  render(){

    var {ageVal} = this.props

    return (

      <Animated.View {...this._panResponder.panHandlers}
        style={{
          transform: [
            {translateX: ageVal.interpolate({
              inputRange: [-100,0,DeviceWidth,DeviceWidth+100 ],
              outputRange:[ 0,  0,DeviceWidth,DeviceWidth     ]
            })}
          ],
          borderRadius:20,borderTopLeftRadius:40, borderTopRightRadius:40,
          height:40,width:40,position:'absolute',bottom:20,left:0,
        backgroundColor: colors.mediumPurple
      }}><Text style={{backgroundColor:'transparent',color:colors.white,fontSize:12}}>{
      this.state.ageValue
      }</Text></Animated.View>
    )

  }
}

export default AgePrefs




var styles = StyleSheet.create({


 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace
  //  overflow:'hidden'
 },
 inner:{
   flex: 1,
   alignItems: 'stretch',
   backgroundColor:colors.outerSpace,
   flexDirection:'column',
   justifyContent:'flex-start'
 },
})
