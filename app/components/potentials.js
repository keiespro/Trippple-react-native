/* @flow */


const THROW_THRESHOLD_DENY = -180,
      THROW_THRESHOLD_APPROVE = 180,
      SWIPE_THRESHOLD_APPROVE = 230,
      SWIPE_THRESHOLD_DENY = -230,
      THROW_SPEED_THRESHOLD = 2.5;


import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,AsyncStorage,
  TouchableOpacity,
  Animated,
  ActivityIndicatorIOS,
  ScrollView,
  NativeModules,
  PixelRatio,
  PanResponder,
  Easing
} from 'react-native';
import FakeNavBar from '../controls/FakeNavBar';
import ScrollableTabView from '../scrollable-tab-view'

import alt from '../flux/alt';
import MatchActions from '../flux/actions/MatchActions';
import AppActions from '../flux/actions/AppActions';

import ParallaxView from  '../controls/ParallaxScrollView'
import ParallaxSwiper from  '../controls/ParallaxSwiper'
import Mixpanel from '../utils/mixpanel';
import AltContainer from 'alt/AltNativeContainer';
import TimerMixin from 'react-timer-mixin';
import colors from '../utils/colors';
import Swiper from '../controls/swiper';
import FadeInContainer from './FadeInContainer'
import reactMixin from 'react-mixin';
import Dimensions from 'Dimensions';
import {BlurView,VibrancyView} from 'react-native-blur'
import ProfileTable from './ProfileTable'
import CheckPermissions from '../modals/CheckPermissions'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'
import PotentialsStore from '../flux/stores/PotentialsStore'
import MatchesStore from '../flux/stores/MatchesStore'

const THROW_OUT_THRESHOLD = 225;


@reactMixin.decorate(TimerMixin)
class Cards extends Component{

  static displayName = 'ActiveCard'

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
componentWillUnmount(){
    this.state.pan && this.state.pan._listeners && Object.keys(this.state.pan._listeners).length && this.state.pan.removeAllListeners();

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
        this._opens = false
        return false;
      },

      onMoveShouldSetPanResponder: (e,gestureState) => {
        this._opens = false
        return !this.props.profileVisible && Math.abs(gestureState.dy) < 5
      },

