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
 InteractionManager,
 PanResponder
} = React;


var tweenState = require('react-tween-state');
var MatchActions = require('../flux/actions/MatchActions');
var PotentialsStore = require("../flux/stores/PotentialsStore");
var alt = require('../flux/alt')
var AltContainer = require('alt/AltNativeContainer');
var Logger = require('../utils/logger');

const THROW_OUT_THRESHOLD = 250;


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
    right:0

  },

  card: {
    margin:30,
    borderRadius:10,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 1,
    borderColor:'#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
    height: undefined

  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch'
  },
  absoluteCard:{
    position:'absolute',

    left:0,
    right:0,
    bottom:0,
    top:0
  }
});


var ActiveCard = React.createClass({

  mixins: [tweenState.Mixin],

  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  _handle: '',
  card: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onStartShouldSetResponderCapture: () => true,
      onMoveShouldSetResponderCapture: () => true,
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

  getInitialState: function(){
    return ({
      position: {
       left: this._previousLeft,
       top: this._previousTop,
     },
     isAnimating:false
    })
  },
  componentDidMount: function() {
    this._updatePosition();

  },

  render: function() {

    return (


        <View key="activecard" ref={(card) => { this.card = card }} style={styles.card} {...this._panResponder.panHandlers} >
          <Image source={{uri: this.props.potential[0].image_url}} style={styles.imagebg} >
            <Text>{this.props.potential[0].firstname}</Text>

          </Image>
        </View>
    );
  },

  _highlight: function() {
    this.card && this.card.setNativeProps({
      shadowColor: 'rgba(0,0,0,.5)',
      shadowOffset: {width:0, height: 0},
      shadowOpacity: 0.5,
      shadowRadius: 10
    });
  },

  _unHighlight: function() {
    this.card && this.card.setNativeProps({
      shadowOpacity: 0,
    });
  },
  componentDidUpdate: function(prevProps,prevState){
    Logger.log('componentDidUpdate',this.state.isAnimating,'left: ' +this.getTweeningValue((state) => {return state.position},'left'));
    if(this.state.isAnimating){
      this._updatePosition({
        left: this.getTweeningValue((state) => {return state.position},'left'),
        top: this.getTweeningValue((state) => {return state.position},'top')
      });
    }
  },

  _updatePosition: function(position) {

    this.card && this.card.setNativeProps(position ? position : this._cardStyles);
  },

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the circle?
    return true;
  },

  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    this._handle = InteractionManager.createInteractionHandle(gestureState.stateID);
    this._highlight();
    Logger.log('Pan Responder Grant',gestureState.dx)

  },
  _handlePanResponderMove: function(e: Object, gestureState: Object) {
    // Logger.log('Pan Responder MOVE',gestureState.dx)

    this._cardStyles.left = this._previousLeft + gestureState.dx;
    this._cardStyles.top = this._previousTop + gestureState.dy;
    this._updatePosition();

  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this._unHighlight();
    Logger.log('Pan Responder End',Math.abs(gestureState.moveX))

    if(Math.abs(gestureState.dx) > THROW_OUT_THRESHOLD ){

      Logger.debug('throwout',gestureState.dx)
      InteractionManager.runAfterInteractions(() => {

        this.setState({
          isAnimating: true
        })

        this.tweenState((state)=>{return state.position}, 'top',{
          easing: tweenState.easingTypes.easeOutElastic,
          duration: 700,
          stackBehavior: tweenState.stackBehavior.ADDITIVE,
          beginValue: this._cardStyles.top,
          endValue:  300,
          onEnd: () => {
            // this.replaceState({isAnimating:false,position: {left:0,top:0}})
          }
        });
        this.tweenState((state)=>{return state.position}, 'left',{
          easing: tweenState.easingTypes.easeOutElastic,
          duration: 705,
          stackBehavior: tweenState.stackBehavior.ADDITIVE,
          beginValue: this._cardStyles.left,
          endValue:  gestureState.dx > 0 ? 500 : -500,
          onEnd: () => {
            let likeStatus = gestureState.dx > 0 ? 'approve' : 'deny';
            this.replaceState({isAnimating:false,position: {left:0,top:0}})
            MatchActions.sendLike(this.props.potential[0].id,likeStatus);
          }
        });
      });
    }else{
      InteractionManager.runAfterInteractions(() => {

        this.setState({
          isAnimating: true
        })

        this.tweenState((state)=>{return state.position}, 'top',{
          easing: tweenState.easingTypes.easeOutElastic,
          duration: 550,
          stackBehavior: tweenState.stackBehavior.ADDITIVE,
          beginValue: this._cardStyles.top,
          endValue:  0,
          onEnd: () => {Logger.log('ONEND');
            this.replaceState({isAnimating:false,position: {left:0,top:0}})
          }
        });
        this.tweenState((state)=>{return state.position}, 'left',{
          easing: tweenState.easingTypes.easeOutElastic,
          duration: 555,
          stackBehavior: tweenState.stackBehavior.ADDITIVE,
          beginValue: this._cardStyles.left,
          endValue:  0,
          onEnd: () => {
            Logger.log('ONEND2');
            this.replaceState({
              isAnimating:false,
              position: {
                left:0,
                top:0
              }
            })
          }
        });

      })


    }

    InteractionManager.clearInteractionHandle(this._handle);

  },
});

class InactiveCard extends React.Component{
  render(){


    return (
      <View style={[styles.card,styles.absoluteCard]}>
        <Image source={{uri: this.props.potential[0].image_url}} style={styles.imagebg} >
          <Text>{this.props.potential[0].firstname}</Text>

        </Image>
      </View>

    )


  }
}


class CardStack extends React.Component{
  render(){
    var inactiveCards = this.props.potentials.map((potential,index) =>{
          return(
            <InactiveCard potential={potential}  key={'potential'+index}/>
          );
        });

    Logger.log(this.props,'ACTIVE');
    return(
      <View style={styles.container} pointerEvents="box-none">
        <ActiveCard potential={this.props.potentials.length ? this.props.potentials[0] : []}/>
      </View>
      )
  }
}

class Potentials extends React.Component{
  render(){

    return(
      <AltContainer
        stores={{
          potentials: function (props) {
            return {
              store: PotentialsStore,
              value: PotentialsStore.getAll()
            }
          }
        }}>
        <CardStack />
      </AltContainer>

    )
  }
}


module.exports = Potentials;
