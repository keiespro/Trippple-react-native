/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 Image,
 TextInput,
 PanResponder
} = React;

var alt = require('../flux/alt');

var RNTAnimation = require('react-native-tween-animation');
var MatchActions = require('../flux/actions/MatchActions');
var p = require("../flux/stores/PotentialsStore");
var PotentialsStore = alt.createStore(p, 'PotentialsStore');
var AltContainer = require('alt/AltNativeContainer');
var Logger = require('../utils/logger');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var THROW_OUT_THRESHOLD = 250;
var colors = require('../utils/colors');
var Swiper = require('react-native-swiper');




var ActiveCard = React.createClass({
  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  _cardStyles: {},
  _handle: '',
  card: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: this._handleOnStartShouldSetResponderCapture,
      onMoveShouldSetPanResponderCapture: this._handleOnMoveShouldSetResponderCapture,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 0;
    this._previousTop = 0;
    this._cardStyles = {
      left: this._previousLeft,
      top: this._previousTop,
   }
  },

  getInitialState(){
    return ({
      position: {
       left: this._previousLeft,
       top: this._previousTop,
     },
     isAnimating:false
    })
  },
  componentDidMount() {
    this._updatePosition();


  },

  render() {
    console.log('render pots',this.props.user,this.props.potential)
    return (


        <View key="activecard"
          ref={(card) => { this.card = card }}
          {...this._panResponder.panHandlers}
          style={{margin:20,left:0,width:DeviceWidth - 40, height:DeviceHeight - 80,marginTop:60,overflow:'hidden'}}>

          <CoupleActiveCard potential={this.props.potential} />

        </View>


    );
  },
/*

{this.props.user.relationship_status == 'single' ?

:
        <View style={styles.singleCard} >
          <Image source={{uri: this.props.potential.image_url}} style={styles.imagebg} >
            <Text style={[styles.absoluteText,styles.absoluteTextBottom]}>{this.props.potential.firstname}</Text>
          </Image>
        </View>
      }
      */
  _highlight() {
    this.card && this.card.setNativeProps({
      shadowColor: 'rgba(0,0,0,.5)',
      shadowOffset: {width:0, height: 0},
      shadowOpacity: 0.5,
      shadowRadius: 10
    });
  },

  _unHighlight() {
    this.card && this.card.setNativeProps({
      shadowOpacity: 0,
    });
  },
  componentDidUpdate(prevProps,prevState){

  },
  _updatePosition(tweenFrame) {
    console.log('update position',this._cardStyles)
    this.card && this.card.setNativeProps(tweenFrame ? tweenFrame : this._cardStyles);
  },
  _handleOnStartShouldSetPanResponderCapture(e, gestureState){
    console.log(e,'_handleOnStartShouldSetResponderCapture');
    // return false;
  },
  _handleOnMoveShouldSetPanResponderCapture(e, gestureState){
    console.log(e,'_handleOnMoveShouldSetResponderCapture');
    // return false;
  },
  _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the card?
    return (DeviceWidth/2 - gestureState.locationX > DeviceHeight/2 - gestureState.locationY)
  },

  _handleMoveShouldSetPanResponder(e: Object): boolean {
    // Should we become active when the user moves a touch over the card?
    return (DeviceWidth/2 - e.nativeEvent.changedTouches[0].locationX > DeviceHeight/2 - e.nativeEvent.changedTouches[0].locationY)
  },

  _handlePanResponderGrant(e: Object, gestureState: Object) {
    this._highlight();
    Logger.log('Pan Responder Grant',gestureState.dx)

  },
  _handlePanResponderMove(e: Object, gestureState: Object) {
    // Logger.log('Pan Responder MOVE',gestureState.dx)

    this._cardStyles.left = this._previousLeft + gestureState.dx;
    this._cardStyles.top = this._previousTop + gestureState.dy;
    this._updatePosition();

  },
  _handlePanResponderEnd(e: Object, gestureState: Object) {
    this._unHighlight();
    Logger.log('Pan Responder End',Math.abs(gestureState.moveX))

    if(Math.abs(gestureState.dx) > THROW_OUT_THRESHOLD ){

      Logger.debug('throwout',gestureState.dx)

        this.setState({
          isAnimating: true
        })

        var self = this;

        var animation = new RNTAnimation({

          // Start state
          start: {
            top: this._cardStyles.top,
            left: this._cardStyles.left
          },

          // End state
          end: {
            top: 0,
            left: 0
          },

          // Animation duration
          duration: 500,

          // Tween function
          tween: 'easeOutBack',

          // Update the component's state each frame
          frame: (tweenFrame) => {
            console.log(tweenFrame);

            self._updatePosition( tweenFrame );


          },

          // Optional callback
          done: () => {

            console.log('All done!');
            self.replaceState({
              isAnimating:false,
              position: {
                left:0,
                top:0
              }
            })
            // Optionally reverse the animation
            // animation.reverse(() => {});
          }
        });

    }else{

        this.setState({
          isAnimating: true
        })

        var self = this;


        var animation = new RNTAnimation({

          // Start state
          start: {
            top: this._cardStyles.top,
            left: this._cardStyles.left
          },

          // End state
          end: {
            top: 0,
            left: 0
          },

          // Animation duration
          duration: 500,

          // Tween function
          tween: 'easeOutBack',

          // Update the component's state each frame
          frame: (tweenFrame) => {

            console.log(tweenFrame);

            self._updatePosition( tweenFrame );
          },

          // Optional callback
          done: () => {

            console.log('All done!');
            self.replaceState({
              isAnimating:false,
              position: {
                left:0,
                top:0
              }
            })
            // Optionally reverse the animation
            // animation.reverse(() => {});
          }
        });





    }


  },
});


