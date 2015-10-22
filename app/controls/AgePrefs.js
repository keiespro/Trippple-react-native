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
const InsideWidth = DeviceWidth - 62
import colors from '../utils/colors'


class  AgePrefs extends React.Component{
  constructor(props){
    super(props)


    var possibleRange = MAX_AGE - MIN_AGE,
        numberGroups = (possibleRange / MIN_AGE_GROUP_DISTANCE)
    var dots = [];

    for (let i = 0; i <= numberGroups; i++) {
      dots.push({index:i,start_age:MIN_AGE+(MIN_AGE_GROUP_DISTANCE*i)})
    }

    console.log(dots)

    this.state = {
      dots,
      numberGroups,
      match_age_min: Math.max(props.user.match_age_min,MIN_AGE),
      match_age_max: Math.min(props.user.match_age_max,MAX_AGE)
    }
  }
  componentDidMount(){

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
    var {match_age_max,match_age_min} = this.state

    var {dots} = this.state
    var dotWidth = InsideWidth / this.state.numberGroups

        return (
          <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',height:100}}>

       <Text style={{alignSelf:'flex-end',color:colors.white,marginRight:20,marginBottom:20}}>{`${this.state.match_age_min} - ${this.state.match_age_max}`}</Text>

        <View style={{paddingHorizontal:0,flexDirection:'row',height:90,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>

          {dots.map((dot,i) => {
            var highlighted = i != dots.length  && match_age_min <= dot.start_age && match_age_max >= dot.start_age + MIN_AGE_GROUP_DISTANCE - 1 || Math.abs(match_age_max - dot.start_age) < MIN_AGE_GROUP_DISTANCE

            var lineHighlighted = match_age_max < dot.start_age   ? false : true
            console.log(highlighted)
            return (


              <View style={{marginLeft: i == 0 ? 40 : 0,width:dotWidth,height:80,alignSelf:'center',position:'relative'}} >

              { dot.start_age >= MAX_AGE ? null : <View style={{
                    flex:1,backgroundColor:'transparent',
                    borderTopWidth:1,height:45,width:dotWidth,
                    // marginLeft:dotWidth / 2 * -1,
                    borderTopColor: highlighted && lineHighlighted ? colors.mediumPurple : colors.white
                   }}/>
               }
               <TouchableHighlight style={{position:'absolute',top:-10,left:-10}} onPress={(e)=>{
                   var newState = {}
                   if(Math.abs(this.state.match_age_max - dot.start_age) > Math.abs(this.state.match_age_min - dot.start_age) ){
                     newState.match_age_min = dot.start_age
                   }else{
                     newState.match_age_max = dot.start_age

                   }
                      this.setState(newState)
                    }} >
                 <View style={{
                  flex:1,backgroundColor:highlighted ? colors.mediumPurple : colors.white,height:20,width:20,borderRadius:10,
               }}/>
             </TouchableHighlight>


               </View>


            )
          })}

          </View>
          <ActiveDot
            key={'minimum_dot'}
            toggleScroll={this.props.toggleScroll}
            updateVal={(val) => {
              console.log(val,'MIN VAL')
              this.setState({match_age_min:val});

            }}
            numberGroups={this.state.numberGroups}
            dots={this.state.dots}

            ageVal={this.state.match_age_min }
          />
          <ActiveDot
            key={'maximum_dot'}
            toggleScroll={this.props.toggleScroll}
            updateVal={(val) => {
              console.log(val,'MAX VAL')
              this.setState({match_age_max:val});

            }}
            numberGroups={this.state.numberGroups}
            dots={this.state.dots}

            ageVal={this.state.match_age_max}
          />



      </View>



    )
  }
}


class ActiveDot extends React.Component{
  constructor(props){
    super();
    this.state = {
      ageValue: null,
      ageVal: new Animated.Value(0),
    }
  }
  componentWillMount(){
    console.log('MOUNT')
    this.state.ageVal.setValue(InsideWidth * (this.props.ageVal-18) / 32)
    this.initializePanResponder();

  }
  // componentDidMount(){
  //   this.state.ageVal.addListener((val)=>{
  //     this.setState({ ageValue: val })
  //   })
  // }
  componentWillReceiveProps(nProps){
    var nval = Math.round(InsideWidth * (nProps.ageVal-18) / 32)

    console.log(Math.abs(nval - this._animatedValueX))
    if(Math.abs(this._animatedValueX - nval) >= InsideWidth/this.props.numberGroups){
      this._animatedValueX = nval

      Animated.timing(this.state.ageVal,{
        toValue:nval,
        duration:100,
      }).start()
    }
  }
  shouldComponentUpdate(nProps,nState){
    var nval = InsideWidth * (nProps.ageVal-18) / 32
    if(nProps.ageVal == this.props.ageVal ){
      return false
    }
    return true
  }
  componentWillUnmount() {
    this.state.ageVal.removeAllListeners();
  }
  initializePanResponder(){
    this._animatedValueX = InsideWidth * (this.props.ageVal-18) / 32

    this.state.ageVal.addListener((value) => {
      console.log(value);
      this._animatedValueX = Math.round(value.value);
      if(this._animatedValueX % 2 == 0 ){
      //
        this.props.updateVal(Math.round(this._animatedValueX * 32 / InsideWidth + 18))
      }
    })

    this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (e, gestureState) => {
          this.props.toggleScroll('off');

          this.state.ageVal.setOffset(this._animatedValueX);
          this.state.ageVal.setValue(0);
        },
        onPanResponderMove: Animated.event([ null, {dx: this.state.ageVal} ]),
        onPanResponderRelease: (e, gestureState)  => {
          console.log((gestureState.dx))
          if(this._animatedValueX > InsideWidth){
            this._animatedValueX = InsideWidth
          }else if(this._animatedValueX < 0){
            this._animatedValueX = 0
          }else{
            // this._animatedValueX = gestureState.dx
          }
          this.state.ageVal.flattenOffset(); // Flatten the offset so it resets the default positioning
          var newAgeVal = Math.round((this._animatedValueX * 32) / InsideWidth) + 18
          this.props.updateVal(newAgeVal)
          this.props.toggleScroll('on');
          console.log(this.props.dots)
          var dot = this.props.dots.length ? this.props.dots.filter((n) => n.start_age > newAgeVal) : {start_age:this._animatedValueX};
          console.log(dot[dot.length-1].start_age)

var toValue = InsideWidth * (dot[0].start_age-18) / 32
          Animated.timing(this.state.ageVal,{
            toValue,
            duration:500,
          }).start()
        }

    })
  }
  render(){

    var {ageVal} = this.state
    var dotWidthInterpolatedWidth = Math.round(InsideWidth / this.props.numberGroups)


// Some arbitrary interpolations for making the handle drag nicelyer

    var inputRange = this.props.dots.reduce( (arr,dot,i) => {
      arr.push(dotWidthInterpolatedWidth*i)
      arr.push(dotWidthInterpolatedWidth*(i) + 1)
      arr.push(dotWidthInterpolatedWidth*(i) +5)
      arr.push(dotWidthInterpolatedWidth*(i+1) - 30 )
      arr.push(dotWidthInterpolatedWidth*(i+1) )
      // arr.push(dotWidthInterpolatedWidth+dotWidthInterpolatedWidth*i)
      // arr.push(dotWidthInterpolatedWidth+MIN_AGE_GROUP_DISTANCE)
      return arr
    },[0])
    var outputRange = this.props.dots.reduce((arr,dot,i)=>{
      arr.push(dotWidthInterpolatedWidth*i )
      arr.push(dotWidthInterpolatedWidth*(i) + 1 )
      arr.push(dotWidthInterpolatedWidth*(i)+ 20)
      arr.push(dotWidthInterpolatedWidth*(i +1) - 10)
      arr.push(dotWidthInterpolatedWidth*(i+1) )
      return arr
    },[0])
    console.log(inputRange, outputRange)
    return (
      <Animated.Image {...this._panResponder.panHandlers}
        style={{
          transform: [ {translateX: ageVal.interpolate({
              inputRange, outputRange,
              extrapolate:'clamp'
            }) } ],
          backgroundColor:'transparent',alignItems:'center',justifyContent:'center',
          height:42,width:36,position:'absolute',bottom:20,
          left:10,
        }} source={require('image!sliderHandle')}>
        <Text style={{backgroundColor:'transparent',textAlign:'center',color:colors.white,fontSize:12}}>{
        this.props.ageVal
      }</Text>
      </Animated.Image>

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
