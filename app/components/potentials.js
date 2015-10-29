/* @flow */

import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicatorIOS,
  ScrollView,
  PixelRatio,
  PanResponder,
  Easing
} from 'react-native';
import FakeNavBar from '../controls/FakeNavBar';
import ScrollableTabView from '../scrollable-tab-view'

import alt from '../flux/alt';
import MatchActions from '../flux/actions/MatchActions';
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

import PotentialsStore from '../flux/stores/PotentialsStore'
import MatchesStore from '../flux/stores/MatchesStore'

const THROW_OUT_THRESHOLD = 225;


@reactMixin.decorate(TimerMixin)
class Cards extends Component{

  static displayName = 'ActiveCard'

  constructor(props){
    super()

    this.state = {
      panX: new Animated.Value(0),
      cardWidth: new Animated.Value(DeviceWidth-40),
      offsetY: {
        a:new Animated.Value(DeviceHeight),
        b:new Animated.Value(DeviceHeight),
        c:new Animated.Value(DeviceHeight),
      }
    }
  }
  componentWillMount(){
    this._panResponder = {}

  }
  componentDidMount(){

    Mixpanel.track('On - Potentials Screen');
    Animated.stagger(200,[
      Animated.spring(this.state.offsetY.c,{
        toValue: 0,
        easing: Easing.elastic(1),
        duration: 500
      }),
      Animated.spring(this.state.offsetY.b,{
        toValue: 0,
        easing: Easing.elastic(1),
        duration: 500
      }),
      Animated.spring(this.state.offsetY.a,{
        toValue: 0,
        easing: Easing.elastic(1),
        duration: 500
      })
    ]).start(()=> {
      this.setState({animatedIn:true});
      this.initializePanResponder()
    })
  }

  componentDidUpdate(prevProps,prevState){
    // this.initializePanResponder()
    // this.state.panX.setValue(0)

  }



