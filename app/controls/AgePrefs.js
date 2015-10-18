/* @flow */

const MIN_AGE = 18
const MAX_AGE = 70
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
      match_age_min: props.user.match_age_min || MIN_AGE,
      match_age_max: props.user.match_age_max || MAX_AGE,
      cursorMin: props.user.match_age_min || MIN_AGE,
      cursorMax: props.user.match_age_max || MAX_AGE,
      panXMin: new Animated.Value(0),
      panXMax: new Animated.Value(0),
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

  render(){
    var {cursorMax,cursorMin,dots} = this.state
    var insideWidth = DeviceWidth-60
    var dotWidth = insideWidth / this.state.numberGroups

        return (
          <View style={{width:DeviceWidth,flexDirection:'column',height:80,paddingHorizontal:30}}>

          <Text style={{alignSelf:'flex-end'}}>{`${this.state.cursorMin} - ${this.state.cursorMax}`}</Text>

        <View style={{width:DeviceWidth-60,flexDirection:'row',height:80,alignItems:'center'}}>

          {dots.map((dot,i) => {
            var highlighted =  cursorMin <= dot.start_age && cursorMax >= dot.start_age + MIN_AGE_GROUP_DISTANCE - 1 || Math.abs(cursorMax - dot.start_age) < MIN_AGE_GROUP_DISTANCE
            var lineHighlighted =   cursorMax <= dot.start_age + MIN_AGE_GROUP_DISTANCE - 1 ? false : true
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
          <ActiveDot updateVal={(type,val) => {
              this.setState({cursorMin: val})
            }} cursorMax={cursorMax} cursorMin={cursorMin} panXMin={this.state.panXMin} />

          </View>

          </View>



    )
  }
}


class ActiveDot extends React.Component{
  constructor(props){
    super(props);
  }
  componentWillMount(){
    this.initializePanResponder();
  }
  initializePanResponder(){
    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e,gestureState) => {
         return false;
      },

      onMoveShouldSetPanResponder: (e,gestureState) => {
        return true
      },

      onStartShouldSetPanResponder: (e,gestureState) => {
        return false
      },
      onPanResponderReject: (e, gestureState) => {
        console.log('onPanResponderReject',e.nativeEvent,{gestureState})
      },

      onPanResponderMove: Animated.event( [null, {dx: this.props.panXMin}] ),

      onPanResponderRelease: (e, gestureState) => {
        console.log('dx:',gestureState.dx,'val:',MIN_AGE+(gestureState.dx/DeviceWidth)*(MAX_AGE-MIN_AGE))
        UserActions.updateUser({
           match_age_min: MIN_AGE+(gestureState.dx/DeviceWidth)*(MAX_AGE-MIN_AGE),
         })
         this.props.updateVal('min',MIN_AGE+(gestureState.dx/DeviceWidth)*(MAX_AGE-MIN_AGE))
      }
    })
  }
  render(){

          //
          // <TouchableHighlight key={`dot${i}`} onPress={()=>{
          //     var newState = {}
          //     if( cursorMin <= dot.start_age && cursorMax >= dot.start_age + MIN_AGE_GROUP_DISTANCE){
          //       if(Math.abs(dot.start_age - cursorMin)  > cursorMax - dot.start_age){
          //         newState.cursorMin = dot.start_age
          //
          //       }else{
          //         newState.cursorMax = dot.start_age
          //
          //       }
          //     }else if(dot.start_age + MIN_AGE_GROUP_DISTANCE > cursorMax){
          //       newState.cursorMax = dot.start_age + MIN_AGE_GROUP_DISTANCE
          //     }else if(dot.start_age > cursorMin && dot.start_age < cursorMax){
          //         // var dist = ((cursorMax-cursorMin) / 2) + cursorMin
          //         // console.log(dist,dot,i)
          //         // if(dot.start_age > dist){
          //           newState.cursorMax = dot.start_age + MIN_AGE_GROUP_DISTANCE
          //         // }else if(dot.start_age < dist){
          //         //   newState.cursorMin = dot.start_age
          //         // }
          //     }else{
          //       newState.cursorMin = dot.start_age
          //
          //     }
          //     console.log(newState)
          //     this.setState(newState)
          //
          //
          //     UserActions.updateUser({
          //       match_age_min:cursorMin,
          //       match_age_max:cursorMax
          //     })
          // }} underlayColor={colors.dark}>
    var {cursorMin} = this.props,
    x =   this.props.panXMin.interpolate({
        inputRange: [0,DeviceWidth],
        outputRange:[MIN_AGE,MAX_AGE]
      });
    return (

      <Animated.View {...this._panResponder.panHandlers}
        style={{
          transform: [
            {translateX: this.props.panXMin.interpolate({
              inputRange: [0,DeviceWidth],
              outputRange:[0,DeviceWidth]
            })}
          ],
          borderRadius:20,borderTopLeftRadius:40, borderTopRightRadius:40,
          height:40,width:40,position:'absolute',bottom:20,left:-20,
        backgroundColor: colors.mediumPurple
      }}><Text style={{backgroundColor:'transparent',color:colors.white,fontSize:12}}>{
      null
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
