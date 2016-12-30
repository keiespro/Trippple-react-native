import React from 'react';
import { StatusBar, View, Easing, LayoutAnimation, Image, Animated, PanResponder, Dimensions, InteractionManager, Platform } from 'react-native';
import { NavigationActions } from '@exponent/ex-navigation'
import {pure,onlyUpdateForKeys} from 'recompose'
import Analytics from '../../../utils/Analytics';
import Card from './Card';
import styles from './styles';
import ActionMan from '../../../actions/';
import ApproveIcon from './ApproveIcon'
import DenyIcon from './DenyIcon'
import Router from '../../../Router'
import TimerMixin from 'react-timer-mixin';

import reactMixin from 'react-mixin'


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const iOS = Platform.OS == 'ios';

const THROW_THRESHOLD_DENY = -1 * (20);
const THROW_THRESHOLD_APPROVE = 20;
const THROW_SPEED_THRESHOLD = 1;

const SWIPE_THRESHOLD_DENY = -180;
const SWIPE_THRESHOLD_APPROVE = 140;

function logPan(label, gestureState, nativeEvent){
  if(__DEBUG__){
    // console.group('onMoveShouldSetPanResponder')
    // console.info('nativeEvent')
    // console.table([nativeEvent], ['locationX', 'locationY', 'pageX', 'pageY', 'target', 'timestamp'])
    // console.info('gestureState');
    // console.table([gestureState])
    // console.groupEnd('onMoveShouldSetPanResponder')
  }
}


@reactMixin.decorate(TimerMixin)
class CardStack extends React.Component {

