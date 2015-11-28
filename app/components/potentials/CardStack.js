/* @flow */


const THROW_THRESHOLD_DENY = -180,
      THROW_THRESHOLD_APPROVE = 180,
      SWIPE_THRESHOLD_APPROVE = 230,
      SWIPE_THRESHOLD_DENY = -230,
      THROW_SPEED_THRESHOLD = 2.5;

import React, {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,
  Animated,
  ActivityIndicatorIOS,
  PanResponder,
  Dimensions
} from 'react-native';

import styles from './styles'
import LayoutAnimations from './LayoutAnimations'
import MatchActions from '../../flux/actions/MatchActions';
import Mixpanel from '../../utils/mixpanel';
import TimerMixin from 'react-timer-mixin';
import colors from '../../utils/colors';
import reactMixin from 'react-mixin';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../DeviceConfig'
import Card from './Card'

@reactMixin.decorate(TimerMixin)
class CardStack extends React.Component{

  static displayName = 'CardStack'

  constructor(props){
    super()
    this.state = {
      pan: new Animated.ValueXY(),
      animatedIn:false,
      offsetY: {
        a:new Animated.Value(-DeviceHeight),
        b:new Animated.Value(-DeviceHeight),
        c:new Animated.Value(-DeviceHeight),
      }
    }
  }
  componentWillMount(){
    this._panResponder = {}
    Mixpanel.track('On - Potentials Screen');

  }
  componentDidMount(){

    Animated.stagger(300,[
      Animated.spring(this.state.offsetY.c,{
        toValue: 0,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(this.state.offsetY.b,{
        toValue: 0,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(this.state.offsetY.a,{
        toValue: 0,
        tension: 50,
        friction: 7,
      })
    ]).start((fin)=> {
      this.initializePanResponder()
      this.setState({animatedIn:true});

    })
  }
  componentWillReceiveProps(nProps){
    if(this.state.animatedIn && this.props.potentials[0].user.id != nProps.potentials[0].user.id ){
        this.state.pan.setValue({x: 0, y: 0});
        // this.initializePanResponder()
    }


  }

  componentDidUpdate(pProps,prevState){
    if(!prevState.animatedIn && this.state.animatedIn){
      this.initializePanResponder()
    }
    if( pProps.potentials[0].user.id != this.props.potentials[0].user.id){
      LayoutAnimation.configureNext(animations.layout.spring);

    }

  }

  initializePanResponder(){
    delete this._panResponder

    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e,gestureState) => {
        return false;
      },

      onMoveShouldSetPanResponder: (e,gestureState) => {
        return !this.props.profileVisible && Math.abs(gestureState.dy) < 5
      },

      onStartShouldSetPanResponder: (e,gestureState) => {
        // set a timeout to open profile, if no moves have happened
        return false
      },
      onPanResponderReject: (e, gestureState) => {
      },

      onPanResponderMove: Animated.event([null, {
         dx: this.state.pan.x, // x,y are Animated.Value
         dy: this.state.pan.y
      }]),

      onPanResponderRelease: (e, gestureState) => {

        var toValue = 0,
            velocity = 1;

        const {dx,dy,vx,vy} = gestureState;

        // animate back to center or off screen left or off screen right
        if (dx > SWIPE_THRESHOLD_APPROVE || dx > THROW_THRESHOLD_APPROVE && Math.abs(vx) > THROW_SPEED_THRESHOLD){
          toValue = 600;
          velocity = {x: vx, y: vy}
        }else if(dx < SWIPE_THRESHOLD_DENY || dx < THROW_THRESHOLD_DENY && Math.abs(vx) > THROW_SPEED_THRESHOLD){
          toValue = -600;
          velocity = {x: vx, y: vy}
        }


        Animated.spring(this.state.pan, {
          toValue,
          velocity,       // maintain gesture velocity
          tension: 60,
          friction: 4,
        }).start((result)=>{
          if(!result.finished){

          }
        });


        this._actionlistener = this.state.pan.addListener((value) => {
          if(!value || !value.x){ return false }
          // when the card reaches the throw out threshold, send like
          if (Math.abs(value.x) >= 600) {

            const likeStatus = value.x > 0 ? 'approve' : 'deny',
                  likeUserId = this.props.potentials[0].user.id;
            this.state.pan && this._actionlistener && this._actionlistener.x && this.state.pan.removeListener(this._actionlistener);

            MatchActions.sendLike(
              likeUserId,
              likeStatus,
              (this.props.rel == 'single' ? 'couple' : 'single'),
              this.props.rel
            );
          }
        })
      }
    })
  }

  _showProfile(potential){
    this.props.toggleProfile(potential);
  }

  _hideProfile(){
    this.props.toggleProfile()
    // this.state.pan.setValue({x: 0, y: 0})
  }

  _toggleProfile(){
    this.props.toggleProfile()
    // this.state.pan.setValue({x: 0, y: 0})

  }

  render() {
    var {potentials,user} = this.props

    if(this.state.animatedIn && !this._panResponder.panHandlers){
       this.initializePanResponder()
    }
    var pan = this.state.pan || 0
    return (
      <View
        onLayout={(e)=>{
          const {x, y, width, height} =  e.nativeEvent.layout;
          console.log(x, y, width, height)
        }}
        style={{ }}>

      {/*     last card      */}
      { !this.props.profileVisible && potentials && potentials.length >= 1 && potentials[2] &&
        <Animated.View
          key={`${potentials[2].id || potentials[2].user.id}-wrapper`}
          style={[
            styles.basicCard,
            {
              transform:[ { translateY: this.state.offsetY.c },
              {scale: .85}],
              flex:1,
              backgroundColor:colors.white,
              top: -DeviceHeight/2+65,
              left:   -DeviceWidth/2 + 20 ,
              width: DeviceWidth - 40,
              height:  DeviceHeight - 80,
              left:   -DeviceWidth/2 + 20 ,
              position: 'absolute'

            }]
          }>
          <Card
            user={user}
            ref={"_thirdCard"}
          animatedIn={this.state.animatedIn}
            potential={potentials[2]}
            rel={user.relationship_status}
            isTopCard={false}
            isThirdCard={true}
            key={`${potentials[2].id || potentials[2].user.id}-activecard`}
          />
        </Animated.View>
      }

      {/*       Middle card       */}
      { !this.props.profileVisible && potentials && potentials.length >= 1 && potentials[1] &&

        <Animated.View
          style={[{
                transform:[
                {
                  translateY: this.state.offsetY.b
                },{
                  scale:0.925
                }],
                alignSelf:'flex-start',
                flex:1,
            top:  -DeviceHeight/2+33,
            left: -DeviceWidth/2 + 20 ,
            width: DeviceWidth - 40,
            height: DeviceHeight - 80,
            left:  -DeviceWidth/2 + 20 ,
            position: 'absolute',

                marginBottom:20,
                position:'absolute',
                shadowColor:colors.dark,
                shadowRadius:3,
                shadowOpacity:0.5,
                shadowOffset: {
                  width:0,
                  height: 5
                },

          }]}
          key={`${potentials[1].id || potentials[1].user.id}-wrapper`}
          ref={(card) => { this.nextcard = card }}
        >
          <Card
            key={`${potentials[1].id || potentials[1].user.id}-activecard`}
            user={user}
            ref={"_secondCard"}
            pan={this.state.pan}
            profileVisible={this.props.profileVisible}
          animatedIn={this.state.animatedIn}

            potential={potentials[1]}
            rel={user.relationship_status}
          />
        </Animated.View>
      }

      {/*       Front card       */}
      { potentials && potentials.length >= 1  && potentials[0] &&
        <Animated.View
          style={[styles.shadowCard,{
            alignSelf:'center',
            top: this.props.profileVisible ? -DeviceHeight/2-20  : -DeviceHeight/2+0,
            left:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20 ,
            width: this.props.profileVisible ? DeviceWidth : DeviceWidth - 40,
            height: this.props.profileVisible ? DeviceHeight : DeviceHeight - 80,
            left:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20 ,
            position: 'absolute'
          },
          {
            transform: [
              {
                translateX: this.state.pan ? this.state.pan.x : 0
              },
              {
                rotate: this.state.pan.y.interpolate({
                  inputRange: [-300,  300],
                  outputRange: ['8deg','-8deg'],
                  /* extrapolate: 'clamp'*/
                })
              },
              {
                translateY: this.state.animatedIn ?  this.state.pan.y.interpolate({
                  inputRange: [-300, 0, 500],
                  outputRange: [-150,0,150]
                }) : this.state.offsetY.a
              },
              // {
              //   scale: this.props.profileVisible ? 1 : this.state.pan.x.interpolate({
              //     inputRange: [-300, -250, -90, 0,  90, 250, 300],
              //     outputRange: [    0.95,  0.95,  0.9, 0.9, 0.9, 1, 1]
              //   })
              // }
            ],
          }]}
          key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
          ref={(card) => { this.card = card }}
          { ...this._panResponder.panHandlers}
          >
          <Card
            user={user}
            key={`${potentials[0].id || potentials[0].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard={true}
            pan={this.state.pan}
          animatedIn={this.state.animatedIn}

            profileVisible={this.props.profileVisible}
            hideProfile={this._hideProfile.bind(this)}
            toggleProfile={this._toggleProfile.bind(this)}
            showProfile={this._showProfile.bind(this)}
            potential={potentials[0]}
          />
          </Animated.View>

      }

      </View>

    );

  }
}

export default CardStack