class SwipableCard extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (

      <View style={{margin:20,left:0,width:DeviceWidth-40,height:DeviceHeight - 80,overflow:'hidden'}}>
        <ActiveCard user={this.props.user} potential={this.props.potential}/>
        <View style={{height:80,bottom:0,position:'absolute',backgroundColor:colors.white,width: DeviceWidth-40, flex:5, alignSelf:'stretch'}}>
          <Text style={styles.cardBottomText}>{`${this.props.potential[0].firstname} and ${this.props.potential[1].firstname}`}</Text>

          <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
            <Image source={{uri: this.props.potential[0].image_url}} style={[styles.circleimage,{marginRight:5}]}/>
            <Image source={{uri: this.props.potential[1].image_url}} style={styles.circleimage}/>
          </View>

        </View>
      </View>

    )
  }
}

class CoupleActiveCard extends React.Component{
  constructor(props){
    super(props)
    console.log(props)
  }
  render(){
      // var potential = this.props.potentials[0];

      return(
        <View style={[styles.card]}>
        <Swiper
          loop={true}
          horizontal={false}
          vertical={true}
          showsPagination={true}
          showsButtons={false}
          dot={ <View style={styles.dot} />}
          activeDot={ <View style={styles.activeDot} /> }>
          <Image source={{uri: this.props.potential[0].image_url}} style={styles.imagebg} />
          <Image source={{uri: this.props.potential[1].image_url}} style={styles.imagebg} />
        </Swiper>

        <View style={{height:80,bottom:0,position:'absolute',backgroundColor:colors.white,width: DeviceWidth-40, flex:5, alignSelf:'stretch'}}>
          <Text style={styles.cardBottomText}>{`${this.props.potential[0].firstname} and ${this.props.potential[1].firstname}`}</Text>

          <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
            <Image source={{uri: this.props.potential[0].image_url}} style={[styles.circleimage,{marginRight:5}]}/>
            <Image source={{uri: this.props.potential[1].image_url}} style={styles.circleimage}/>
          </View>

        </View>
      </View>

      )

  }
}

// stub
class CardStack extends React.Component{
  constructor(props){
    console.log('SinglesCardStack')
    super(props)
  }
  render(){
      if(this.props.potentials.length){
        return (
          <ActiveCard user={this.props.user} potential={this.props.potentials[0]}/>
        )
      }else{
         return(
          <View user={this.props.user} potential={this.props.potentials}>
            <TouchableHighlight onPress={() => MatchActions.getPotentials()}>
              <View>
                <Text> get </Text>
              </View>
            </TouchableHighlight>
          </View>
        )
       }
   }
}

class Potentials extends React.Component{
  constructor(props){
    super(props)
  }
  render(){


    return(
      <AltContainer
        stores={{
          potentials (props) {
            return {
              store: PotentialsStore,
              value: PotentialsStore.getAll()
            }
          }
        }}>
        <CardStack user={this.props.user} />

      </AltContainer>

    )
  }
}


module.exports = Potentials;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow:'hidden',
    top:50
  },
  innerContainer:{
    backgroundColor: '#fff',
    paddingBottom:50,
    paddingTop:0,
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
    height: undefined,
    bottom:0,
    top:0,
    left:0,
    right:0,

  },
  absoluteText:{
    position:'absolute',
    color:'#ffffff',
    backgroundColor:'transparent',
    fontSize:20
  },
  absoluteTextTop:{
    top:0
  },
  absoluteTextBottom:{
    bottom:0
  },
  card: {
    borderRadius:10,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    flex: 1,

    borderWidth: 1,
    borderColor:'#ddd',
    justifyContent: 'center',
    alignItems: 'center',

  },
  singleCard:{
    backgroundColor:'#fff',
    flexDirection:'column',
    alignItems:'stretch',
    flex:1,

  },
  coupleCard:{
    backgroundColor:'#fff',
    flexDirection:'column',
    alignSelf:'stretch',
    flex:1,
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    margin:0,
    padding:0,
    alignItems:'stretch',
    flexDirection:'column',
    width: undefined
  },
  absoluteCard:{
    // position:'absolute',

    left:0,
    right:0,
    bottom:0,
    top:0
  },
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 3,
    marginBottom: 3,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.outerSpace,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 3,
    marginBottom: 3,
    borderWidth: 2,
    borderColor: colors.mediumPurple20
  },
  circleimage:{
    backgroundColor: colors.shuttleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: colors.shuttleGray,
    borderColor:colors.white,
    borderWidth: 3
  },
  carousel:{
    backgroundColor:'#fff',
    alignSelf:'stretch',
    flex:1,
    width: DeviceWidth-40,
    margin:20,
    height:DeviceHeight - 80,
    top:40

  },
  cardBottomText:{
    marginLeft:15,
    fontFamily:'Montserrat',
    color: colors.shuttleGray,
    fontSize:22,
    marginTop:10
  }
});
