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
  AppStateIOS,
  Easing,
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
      offsetY: new Animated.Value(0),
      appState: AppStateIOS.currentState,
      likedPotentials:[]
    }
  }
  componentWillMount(){
    this._panResponder = {}
    Mixpanel.track('On - Potentials Screen');

  }
  _handleAppStateChange(currentAppState){

    if(currentAppState == 'active'){

    }else{

      AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));
    }



  }
  componentDidMount(){
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));

    Animated.timing(this.state.offsetY,{
      toValue: 1,
      duration: 300,
      delay:150,
      easing: Easing.in(Easing.ease)
    }).start((fin)=> {
      this.initializePanResponder()
      this.setState({animatedIn:true});

    })
  }
  componentWillUnmount(){
    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));

  }
  componentWillReceiveProps(nProps){
    if(nProps && this.state.animatedIn && this.props.potentials && this.props.potentials[0].user.id != nProps.potentials[0].user.id ){
        this.state.pan.setValue({x: 0, y: 0});
        // this.initializePanResponder()
    }
    if(nProps && !this.state.animatedIn && !nProps.potentials.length ){
          this.state.offsetY.setValue(0);
        // this.initializePanResponder()
    }

    this.setState({interactedWith:null})


  }

  componentDidUpdate(pProps,prevState){
    if(!this.state.animatedIn && this.state.animatedIn){
      this.initializePanResponder()

    }
    if( pProps.potentials && pProps.potentials.length && pProps.potentials[0].user.id != this.props.potentials[0].user.id){
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
            velocity = 1,
            likeStatus;

        const {dx,dy,vx,vy} = gestureState;
        const likeUserId = this.props.potentials[0].user.id;

        // animate back to center or off screen left or off screen right
        if (dx > SWIPE_THRESHOLD_APPROVE || (dx > THROW_THRESHOLD_APPROVE && Math.abs(vx) > THROW_SPEED_THRESHOLD)){
          toValue = 700;
          velocity = {x: vx*2, y: vy*2}

           likeStatus =   'approve';

          if(!this.state.likedPotentials.indexOf(likeUserId)){
            MatchActions.removePotential(likeUserId);
            likestatus = null;
          }

        }else if(dx < SWIPE_THRESHOLD_DENY || (dx < THROW_THRESHOLD_DENY && Math.abs(vx) > THROW_SPEED_THRESHOLD)){
          toValue = -700;
          velocity = {x: vx*2, y: vy*2}
           likeStatus =  'deny';




        }else{

        }
        if(!likeUserId){
          MatchActions.removePotential(likeUserId);
        }else if(likeStatus && likeStatus.length > 0){
          MatchActions.removePotential(likeUserId);
          MatchActions.sendLike( likeUserId, likeStatus, (this.props.rel == 'single' ? 'couple' : 'single'), this.props.rel );

          this.setState({interactedWith:likeUserId,likedPotentials:[...this.state.likedPotentials, likeUserId]})
        }


      //  this.state.pan.addListener((value) => {

        //
        //   // if(!value || !value.x ){ return false }
        //   let likeStatus = value.x > 0 ? 'approve' : 'deny';
        //   // console.log(value.x,Math.abs(Math.floor(value.x)))
        //   // when the card reaches the throw out threshold, send like
        //   // console.log('this.state.pan.xthis.state.pan.x',this.state.pan.x)
        //
        //   let v = Math.abs(Math.ceil(value.x))
        //   if ( v == 500) {
        //
        //     MatchActions.removePotential(likeUserId);
        //
        //     if(this.state.interactedWith != likeUserId && this.state.interactedWith != `${likeUserId}settled`){
        //       if(!this.state.likedPotentials.indexOf(likeUserId)){
        //         MatchActions.sendLike(
        //         likeUserId,
        //         likeStatus,
        //         (this.props.rel == 'single' ? 'couple' : 'single'),
        //         this.props.rel
        //       );
        //     }
        //       this.setState({interactedWith:likeUserId,likedPotentials:[...this.state.likedPotentials, likeUserId]})
        //     }else if(this.state.interactedWith == likeUserId && this.state.interactedWith != `${likeUserId}settled`){
        //         this.setState({interactedWith:`${likeUserId}settled`})
        //     }
        //       if(this.state.pan.x._listeners.length){
        //         this.state.pan.x.removeAllListeners();
        //         this.state.pan.x.removeListener(this._actionlistener)
        //     }
        //
        //   }
        // })
        Animated.spring(this.state.pan, {
          toValue,
          velocity,       // maintain gesture velocity
          tension: 40,
          friction: 2,
        }).start((result)=>{
          if(!result.finished){

          }
        });

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
        style={{ position:'absolute',
        top: 0,
        left:0,
        width: undefined,
        height:undefined,
        flex:1,
        alignSelf:'stretch',
        right: 0,
        bottom:0,
        backgroundColor: this.props.profileVisible ? 'black' : 'transparent',
        alignItems:'center'
        }}>

        { potentials && potentials.length >= 1  && potentials[1] &&
          <Animated.View
            style={[styles.shadowCard,{
            alignSelf:'center',
            // left:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20 ,
            // width: this.props.profileVisible ? DeviceWidth : DeviceWidth - 50,
            // height: this.props.profileVisible ? DeviceHeight : DeviceHeight - 120,
            // right:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20,
            // marginHorizontal: this.props.profileVisible ? 0 : 20,
            // position: 'absolute',
            left:this.props.profileVisible ? 0 : 20,right:this.props.profileVisible ? 0 : 20,
            borderRadius:8,
            bottom: this.props.profileVisible ? 0 : (DeviceHeight <= 568 ? 75 : 75),
            position: 'absolute',
            overflow:'hidden',
            top:0

          },
          {
            transform: [



              {
                scale: this.state.animatedIn ? (this.props.profileVisible ? 1 : this.state.pan.x.interpolate({
                  inputRange: [ -300, -250, -100, 0,  100, 250, 300],
                  outputRange:   [ 0.98, 0.97, 0.9, 0.9, 0.9, 0.97, 0.98 ],//[    0.98,  0.98,  1, 1, 1,  0.98, 0.98, ]
                  extrapolate: 'clamp',

                }) ): this.state.offsetY
              }

            ],
            opacity: this.state.animatedIn ?  this.state.pan.x.interpolate({
              inputRange: [-300,  -200, -50, 0, 50, 200, 300],
              outputRange:   [  .77, .75, 0.05, 0.0,  0.05, .75,   .77],//[    0.98,  0.98,  1, 1, 1,  0.98, 0.98, ]
              extrapolate: 'clamp',

            }) : 0
          }]}
          key={`${potentials[1].id || potentials[1].user.id}-wrapper`}
          ref={(card) => { this.card = card }}
          >
          <Card
            user={user}
            key={`${potentials[1].id || potentials[1].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard={false}
            pan={this.state.pan}
            animatedIn={this.state.animatedIn}
            profileVisible={false}
            potential={potentials[1]}
          />
          </Animated.View>

        }

        { potentials &&  potentials[0] &&
          <Animated.View
            style={[styles.shadowCard,{
            alignSelf:'center',
            top: this.props.profileVisible ? -50 :  0,
            // left:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20 ,
            // width: this.props.profileVisible ? DeviceWidth : DeviceWidth - 50,
            // height: this.props.profileVisible ? DeviceHeight : DeviceHeight - 120,
            // right:  this.props.profileVisible ? -DeviceWidth/2 : -DeviceWidth/2 + 20,
            // marginHorizontal: this.props.profileVisible ? 0 : 20,
            // position: 'absolute',
            left:this.props.profileVisible ? 0 :20,right:this.props.profileVisible ? 0 : 20,
            borderRadius:8,
            bottom: this.props.profileVisible ? 0 : (DeviceHeight <= 568 ? 80 : 70),
            position: 'absolute',
            overflow:'hidden'

          },
          {
            opacity:   this.state.offsetY,

            transform: [

              {
                translateX: this.state.pan ? this.state.pan.x : 0
              },
              {
                rotate: Animated.multiply(this.state.pan.x,Animated.add(this.state.pan.y,this.state.pan.y)).interpolate({
                  // inputRange: [-DeviceWidth*2,-DeviceWidth*2, -DeviceWidth, -DeviceWidth, 0, DeviceWidth, DeviceWidth, DeviceWidth*2,DeviceWidth*2],
                  // outputRange: ['-8deg','-8deg','-4deg','0deg','0deg','0deg', '4deg','8deg','8deg'],

                                   extrapolate: 'clamp',
                                  inputRange: [-DeviceWidth*1000,DeviceWidth*1000],
                                  outputRange:["-0.5rad","0.5rad"]
                })
              },
              {
                translateY: this.state.animatedIn ?  this.state.pan.y.interpolate({
                  inputRange: [-300, 0, 300],
                  outputRange: [-150,0,150]
                }) : this.state.offsetY
              },
              {
                scale:  this.state.animatedIn ?  (this.props.profileVisible ? 1 : this.state.pan.x.interpolate({
                  inputRange: [-300, -250, -90, 0,  90, 250, 300],
                  outputRange: [    0.98,  0.98,  1, 1, 1,  0.98, 0.98, ]
                })) : this.state.offsetY.interpolate({
                  inputRange: [0, 0.9, 1],
                  outputRange: [.9, 1.0, .98]
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