      onStartShouldSetPanResponder: (e,gestureState) => {
        // set a timeout to open profile, if no moves have happened
        if(!this.props.profileVisible){
          this._opens = true
          this.setTimeout(()=>{
            this._opens && this._toggleProfile()
          },100)
        }
        return false
      },
      onPanResponderReject: (e, gestureState) => {
        this._opens = false
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
            this.state.pan && this._actionlistener && this.state.pan.removeListener(this._actionlistener);

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
      style={{
          }}>

      {/*     last card      */}
      { !this.props.profileVisible && potentials && potentials.length >= 1 && potentials[2] &&
        <Animated.View
          key={`${potentials[2].id || potentials[2].user.id}-wrapper`}
          style={[
            styles.basicCard,
            {
              transform:[ { translateY: this.state.offsetY.c },
              {scale: .75}],
              top:22,
              flex:1,
              backgroundColor:colors.white,
              position:'absolute'
            }]
          }>
          <InsideActiveCard
            user={user}
            ref={"_thirdCard"}
          shouldRasterizeIOS={!this.state.animatedIn}
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
                  scale:0.85
                }],
                alignSelf:'center',
                flex:1,
                top:-20,
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
          <InsideActiveCard
            key={`${potentials[1].id || potentials[1].user.id}-activecard`}
            user={user}
            ref={"_secondCard"}
          shouldRasterizeIOS={!this.state.animatedIn}
            pan={this.state.pan}
            profileVisible={this.props.profileVisible}

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
            top: this.props.profileVisible ? -20 : -40,
          },
          {
            transform: [
              {
                translateX: this.state.pan ? this.state.pan.x : 0
              },
              {
                rotate: this.state.pan.y.interpolate({
                  inputRange: [-200,  200],
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
              {
                scale: this.props.profileVisible ? 1 : this.state.pan.x.interpolate({
                  inputRange: [-300, -250, -90, 0,  90, 250, 300],
                  outputRange: [    1, 1,  0.9, 0.9, 0.9, 1, 1]
                })
              }
            ],
          }]}
          key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
          ref={(card) => { this.card = card }}
          { ...this._panResponder.panHandlers}
          >
          <InsideActiveCard
          user={user}
          shouldRasterizeIOS={!this.state.animatedIn}
            key={`${potentials[0].id || potentials[0].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard={true}
            pan={this.state.pan}
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
  componentWillReceiveProps(nProps){
    if(this.state.animatedIn && this.props.potentials[0].user.id != nProps.potentials[0].user.id ){
        this.state.pan.setValue({x: 0, y: 0});
        // this.initializePanResponder()
    }


  }
}




class InsideActiveCard extends Component{

  static defaultProps = {
    profileVisible: false
  }

  constructor(props){
    super()
    this.state = {
      slideIndex: 0
    }
  }
   componentDidUpdate(pProps,pState){

    // if(!pProps.isTopCard && this.props.isTopCard){
      // this.props.pan ? this.valueListener() : null
      // }
      //
    if(pProps.profileVisible && !this.props.profileVisible ){
      this.refs.scrollbox && this.refs.scrollbox.setNativeProps({contentOffset:{x:0,y:0}})

    }

  }
  // valueListener(){
  //   this._valuelistener = this.props.pan && this.props.pan.addListener(({value}) => {
  //     // listen to parent component's pan
  //     const val = parseInt(value)

  //       if(this.state.isMoving && val == 0){
  //         this.setState({
  //           isMoving: false
  //         })

  //       }else if(val != 0 && !this.state.isMoving){
  //         this.setState({
  //           isMoving: true
  //         })

  //       }
  //       if(val != 0){
  //         this.setNativeProps({ style:{ backgroundColor: val > 0 ? colors.sushi : colors.mandy } })
  //       }

  //   })
  // }

  setNativeProps(np){
    this.refs.incard && this.refs.incard.setNativeProps(np)
  }
  componentWillMount(){
      // this.props.pan && this.props.isTopCard && this.valueListener()

  }
  componentWillReceiveProps(nProps){
    if(nProps.pan && this.props.profileVisible != nProps.profileVisible){
      LayoutAnimation.configureNext(animations.layout.spring);
      this.setState({
        isMoving: false
      })

      // nProps.pan && nProps.isTopCard && nProps.pan.removeListener(this._valuelistener);

    }

  }


  render(){

    var { rel, potential, profileVisible, isTopCard, isThirdCard, pan } = this.props,
        matchName = `${potential.user.firstname.trim()} ${potential.user.age}`,
        distance = potential.user.distance,
        city = potential.user.city_state;

    if(rel == 'single') {
      matchName += ` & ${potential.partner.firstname.trim()} ${potential.partner.age}`
      distance = Math.min(distance,potential.partner.distance)
    }


    if(!profileVisible){
    return (
      <View ref={'cardinside'} key={`${potential.id || potential.user.id}-inside`}
      style={ [{
        } ]}>

          <ScrollView
          scrollEnabled={false}
          ref={'scrollbox'}
          centerContent={false}
          alwaysBounceHorizontal={false}
          canCancelContentTouches={false}
            style={[styles.card,{
              margin:0,
              padding:0,
              flex:1,
              backgroundColor: colors.white,
              marginLeft:0,

              position:'relative',
                        }]} key={`${potential.id || potential.user.id}-view`}>

            {this.props.isThirdCard ? null :
              <Animated.View key={`${potential.id || potential.user.id}bgopacity`} style={{
                  position:'relative',
                  flex:1,
                  alignItems:'center',justifyContent:'center',flexDirection:'column',
 backgroundColor: isTopCard ? this.props.pan && this.props.pan.x.interpolate({
                    inputRange: [-300, -1, 0, 1, 300],
                    outputRange: ['rgb(232,74,107)',
                              'rgb(232,74,107)',
                              'rgb(255,255,255)',
                              'rgb(66,181,125)',
                              'rgb(66,181,125)' ],
                  }) : colors.white,



                  opacity: isTopCard ? 1 : this.props.pan && this.props.pan.x.interpolate({
                          inputRange: [-500, -10, 0, 10, 500],
                          outputRange: [1,0,0,0,1]
                        }),

                }} ref={isTopCard ? 'incard' : 'notincard'}>
                <Swiper
                  automaticallyAdjustContentInsets={true}
                  _key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  vertical={true}
                  total={1}
                  showsPagination={true}
                  paginationStyle={{position:'absolute',right:45,top:25,height:100}}
                  dot={ <View style={styles.dot} />}
                  activeDot={ <View style={styles.activeDot} /> }>
                  <Animated.Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg, {
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -100, 0, 100, 300],
                          outputRange: [0,0.7,1,0.7,0]
                        }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover} />
                  {rel == 'single' && potential.partner &&
                  <Animated.Image
                    source={{uri: potential.partner.image_url}}
                    key={`${potential.partner.id}-cimg`}
                    style={[styles.imagebg,{
                      backgroundColor:colors.white,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -100, 0, 100, 300],
                          outputRange: [0,0.7,1,0.7,0]
                        }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover} />
                  }
                </Swiper>

            {this.props.isThirdCard ? null :

            <Animated.View
              key={`${potential.id || potential.user.id}-bottomview`}
              style={{
                height:this.props.isTopCard ? 180 : 145,
                backgroundColor: colors.white,
                flexDirection:'row',
                flex:1,
                alignSelf:'stretch',
                alignItems:'stretch',
                position:'absolute',
                bottom:0,
                left:0,
                right:0,
              }}
              >
               <View style={{ paddingTop:30, paddingBottom:15, height:130,flex:1 }}>
                  <View>
                    <Text style={[styles.cardBottomText,{flex:1}]}>{
                      {matchName}
                    }</Text>
                    <Text style={[styles.cardBottomOtherText,{flex:1}]}>{
                      `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                    }</Text>
                  </View>
                </View>

            {rel == 'single' &&
              <View style={{
                  height:60,
                  top:-30,
                  position:'absolute',
                  width:135,
                  right:0,
                  backgroundColor:'transparent',
                  flexDirection:'row'}}>
                  <Image
                    source={{uri: potential.user.image_url}}
                    key={potential.user.id + 'img'}
                    style={[styles.circleimage, {marginRight:5}]}
                  />
                  {rel == 'single' &&
                  <Image
                    source={{uri: potential.partner.image_url}}
                    key={potential.partner.id + 'img'}
                    style={styles.circleimage}
                    />
                  }
              </View>}

            </Animated.View>}
            </Animated.View>
          }
          {isTopCard && !profileVisible  ?
              <Animated.View key={'denyicon'} style={[styles.animatedIcon,{
                transform: [
                  {
                    scale: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange: [-DeviceWidth/2,-50,0], outputRange: [2,0,0]}) : 0
                  }
                ]
              }]}>
                <Image source={require('../../newimg/iconDeny.png')} style={{backgroundColor:'transparent',width:60,height:60}}/>
              </Animated.View> : null
          }
          {isTopCard && !profileVisible  ?
              <Animated.View key={'approveicon'} style={[styles.animatedIcon,{
                transform: [
                  {
                    scale: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange: [0,50, DeviceWidth/2], outputRange: [0,0,2]
                    }) : 0
                  }
                ]
              }]}>
              <Image
              source={require('../../newimg/iconApprove.png')}
              style={{backgroundColor:'transparent',width:60,height:60}}/>
              </Animated.View> : null
          }


          </ScrollView>
          <View
          key={'navbarholder'}
            style={{
              backgroundColor:'black',
              flex:1,
        width: DeviceWidth,
              position:'absolute',
              top:0
            }}
            />

        </View>

    )
  }else{
// ProfileVisible
      return (
        <View
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={[ {
            height:DeviceHeight-55,
            backgroundColor:'#000000',
            left:0,
            flex:1,
              alignSelf:'stretch',
              width:DeviceWidth,
              right:0,
            top:-55,
            borderRadius:0,
            transform:[ {scale: 1}, ]
          } ]}>

          <ScrollView
            style={[{
              margin:0,
              width:DeviceWidth,
              height:DeviceHeight-55,
              marginTop:55,
              top:0,
              overflow:'hidden',
              backgroundColor:'#000000',
              flex:1,
            }]}
            canCancelContentTouches={true}
            horizontal={false}
            vertical={true}
             alwaysBounceHorizontal={false}
            scrollEnabled={true}
            automaticallyAdjustContentInsets={true}
            contentInset={{top:0, left: 0, bottom: 0, right: 0}}
            key={`${potential.id || potential.user.id}-view`}
            >

            <Animated.View
              key={`${potential.id || potential.user.id}bgopacity`}
              style={{  }}
              ref={"incard"}
              >

              <Swiper
                _key={`${potential.id || potential.user.id}-swiper`}
                loop={true}
                height={DeviceHeight-55-40}
                style={{
                  flex:1,
                }}
                horizontal={false}
                vertical={true}
                autoplay={false}
                showsPagination={true}
                showsButtons={false}
                paginationStyle={{position:'absolute',right:25,top:25,height:100}}
              >

              <Animated.Image
                source={{uri: potential.user.image_url}}
                key={`${potential.user.id}-cimg`}

                style={[styles.imagebg,{
                  marginTop:-20,

                  }]}
                   />

            {rel == 'single' && potential.partner &&
              <Animated.Image
                source={{uri: potential.partner.image_url}}
                key={`${potential.partner.id}-cimg`}


                style={[styles.imagebg,{
                marginTop:-20,
 }]}
  />
              }
          </Swiper>

            <Animated.View
            key={`${potential.id || potential.user.id}-bottomview`}
pointerEvents={'box-none'}

            style={{
              height: 600,
              top:-70,
              backgroundColor:colors.outerSpace,
              flex:1,
              width:DeviceWidth,
              }} >

              <View
            key={`${potential.id || potential.user.id}-names`}
              style={{
              flex:1,height:60,
              paddingVertical:20, }}>
              <Text
            key={`${potential.id || potential.user.id}-matchn`}
              style={[styles.cardBottomText,{color:colors.white,width:DeviceWidth-40}]}>
              {
                {matchName}
              }
              </Text>
              <Text style={[styles.cardBottomOtherText,{color:colors.white,width:DeviceWidth-40}]}>
              {
                `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
              }
              </Text>
            </View>

          {this.props.rel == 'single' &&
            <View style={{
              height:60,
              top:-30,
              position:'absolute',
              width:135,
              right:0,
                        backgroundColor:'transparent',
              flexDirection:'row'}}>
                <Image
                  source={{uri: this.props.potential.user.image_url}}
                  key={this.props.potential.user.id + 'img'}
                  style={[styles.circleimage, {marginRight:5,borderColor:colors.outerSpace}]}
                />
                <Image
                  source={{uri: this.props.potential.partner.image_url}}
                  key={this.props.potential.partner.id + 'img'}
                  style={[styles.circleimage,{borderColor:colors.outerSpace}]}
                />
              </View>
            }

            <View style={{top:-50}}>

            {potential.bio || potential.user.bio ?
              <View style={{padding:20}}>
                <Text style={[styles.cardBottomOtherText,{color:colors.white,marginBottom:15,marginLeft:0}]}>{
                    rel =='single' ? `About Me` : `About Us`
                }</Text>
                <Text style={{color:colors.white,fontSize:18,marginBottom:15}}>{
                    potential.bio || potential.user.bio
                }</Text>
              </View> : null}

              {this.props.rel == 'single' && potential.partner ?

                 <ScrollableTabView tabs={['1','2']} renderTabBar={(props) => <CustomTabBar {...props}  /> }>
                  <ProfileTable profile={this.props.potential.user}
                    tabLabel={`${potential.user.firstname}, ${potential.user.age}`}/>
                  <ProfileTable profile={potential.partner}
                    tabLabel={`${potential.partner.firstname}, ${potential.partner.age}`}/>
                  </ScrollableTabView> :

                  <View style={{flex:1,width:DeviceWidth,
              flex:1,
              alignSelf:'stretch',
                    marginHorizontal:0}}>
                    <View style={styles.tabs}>
                      <Text style={{width:DeviceWidth-40,
                          fontFamily:'Montserrat',fontSize:16,textAlign:'center',
                          color:  colors.white }}>
                          {`${potential.user.firstname} ${potential.user.age}`
                      }</Text>
                    </View>
                    <View style={[styles.singleTab]}>
                      <ProfileTable profile={potential.user} tabLabel={'single'}/>
                    </View>
                  </View>

              }

              <View style={{flex:1,marginTop:20}}>
                <Text style={{color:colors.mandy,textAlign:'center'}}>Report or Block this user</Text>
              </View>

            </View>

          </Animated.View>

          </Animated.View>
          </ScrollView>
          <View
          key={'navbarholder'+potential.user.id}
            style={{
              backgroundColor:'black',
              width:DeviceWidth,
              position:'absolute',
              top:0
            }}
            >
            <FakeNavBar
              hideNext={true}
              backgroundStyle={{
                backgroundColor:'black',
              }}
              insideStyle={{
                flex:1,
                width:DeviceWidth,
                height:55,
                backgroundColor:colors.outerSpace,
                borderTopLeftRadius:8,
                borderTopRightRadius:8,
                overflow:'hidden',
              }}
              titleColor={colors.white}
              title={ matchName }
              onPrev={(nav,route)=> {this.props.toggleProfile()}}
              customPrev={
                <Image
                resizeMode={Image.resizeMode.contain}
                style={{margin:0,alignItems:'flex-start',height:12,width:12,marginTop:10}}
                source={require('../../newimg/close.png')}
                />
              }
            />
          </View>

      </View>

    )
    }
  }
}

class DummyCard extends Component{
  constructor(props){
    super(props)
  }
  render(){

    return (

        <View style={{
            height:70,
            bottom:0,
            position:'absolute',
            width: DeviceWidth - 80,
            backgroundColor:colors.white,
            flex:1,
            alignSelf:'stretch'
          } }/>
    )

  }
}

class CardStack extends Component{
  constructor(props){
    super()
    this.state = {profileVisible:false}
  }
  toggleProfile(){
    this.setState({profileVisible:!this.state.profileVisible})
    // if(potential)
  }
  componentDidMount(){
    // AsyncStorage.getItem('location').then((locPerm)=>{
    //   if(!( locPerm) && parseInt(NativeModules.OSPermissions.location) < 3){
    //     this.props.navigator.push({
    //       component:CheckPermissions,
    //       passProps:{
    //         title:'PRIORITIZE LOCAL',
    //         subtitle:'We’ve found 10 matches we think you might like. Should we prioritize the matches closest to you?',
    //         failedTitle: 'LOCATION DISABLED',
    //         failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
    //         failedState: parseInt(NativeModules.OSPermissions.location) && parseInt(NativeModules.OSPermissions.location) < 3 ? true : false,
    //         headerImageSource:'iconDeck',
    //         permissionKey:'location',
    //         renderNextMethod: 'pop',
    //         failCallback:()=>{ AppActions.denyPermission('location')},
    //         successCallback:()=>{ this.props.navigator.pop()},
    //         renderMethod:'push',
    //         renderPrevMethod:'pop',
    //         AppState:this.props.AppState,
    //       }
    //     })
    //   }
    // })

  }
  getPotentialInfo(){

    if(!this.props.potentials[0]){ return false}
    var potential = this.props.potentials[0]
    var matchName = `${potential.user.firstname.trim()}`;
    var distance = potential.user.distance
    if(this.props.user.relationship_status == 'single') {
      matchName += ` & ${potential.partner.firstname.trim()}`
      distance = Math.min(distance,potential.partner.distance)
    }
    return matchName
  }
  render(){


    var { potentials, user } = this.props
    var NavBar = React.addons.cloneWithProps(this.props.pRoute.navigationBar, {
      ...this.props
    })

      return (
        <View style={{backgroundColor:this.state.profileVisible ? 'black' : colors.outerSpace,
            flex:1,width:DeviceWidth,height:DeviceHeight,top:0}}>
       {!this.state.profileVisible && NavBar}

        <View style={[styles.cardStackContainer,{backgroundColor:'transparent',position:'relative',top:55}]}>

        { potentials.length ?
          <Cards
            user={user}
            rel={user.relationship_status}
            potentials={potentials}
            profileVisible={this.state.profileVisible}
            toggleProfile={this.toggleProfile.bind(this)}
          /> : null}


          { !this.state.didShow && potentials.length < 1 &&
            <View style={[{ alignItems: 'center', justifyContent: 'center',height: DeviceHeight,width:DeviceWidth,position:'absolute',top:0,left:0}]}>
            <ActivityIndicatorIOS size={'large'} style={[{ alignItems: 'center', justifyContent: 'center',height: 80}]} animating={true}/>
            </View>}
    { potentials.length < 1 &&
      <FadeInContainer delayAmount={2000} duration={300} didShow={()=>this.setState({didShow:true})}>
        <View
                  style={[styles.dashedBorderImage,{height:DeviceHeight,flex:10,position:'relative',}]}>
           <Image source={require('../../newimg/placeholderDashed.png')}
             style={{alignSelf:'stretch',flex:10,

               height:MagicNumbers.is4s ?  DeviceHeight-70 : DeviceHeight-55-MagicNumbers.screenPadding/2,

               marginHorizontal:MagicNumbers.is4s ? MagicNumbers.screenPadding : 0,
               width:MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth,
               alignItems:'center',justifyContent:'center',position:'absolute',
               top: -10,
               left:0,flexDirection:'column',
             }}
  resizeMode={MagicNumbers.is4s ? Image.resizeMode.stretch : Image.resizeMode.contain}>
            <Image source={require('../../newimg/iconClock.png')} style={{
                height: MagicNumbers.is4s ? MagicNumbers.screenWidth/2 - 20 : MagicNumbers.screenWidth/2,
                width:MagicNumbers.is4s ? MagicNumbers.screenWidth/2 - 20 : MagicNumbers.screenWidth/2,
                 marginBottom:MagicNumbers.is4s ? 0 : MagicNumbers.screenPadding,
                 marginTop:MagicNumbers.is4s ? 40 : MagicNumbers.screenPadding*2
               }}/>
            <Text style={{
                color:colors.white,
                fontFamily:'Montserrat-Bold',
              fontSize:  (MagicNumbers.size18+2),
              marginVertical:10
            }}>COME BACK AT MIDNIGHT</Text>
            <Text style={{color:colors.rollingStone,
                fontSize:MagicNumbers.size18+2, marginHorizontal:MagicNumbers.is4s ? 30 : 70,
marginBottom:180,textAlign:'center'}}>You’re all out of potential matches for today.</Text>
        </Image>
      </View>
      </FadeInContainer>

    }
    </View>



    </View>

    )
  }
}

class Potentials extends Component{
  constructor(props){
    super()
    this.state = {}
  }
  render(){
    return (
      <AltContainer
       stores={{
            potentials: (props) => {
              return {
                store: PotentialsStore,
                value: PotentialsStore.getAll()
              }
            },
            unread: (props) => {
              return {
                store: MatchesStore,
                value: MatchesStore.getAnyUnread()
              }
            }}}>
          <CardStack {...this.props}/>


      </AltContainer>
    )
  }
}


export default Potentials;
var CustomTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.object,
    tabs: React.PropTypes.array,
    pageNumber:React.PropTypes.number

  },

  renderTabOption(name, page) {
    var isTabActive = this.props.pageNumber === page;
    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{
              fontFamily:'Montserrat',fontSize:16,
              color: isTabActive ? colors.white : colors.shuttleGray}}>{name.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  },



  render() {
    var numberOfTabs = this.props.tabs.length;
    var w = (DeviceWidth-40) / numberOfTabs;

    var tabUnderlineStyle = {
      position: 'absolute',
      width: (DeviceWidth-40) / 2,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left:0,
      transform:[
        {translateX: this.props.activeTab ? this.props.activeTab.interpolate({
                inputRange: this.props.tabs.map((c,i) => (w * i) ),
                outputRange: [0,w]
              }) : 0
            }]
    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={'TAB_UNDERLINE_REF'} />
      </View>
    );
  },
});

var styles = StyleSheet.create({

shadowCard:{
  shadowColor:colors.darkShadow,
  shadowRadius:4,
  shadowOpacity:50,
  shadowOffset: {
    width:0,
    height: 5
  }
},
tab: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  width:(DeviceWidth - 40 )/ 2,

},
singleTab:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 20,
  width:DeviceWidth,

},
tabs: {
  height: 60,
  flexDirection: 'row',
  marginTop: 0,
  borderWidth: 1,
  width:DeviceWidth-40,
  flex:1,
  marginHorizontal:20,
  borderTopWidth: 1,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth:1,
  overflow:'hidden',
  justifyContent:'center',
  alignItems:'center',
  borderColor: colors.shuttleGray,
},
animatedIcon:{
  height:60,
  width:60,
  borderRadius:30,
  alignItems:'center',
  justifyContent:'center',
  top:DeviceHeight/2 - 80,
  left:DeviceWidth/2 - 50,
  position:'absolute',
  // shadowColor:colors.darkShadow,
  backgroundColor:'transparent',
  // shadowRadius:5,
  // shadowOpacity:50,
  overflow:'hidden',
  // shadowOffset: {
  //   width:0,
  //   height: 5
  // }
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow:'hidden',
    top:50
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
  basicCard:{
    borderRadius:8,
    backgroundColor: 'transparent',
      overflow:'hidden',

    },
    bottomButtons: {
      height: 80,
      alignItems: 'center',
      flexDirection: 'row',
      top:-40,
      justifyContent:'space-around',
      alignSelf:'stretch',
      width: undefined
    },
    topButton: {
      height: 80,
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 0,
      borderRadius: 0,
      marginBottom: 0,
      marginTop: 0,
      alignSelf: 'stretch',
      alignItems:'center',
      justifyContent: 'center'
    },
  card: {
    borderRadius:8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor:'rgba(0,0,0,.2)',
    overflow:'hidden'

  },

  closeProfile:{
    position:'absolute',
    top:10,
    left:5,
    width: 50,

    backgroundColor:'transparent',

    height: 50,
    alignSelf:'center',

    overflow:'hidden',

    justifyContent:'center',
    alignItems:'center',
    padding:20,
    borderRadius:25
  },
  dashedBorderImage:{
    paddingHorizontal:0,
    paddingTop:65,
    paddingBottom:20,
    margin:0,
    padding:0,
    flex:1,
    height:DeviceHeight-55,
    alignSelf:'stretch',
    alignItems:'stretch',
    justifyContent:'center'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
     padding:0,
    alignItems:'stretch',


  },

  dot: {
    backgroundColor: 'transparent',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: colors.mediumPurple20,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  wrapper:{

  },
  scrollSection:{
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    padding:0,
    margin:0,
    alignItems: 'center',
    flexDirection: 'column'
  },
  circleimage:{
    backgroundColor: colors.shuttleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor:colors.white,
    borderWidth: 3
  },
  cardStackContainer:{
    width:DeviceWidth,
    height:DeviceHeight-55,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    backgroundColor:'transparent'
  },

  cardBottomText:{
    marginLeft:20,
    fontFamily:'Montserrat-Bold',
    color: colors.shuttleGray,
    fontSize:18,
    marginTop:0
  },
  cardBottomOtherText:{
    marginLeft:20,
    fontFamily:'omnes',
    color: colors.rollingStone,
    fontSize:16,
    marginTop:0,
    opacity:0.5
  }
});

var animations = {
  layout: {
    spring: {
      duration: 250,
      create: {
        duration: 250,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.spring,
        springDamping: 9,
      },
      update: {
        duration: 250,
        type: LayoutAnimation.Types.spring,
        springDamping: 9,
        property: LayoutAnimation.Properties.scaleXY
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY

      },
      update: {

        duration: 2000,
        // property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut,

      }
    }
  }
}
