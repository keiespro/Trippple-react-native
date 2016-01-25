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
  PanResponder,
  Dimensions
} from 'react-native';

import styles from './styles'
import animations from './LayoutAnimations'
import MatchActions from '../../flux/actions/MatchActions';
import Mixpanel from '../../utils/mixpanel';
import colors from '../../utils/colors';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../DeviceConfig'
import Card from './Card'


class CardStack extends React.Component{

  static displayName = 'CardStack';

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
    if(nProps && this.state.animatedIn && this.props.potentials[0].user.id != nProps.potentials[0].user.id ){
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
          const likeUserId = this.props.potentials[0].user.id;
          if(!value || !value.x ){ return false }
            const likeStatus = value.x > 0 ? 'approve' : 'deny';

          // when the card reaches the throw out threshold, send like
          if (Math.abs(value.x) >= 300) {

            // if(this.state.pan && this._actionlistener && this.state.pan._listeners[this._actionlistener]){
              // this.state.pan.removeListener(this._actionlistener);
              //
               // this.state.pan.x.removeListener(this.state.pan._listeners[this._actionlistener]);

            // }
            if(this.state.interactedWith != likeUserId ){
              MatchActions.sendLike(
              likeUserId,
              likeStatus,
              (this.props.rel == 'single' ? 'couple' : 'single'),
              this.props.rel
            );

            this.setState({interactedWith:likeUserId})
            this.state.pan && this.state.pan.x &&  this.state.pan.x._listeners.length && this.state.pan.x.removeAllListeners()

           }
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
    this.state.pan.setValue({x: 0, y: 0})
  }

  _toggleProfile(){
    this.props.toggleProfile()
    this.state.pan.setValue({x: 0, y: 0})

  }

  render() {
    var {potentials,user} = this.props

    if(this.state.animatedIn && !this._panResponder.panHandlers){
       this.initializePanResponder()
    }
    var pan = this.state.pan || 0
    return (
      <View
      style={{ position:'absolute',              // backgroundColor:colors.mediumPurple,
              top: 0,
              left:0,
              width: undefined,
              height:undefined,
              flex:1,
              alignSelf:'stretch',
              right: 0,
              bottom:0,
              alignItems:'center'
      }}>

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
              top:  (DeviceHeight <= 568 ? 50 : 30),
              // width: DeviceWidth - 40,
              // height:  DeviceHeight - 80,
                position: 'absolute',
              marginHorizontal: this.props.profileVisible ? 0 : 20,
              marginLeft:20,
              overflow:'hidden',
            position: 'absolute',
              left:0,right:0,

              marginBottom:20
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
              marginHorizontal: this.props.profileVisible ? 0 : 20,
              marginLeft:20,
              overflow:'hidden',
            position: 'absolute',
              left:0,right:0,
              borderRadius:8,

                // top:  (DeviceHeight <= 568 ? -5 : -30),
                // // width: DeviceWidth - 40,
                // // height: (DeviceHeight <= 568 ? (DeviceHeight - 75) : (DeviceHeight-65)),
                // position: 'absolute',
                // bottom:  (DeviceHeight <= 568 ? 80 : 40),
                backgroundColor:'black',
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
            top: this.props.profileVisible ? -45 :  (DeviceHeight <= 568 ? -20 : -10),
            // left:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20 ,
            // width: this.props.profileVisible ? DeviceWidth : DeviceWidth - 50,
            // height: this.props.profileVisible ? DeviceHeight : DeviceHeight - 120,
            // right:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20,
              marginHorizontal: this.props.profileVisible ? 0 : 20,
              marginLeft:20,
              overflow:this.props.profileVisible ? 'visible' : 'hidden',
            // position: 'absolute',
              left:0,right:0,
              borderRadius:8,
            bottom: this.props.profileVisible ? 0 : (DeviceHeight <= 568 ? 70 : 90),
           position: 'absolute',

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
                  // /* extrapolate: 'clamp'*/
                })
              },
              {
                translateY: this.state.animatedIn ?  this.state.pan.y.interpolate({
                  inputRange: [-300, 0, 500],
                  outputRange: [-150,0,150]
                }) : this.state.offsetY.a
              },
              {
                scale: this.props.profileVisible ? 1 : this.state.pan.x.interpolate({
                  inputRange: [-300, -250, -90, 0,  90, 250, 300],
                  outputRange: [    0.98,  0.98,  1, 1, 1,  0.98, 0.98, ]
                })
              }
            ],
          }]}
          key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
          ref={(card) => { this.card = card }}
          { ...this._panResponder.panHandlers}
          >
          <Card
            user={user}
            navigator={this.props.navigator}
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