  getStyle = ()=> {
    return {
      transform: [
        {
          translateX: this.state.panX
        },
        {
          rotate: this.state.panX.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: ['-15deg', '0deg', '15deg']
          })
        },
        {
          translateY: this.state.offsetY.a
        }
      ],
    }
  }



  initializePanResponder(){
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
        console.log('onPanResponderReject', e.nativeEvent, {gestureState})
      },

      onPanResponderMove: Animated.event( [null, {dx: this.state.panX}] ),

      onPanResponderRelease: (e, gestureState) => {

        var toValue = 0
        // animate back to center or off screen left or off screen right
        if (gestureState.dx > 200 || gestureState.dx > 180 && Math.abs(gestureState.vx) > 3 ) {
          toValue = 500;
        }else if(gestureState.dx < -200 || gestureState.dx < -180 &&  Math.abs(gestureState.vx) > 3 ) {
          toValue = -500;
        }


        Animated.spring(this.state.panX, {
          toValue,
          velocity: gestureState.vx,       // maintain gesture velocity
          tension: 5,
          friction: 2,
        }).start();


        var id = this.state.panX.addListener(({value}) => {
          // when the card reaches the throw out threshold, send like
          if (Math.abs(value) >= 500) {

            const likeStatus = value > 0 ? 'approve' : 'deny';
            const likeUserId = this.props.potentials[0].user.id;
            MatchActions.sendLike(
              likeUserId,
              likeStatus,
              (this.props.rel == 'single' ? 'couple' : 'single'),
              this.props.rel
            )
            this.state.panX.removeListener(id);

            this.state.panX.setValue(0);     // Start 0


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
    this.state.panX.setValue(0)
  }

  _toggleProfile(){
    this.props.toggleProfile()
    this.state.panX.setValue(0)

  }

  render() {
    var {potentials,user} = this.props

    var pan = this.state.panX || 0

    return (
      <View style={{
        position: 'absolute',
        width:     DeviceWidth,
        height:    DeviceHeight,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>

      {/*     last card      */}
      { potentials && potentials.length >= 1 && potentials[2] &&
        <Animated.View
          key={`${potentials[2].id || potentials[2].user.id}-wrapper`}
          style={[
            styles.basicCard,
            {
              margin:40,
              transform:[ { translateY: this.state.offsetY.c } ],
              marginTop:72,
              flex:1,
              backgroundColor:colors.white,
              marginBottom:0,
              overflow:'hidden',
              position:'absolute',
              height:DeviceHeight - 80,
              width:DeviceWidth-80
            }]
          }>
          <InsideActiveCard
            user={user}
            ref={"_thirdCard"}
            potential={potentials[2]}
            rel={user.relationship_status}
            isTopCard={false}
            isThirdCard={true}
            key={`${potentials[2].id || potentials[2].user.id}-activecard`}
          />
        </Animated.View>
      }

      {/*       Middle card       */}
      { potentials && potentials.length >= 1 && potentials[1] &&

        <Animated.View
          style={[{
                transform:[
                {
                  translateY: this.state.offsetY.b
                },{
                  scale:0.95
                }],
                alignSelf:'center',
                width:( DeviceWidth - 40),
                height:(  DeviceHeight ),
                left:this.props.profileVisible ? 0 : 20,
                right:this.props.profileVisible ? 0 : 20,
                top: 52,
                flex:1,
                bottom:0,
                shadowColor:colors.dark,
                shadowRadius:3,
                shadowOpacity:0.05,
                shadowOffset: {
                  width:0,
                  height: 5
                },
                position:'absolute',

          }]}
          key={`${potentials[1].id || potentials[1].user.id}-wrapper`}
          ref={(card) => { this.nextcard = card }}
        >
          <InsideActiveCard
            key={`${potentials[1].id || potentials[1].user.id}-activecard`}
            user={user}
            ref={"_secondCard"}
            potential={potentials[1]}
            rel={user.relationship_status}
          />
        </Animated.View>
      }

      {/*       Front card       */}
      { potentials && potentials.length >= 1  && potentials[0] &&

        <Animated.View
          style={[{
                transform:[
                ],
                alignSelf:'center',
                overflow:'hidden',

                width:this.state.cardWidth,
                height:this.state.cardWidth.interpolate({inputRange: [DeviceWidth-40,DeviceWidth], outputRange: [DeviceHeight-40,DeviceHeight]}),
                left:this.state.cardWidth && this.state.cardWidth.interpolate({inputRange: [DeviceWidth-40,DeviceWidth], outputRange: [20,0]}),
                right:this.state.cardWidth && this.state.cardWidth.interpolate({inputRange: [DeviceWidth-40,DeviceWidth], outputRange: [20,0]}),
                top: 55,
                flex:1,
                position:'absolute',

          },{
            transform: [
              {
                translateX: this.state.panX
              },
              {
                rotate: this.state.panX.interpolate({
                  inputRange: [-200, 0, 200],
                  outputRange: ['-15deg', '0deg', '15deg']
                })
              },
              {
                translateY: this.state.offsetY.a
              }
            ],
          }]}
          key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
          {...this._panResponder.panHandlers}
          ref={(card) => { this.card = card }}
          >
          <InsideActiveCard
            user={user}
            cardWidth={this.state.cardWidth}
            key={`${potentials[0].id || potentials[0].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard={true}
            directionColor={this.state.directionColor}
            panX={this.state.panX}
            profileVisible={this.props.profileVisible}
            hideProfile={this._hideProfile.bind(this)}

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
        this.state.panX.setValue(0);
        // this.initializePanResponder()

    }
    if(this.state.cardWidth && this.props.profileVisible != nProps.profileVisible){
        // Start 0

      Animated.timing(this.state.cardWidth,{
        toValue: this.props.profileVisible ? DeviceWidth-40 : DeviceWidth,
        duration:150,
      }).start()
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
  componentWillUnmount(){
    this.props.panX.removeAllListeners();
    this.props.cardWidth.removeAllListeners();

  }
  componentDidUpdate(pProps,pState){
    LayoutAnimation.configureNext(animations.layout.spring);


    if(!pProps.isTopCard && this.props.isTopCard){
      this.props.panX ? this.valueListener() : null
    }

  }
  valueListener(){
    this.props.panX && this.props.panX.addListener(({value}) => {
      // listen to parent component's panX
        if(value == 0 && this.state.isMoving){
          this.setState({
            isMoving: false
          })
        }else if(value != 0 && !this.state.isMoving){
          this.setState({
            isMoving: true
          })
        }
      this.setNativeProps({ style:{ backgroundColor: value > 0 ? colors.sushi : colors.mandy } })
    })
  }

  setNativeProps(np){
    this.refs.incard && this.refs.incard.setNativeProps(np)
  }

  componentWillReceiveProps(nProps){
    if(this.props.panX && this.props.profileVisible != nProps.profileVisible){
      this.setState({
        isMoving: false
      })
      this.props.panX.removeAllListeners();

    }
    nProps && nProps.panX  && this.props.isTopCard ? nProps.panX.addListener(({value}) => {
    // listen to parent component's panX
      if(value > 0 && this.state.isMoving){
        this.setState({
          isMoving: false
        })
      }else if(value != 0 && !this.state.isMoving){
        this.setState({
          isMoving: true
        })
      }
      this.setNativeProps({ style:{ backgroundColor: value > 0 ? colors.sushi : colors.mandy } })
    }) : null
  }


  render(){

    var { rel, potential, profileVisible, isTopCard, isThirdCard, panX } = this.props,
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
        style={ [styles.shadowCard,{
          height: isTopCard ? DeviceHeight-80 : DeviceHeight-53
        } ]}>

          <ScrollView
          scrollEnabled={false}
          centerContent={false}
          alwaysBounceHorizontal={false}
          canCancelContentTouches={false}
            style={[styles.card,{
              margin:0,
              padding:0,
              flex:1,
              marginLeft:0,
              position:'relative',
              backgroundColor:  isThirdCard ? colors.white : colors.outerSpace,
            }]} key={`${potential.id || potential.user.id}-view`}>

            {this.props.isThirdCard ? null :
              <Animated.View key={`${potential.id || potential.user.id}bgopacity`} style={{
                  position:'relative',
                  flex:1,
                  opacity:isTopCard ? 1 : this.state.panX && this.state.panX.interpolate({
                          inputRange: [-300, -100, 0, 100, 300],
                          outputRange: [0,0.7,1,0.7,0]
                        }),

                  width: this.props.cardWidth || null,
                  backgroundColor:  colors.white, marginLeft: 0,
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
                      width: this.props.cardWidth,
                      height:this.props.cardWidth && this.props.cardWidth.interpolate({
                        inputRange: [DeviceWidth-40, DeviceWidth], outputRange: [DeviceHeight-40, DeviceHeight]
                      }),
                      opacity:  this.props.isTopCard && this.props.panX ? this.props.panX.interpolate({
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
                      width: this.props.cardWidth,
                      height:this.props.cardWidth && this.props.cardWidth.interpolate({inputRange: [DeviceWidth-40,DeviceWidth], outputRange: [DeviceHeight-40, DeviceHeight]}),
                      opacity:  this.props.isTopCard && this.props.panX ? this.props.panX.interpolate({
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
                height:180,
                width:this.state.cardWidth,
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
          {isTopCard && !profileVisible && this.state.isMoving ?
              <Animated.View key={'denyicon'} style={[styles.animatedIcon,{
                transform: [
                  {
                    scale: this.props.panX ? this.props.panX.interpolate({
                      inputRange: [-DeviceWidth/2,-50,0], outputRange: [2,0,0]}) : 0
                  }
                ]
              }]}>
                <Image source={require('image!iconDeny')} style={{backgroundColor:'transparent',width:60,height:60}}/>
              </Animated.View> : null
          }
          {isTopCard && !profileVisible && this.state.isMoving ?
              <Animated.View key={'approveicon'} style={[styles.animatedIcon,{
                transform: [
                  {
                    scale: this.props.panX ? this.props.panX.interpolate({
                      inputRange: [0,50, DeviceWidth/2], outputRange: [0,0,2]
                    }) : 0
                  }
                ]
              }]}>
                <Image source={require('image!iconApprove')} style={{backgroundColor:'transparent',width:60,height:60}}/>
              </Animated.View> : null
          }


          </ScrollView>
        </View>

    )
  }else{
// ProfileVisible
      return (
        <View
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={[ styles.card,{
            height:DeviceHeight,
            overflow:'hidden',
            left:0,
            flex:1,

            backgroundColor:colors.outerSpace,
            transform:[ {scale: 1}, ]
          },styles.shadowCard]}>
          <ScrollView
          style={[{
            margin:0,
            width:DeviceWidth,
            height:DeviceHeight,
            padding:0,
            position:'relative',
            flex:1,
          }]}
          canCancelContentTouches={true}
          horizontal={false}
          vertical={true}
          alwaysBounceHorizontal={false}
          scrollEnabled={true}

          key={`${potential.id || potential.user.id}-view`}>

          <Animated.View key={`${potential.id || potential.user.id}bgopacity`} style={{
              position:'relative',
              width:this.props.cardWidth,
            }} ref={"incard"}>

          <Swiper
            _key={`${potential.id || potential.user.id}-swiper`}
            loop={true}
            width={DeviceWidth}
            height={DeviceHeight}
            style={{width:DeviceWidth,overflow: 'hidden',
}}
            horizontal={false}
            vertical={true}
            autoplay={false}
            showsPagination={true}
            showsButtons={false}
            paginationStyle={{position:'absolute',right:25,top:25,height:100}}
            dot={ <View style={styles.dot} /> }
            activeDot={ <View style={styles.activeDot} /> }>

              <Animated.Image
                source={{uri: potential.user.image_url}}
                key={`${potential.user.id}-cimg`}

                style={[styles.imagebg,{
                  height: DeviceHeight,
                  marginTop:-20,
                  width:this.props.cardWidth,

                  }]}
                   />

            {rel == 'single' && potential.partner &&
              <Animated.Image
                source={{uri: potential.partner.image_url}}
                key={`${potential.partner.id}-cimg`}

                style={[styles.imagebg,{
                  height:DeviceHeight,
                marginTop:-20,
                width:this.props.cardWidth,
 }]}
  />
              }
          </Swiper>

            <Animated.View
            key={`${potential.id || potential.user.id}-bottomview`}
            style={{
              height: 600,
              backgroundColor:colors.outerSpace,
              flex:1,
              alignSelf:'stretch',
              width:this.props.cardWidth,

              top:-250,
              alignItems:'stretch',
              left:0,
              right:0,
            }} >

            <View style={{ width: DeviceWidth , paddingVertical:20 }}>
              <Text style={[styles.cardBottomText,{color:colors.white,width:DeviceWidth-40}]}>
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

            <View style={{width: DeviceWidth}}>


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

                  <View style={{flex:1,width:DeviceWidth,marginHorizontal:0}}>
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
    console.log(props.potentials)
  }
  toggleProfile(){
    this.setState({profileVisible:!this.state.profileVisible})
    // if(potential)
  }

  getPotentialInfo(){
    console.log(this)

    if(!this.props.potentials[0]){ return false}
    var potential = this.props.potentials[0]
    var matchName = `${potential.user.firstname.trim()}`;
    console.log(matchName)
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
        <View style={{backgroundColor:colors.outerSpace}}>

        <View style={[styles.cardStackContainer,{backgroundColor:'transparent',top:0}]}>

        { potentials.length ?  <Cards
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
         <Image source={require('image!placeholderDashed')}
            resizeMode={Image.resizeMode.contain}
            style={styles.dashedBorderImage}>
            <Image source={require('image!iconClock')} style={{height:150,width:150,marginBottom:40}}/>
            <Text style={{color:colors.white,fontFamily:'Montserrat-Bold',fontSize:20,marginBottom:10}}>COME BACK AT MIDNIGHT</Text>
            <Text style={{color:colors.rollingStone,fontSize:20,marginHorizontal:70,marginBottom:180,textAlign:'center'}}>You’re all out of potential matches for today.</Text>

        </Image>
      </FadeInContainer>

    }
    </View>

       {!this.state.profileVisible && NavBar}

       {this.state.profileVisible && <FakeNavBar
             hideNext={true}
             backgroundStyle={{backgroundColor:colors.outerSpace}}
             titleColor={colors.white}
             title={ this.getPotentialInfo() }
             titleColor={colors.white}
             onPrev={(nav,route)=> {this.toggleProfile()}}
             customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12,marginTop:10}} source={require('image!close')} />
             }
           />}
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
          {
            /*
            !this.props.AppState.permissions.location &&   <CheckPermissions
              title={'PRIORITIZE LOCAL'}
              subtitle={'We’ve found 10 matches we think you might like. Should we prioritize the matches closets to you?'}
              headerImageSource={'iconDeck'}
              permissionKey={'location'}
              hideModal={()=>{this.setState({ready: true}) }}
              visible={!this.state.ready && !this.props.AppState.permissions.location}
              AppState={this.props.AppState}

            />

            */}

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
    console.log(name,page)
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
  shadowRadius:5,
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
      borderWidth: 1 / PixelRatio.get(),
      borderColor:'rgba(0,0,0,.2)',
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
    marginHorizontal:0,
    marginTop:45,
    marginBottom:20,
    padding:0,
    width:DeviceWidth,
    height:DeviceHeight-(DeviceHeight/5),
    flex:1,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
     padding:0,
    alignItems:'stretch',
    flexDirection:'column',
    width:DeviceWidth,
    height:DeviceHeight,

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
    height:DeviceHeight,
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
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0,
      },
      update: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0,
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