  static displayName = 'CardStack';

  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      animatedIn: true,
      one: new Animated.Value(1),
      likedPotentials: [],
      cardopen: new Animated.Value(0.92),
      heightBox: new Animated.Value(DeviceHeight-60),

    };
  }


  componentDidMount() {
    this.initializePanResponder();
    this.state.cardopen.setValue(0.92);
  }

  componentWillReceiveProps(nProps) {
     const n = nProps;
    const p = this.props;
    if(n.profileVisible !== p.profileVisible){
    // console.log('SCENERIO 0');
        Animated.spring(this.state.cardopen, {
          toValue: n.profileVisible ? 1.00 : 0.92,
          tension: 15,
          friction: 7,
          velocity: 2,
          useNativeDriver: !iOS,
        }).start(() => {
          // console.log('end');
          // this.state.cardopen.setValue(n.profileVisible ? 1.00 : 0.92);

        });
        // Animated.timing(this.state.heightBox, {
        //   toValue: n.profileVisible ? DeviceHeight : DeviceHeight-60,
        //   tension: 10,
        //   friction: 5,
        //   velocity: 3,
        //   useNativeDriver: false,
        // }).start(() => {
        //
        //
        // })
    }

  }

  componentDidUpdate(pProps,pState){
    if(this.props.potentials[0] && pProps.potentials[0]){

      // console.warn('SCENARIO 1');
      const pid = this.props.potentials[0].user.id
      const nid = pProps.potentials[0].user.id
      if(nid != pid){
        // console.log(nid,pid);
        // console.warn('SCENARIO 1.5');
        this.state.pan.setValue({ x: 0, y: 0 });
        this.setTimeout(()=>{
          this.state.cardopen.setValue(0.92);
        },10)

      }else{
        this.state.pan.setValue({ x: 0, y: 0 });

      }
    }else if((this.props.drawerOpen != pProps.drawerOpen)){

      // console.warn('SCENARIO 2');

      this.state.cardopen.setValue(0.92);

    }
  }


  initializePanResponder() {

    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e, gestureState) => {
        // logPan('onMoveShouldSetPanResponderCapture', gestureState, e)
        const {pageY} = e.nativeEvent
        return (!this.props.profileVisible && pageY < DeviceHeight - 200 )
      },

      onMoveShouldSetPanResponder: (e, gestureState) => {
        // logPan('onMoveShouldSetPanResponder', gestureState, e)
        const {pageY} = e.nativeEvent
        return (!this.props.profileVisible && pageY < DeviceHeight - 200)
      },
      //
      onStartShouldSetPanResponder: (e, gestureState) => {
        // logPan('onStartShouldSetPanResponder', gestureState, e)
        const {pageY} = e.nativeEvent
        return (!this.props.profileVisible && pageY < DeviceHeight - 200)
      },
      //
      onStartShouldSetPanResponderCapture: () => false,
      //
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
        useNativeDriver: !iOS,
      }]),

      onShouldBlockNativeResponder: (e, gestureState) => false,
      //
      // onPanResponderReject: (e, gestureState) => {
      //   console.log('onPanResponderReject',gestureState)
      // },
      // onPanResponderTerminate: (e, gestureState) => {
      //   console.log('onPanResponderTerminate',gestureState)
      // },
      // onPanResponderTerminationRequest: (e, gestureState) => {
      //   console.log('onPanResponderTerminationRequest',gestureState)
      //   return true
      // },
      // onPanResponderGrant: (e, gestureState) => {
      //   console.log('onPanResponderGrant',gestureState)
      // },
      // onPanResponderStart: (e, gestureState) => {
      //   console.log('onPanResponderStart',gestureState)
      // },
      //
      // onPanResponderEnd: (e, gestureState) => {
      //   console.log('onPanResponderEnd',gestureState)
      // },

      onPanResponderRelease: (e, gestureState) => {
        let toValue = {x: 0, y: 0};
        let velocity = 1;
        let likeStatus;

        const { dx, dy, vx, vy } = gestureState;

        const likeUserId = this.props.potentials[0].user.id;

              // animate back to center or off screen left or off screen right
        if(dx > SWIPE_THRESHOLD_APPROVE || (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          __DEV__ && console.log(dx > SWIPE_THRESHOLD_APPROVE ? 'SWIPE' : (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD) && 'THROW');

          toValue = { x: DeviceWidth + 100, y: dy };
          velocity = { x: parseInt(vx), y: parseInt(vy) };
          likeStatus = 'approve';

          if(!this.state.likedPotentials.indexOf(likeUserId)) {
            likeStatus = null;
          }
        }else if(dx < SWIPE_THRESHOLD_DENY || (dx < (THROW_THRESHOLD_DENY + 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          toValue = { x: -DeviceWidth - 100, y: dy };
          velocity = { x: vx, y: vy };
          likeStatus = 'deny';
        }

        if(likeStatus){

          const relstatus = this.props.rel === 'single' ? 'couple' : 'single';
          const otherParams = { relevantUser: this.props.potentials[0] };


          Animated.timing(this.state.pan, {
            toValue,
            duration: 100,
            // easing: Easing.inOut(Easing.ease),
            // deceleration: 1.1,
            useNativeDriver: !iOS
          }).start(() => {

              InteractionManager.runAfterInteractions(() => {
                this.props.dispatch(ActionMan.sendLike(likeUserId, likeStatus, relstatus, this.props.rel, otherParams));
              })
          });

          // if(!this.props.potentials[0].starter){
          //   InteractionManager.runAfterInteractions(() => {
          //     this.props.dispatch(ActionMan.sendLike(likeUserId, likeStatus, relstatus, this.props.rel, otherParams));
          //   })
          //
          // }else{
          //       // setImmediate(() => {
          //       //   this.props.dispatch({type: 'SEND_LIKE_FULFILLED', payload: {
          //       //     relevantUser: this.props.potentials[0],
          //       //     like_status: likeStatus
          //       //   }});
          //       // })
          // }

        }else{
          setImmediate(() => {
            Animated.spring(this.state.pan, {
              toValue,
              velocity: { x: (vx) * 2, y: (vy) * 2 },
              tension: 20,
              friction: 5,
              useNativeDriver: !iOS,
            }).start();
          })
        }
      },
    });
  }

  _showProfile(potential) {
    Analytics.event('Interaction', { type: 'tap', name: 'Open card profile', potential });
    this.props.dispatch({type: 'OPEN_PROFILE', payload: {}});
  }

  _hideProfile() {
    this.props.toggleProfile();
  }

  _toggleProfile() {
    this.props.profileVisible ? this.props.dispatch({ type: 'CLOSE_PROFILE' }) : this.props.dispatch({ type: 'OPEN_PROFILE' });
  }


  render() {
    const { potentials, user } = this.props;
    if(!this._panResponder){
      this.initializePanResponder();
    }
    const {_panResponder} = this


    return (
      <View
        pointerEvents={'box-none'}
        style={{
          flexGrow: 1,
          alignSelf: 'stretch',
          alignItems: 'center',
          top: 0,
          bottom: 0,
          zIndex: 2,
          position: 'absolute',
          paddingTop: 0,
        }}
      >

        <View style={{ width: DeviceWidth, }} pointerEvents={'box-none'} />

        {/* { iOS && potentials && potentials.length >= 1 && potentials[1] &&
          <Animated.View
            style={[{
              alignSelf: 'center',
              borderRadius: 11,
              position: 'absolute',
              overflow: 'hidden',
              opacity: 0.5, // this.state.pan.x,
              transform: [
                {
                  scale: 0.8,
                  // .interpolate({
                  //   inputRange: [-400, -250, -100, 0, 100, 250, 400],
                  //   outputRange: [0.915, 0.87, 0.85, 0.80, 0.85, 0.87, 0.915],
                  //   extrapolate: 'clamp',
                  // })
                },
              ],
            }]}
            pointerEvents={'box-none'}
            key={`${potentials[1].user.id}-wrapper`}
            ref={(card) => { this.card = card; }}
          >
            <Card
              user={user}
              key={`${potentials[1].id || potentials[1].user.id}-activecard`}
              rel={user.relationship_status}
              pan={this.state.pan}
              animatedIn={this.state.animatedIn}
              profileVisible={false}
              dispatch={this.props.dispatch}
              potential={potentials[1]}
            />
          </Animated.View>
        } */}

        { potentials && potentials[0] &&
          <Animated.View
            pointerEvents={'auto'}

            style={[{
              alignSelf: 'center',
              borderRadius: 11,
              width: DeviceWidth,
              backfaceVisibility: 'hidden',
              height: this.props.profileVisible ? DeviceHeight : DeviceHeight,
              top: this.props.profileVisible ? -30 : -20,
              position: 'absolute',
              flexGrow: 1,
              transform: [
                {
                  translateX: this.state.pan.x,
                },
                {
                  translateY: this.state.pan.y
                },
                {
                  scale: this.state.cardopen
                },
              ],
            }]}
            key={`${potentials[0].user.id}-wrapper`}
            ref={(card) => { this.card = card; }}
            {...(_panResponder.panHandlers)}
          >
            <Card
              user={user}
              navigator={this.props.navigator}
              key={`${potentials[0].id || potentials[0].user.id}-activecard`}
              rel={user.relationship_status}
              isTopCard
              pan={this.state.pan}
              profileVisible={this.props.profileVisible}
              hideProfile={this._hideProfile.bind(this)}
              toggleProfile={this._toggleProfile.bind(this)}
              showProfile={this._showProfile.bind(this)}
              potential={potentials[0]}
              dispatch={this.props.dispatch}
            />
          </Animated.View>
        }
        <DenyIcon pan={this.state.pan}/>
        <ApproveIcon pan={this.state.pan}/>

      </View>
    );
  }
}

export default CardStack;
