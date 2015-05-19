/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput,
 PanResponder
} = React;


var tweenState = require('react-tween-state');


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
    paddingBottom:20,
    paddingTop:0,
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
    height: undefined

  },

  card: {
    margin:30,
    borderRadius:10,
    backgroundColor: 'blue',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
    height: undefined

  }
});


var Potentials = React.createClass({

  mixins: [tweenState.Mixin],

  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
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
    // this.props.navigator.immediatelyResetRouteStack([this.props.route])

  },

  render: function() {

    return (
      <View style={styles.container} pointerEvents="box-none">

        <View style={styles.innerContainer} pointerEvents="box-none">

          <View
            ref={(card) => {
              this.card = card;
            }}
            style={styles.card}
            {...this._panResponder.panHandlers}
          />
        </View>
      </View>
    );
  },

  _highlight: function() {
    this.card && this.card.setNativeProps({
      backgroundColor: 'yellow'
    });
  },

  _unHighlight: function() {
    this.card && this.card.setNativeProps({
      backgroundColor: 'green'
    });
  },
  componentDidUpdate: function(prevProps,prevState){
    console.log('componentDidUpdate',this.state.isAnimating,'left: ' +this.getTweeningValue((state) => {return state.position},'left'));
    if(this.state.isAnimating){
      this._updatePosition({
        left: this.getTweeningValue((state) => {return state.position},'left'),
        top: this.getTweeningValue((state) => {return state.position},'top')
      });
    }
  },

  _updatePosition: function(position) {
    console.log(position)

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
    this._highlight();
  },
  _handlePanResponderMove: function(e: Object, gestureState: Object) {
    this._cardStyles.left = this._previousLeft + gestureState.dx;
    this._cardStyles.top = this._previousTop + gestureState.dy;
    this._updatePosition();
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this._unHighlight();
console.log('Pan Responder End')
    this.setState({
      // position: this._cardStyles,
      isAnimating: true
    })

    this.tweenState((state)=>{return state.position}, 'top',{
      easing: tweenState.easingTypes.easeOutElastic,
      duration: 350,
      stackBehavior: tweenState.stackBehavior.ADDITIVE,
      beginValue: this._cardStyles.top,
      endValue:  0,
      onEnd: () => {console.log('ONEND');this.replaceState({isAnimating:false,position: {left:0,top:0}})}
    });
    this.tweenState((state)=>{return state.position}, 'left',{
      easing: tweenState.easingTypes.easeOutElastic,
      duration: 350,
      stackBehavior: tweenState.stackBehavior.ADDITIVE,
      beginValue: this._cardStyles.left,
      endValue:  0,
      onEnd: () => {console.log('ONEND2');this.replaceState({isAnimating:false,position: {left:0,top:0}})}
    });

  },
});

module.exports = Potentials;
