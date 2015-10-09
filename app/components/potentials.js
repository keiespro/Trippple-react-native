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
  ScrollView,
  PanResponder,
  Easing
} from 'react-native';
import FakeNavBar from '../controls/FakeNavBar';
import ScrollableTabView from 'react-native-scrollable-tab-view'

import alt from '../flux/alt';
import precomputeStyle from 'precomputeStyle';
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

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import PotentialsStore from '../flux/stores/PotentialsStore'

const THROW_OUT_THRESHOLD = 225;


@reactMixin.decorate(TimerMixin)
class Cards extends Component{

  static displayName = 'ActiveCard'

  constructor(props){
    super()

    this.state = {
      panX: new Animated.Value(0),
      waitingForDoubleTap: false,
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
    this.state.panX.setValue(0);     // Start 0
    // this.state.inactiveCardOpacity.setValue(0.5);     // Start 0

    Mixpanel.track('On - Potentials Screen');

    Animated.timing(this.state.offsetY.c,{
      toValue: 0,
      easing: Easing.elastic(1),
      duration: 500
    }).start()

    Animated.timing(this.state.offsetY.b,{
      toValue: 0,
      delay:50,
      easing: Easing.elastic(1),
      duration: 500
    }).start()

    Animated.timing(this.state.offsetY.a,{
      toValue: 0,
      delay: 100,
      easing: Easing.elastic(1),
      duration: 500
    }).start()
  }
  componentDidUpdate(prevProps,prevState){
    console.log(prevProps.potentials[0],this.props.potentials[0])
    // if(!this._panResponder){
      this.initializePanResponder()

    // }
    if(prevProps.potentials[0] && this.props.potentials[0] && this.props.potentials[0].user.id != prevProps.potentials[0].user.id){
      // this.state.panX.setValue(0)
      // this.initializePanResponder()

    }


  }
  componentWillReceiveProps(nProps){
    this.initializePanResponder()
    if(this.state.panX != 0){
        this.setState({directionColor:this.state.panX > 0 ? colors.sushi : colors.mandy})
    }
    this.state.panX.setValue(0)
    //
    // if(!this.props.potentials.length && nProps.potentials.length ){
    //   Animated.timing(this.state.offsetY.a,{
    //     toValue: 0,
    //     easing: Easing.easeInEaseOut,
    //     duration: 1000
    //   }).start()
    //
    //   Animated.timing(this.state.offsetY.b,{
    //     toValue: 0,
    //     delay:200,
    //     easing: Easing.easeInEaseOut,
    //     duration: 1000
    //   }).start()
    //
    //   Animated.timing(this.state.offsetY.c,{
    //     toValue: 0,
    //     delay: 400,
    //     easing: Easing.easeInEaseOut,
    //     duration: 1000
    //   }).start()
    // }

  }
  getStyle = ()=> {
    console.log(this.props)

    return {
      transform: [
        {
          translateX: this.state.panX
        },
        {
          rotate: this.state.panX.interpolate({inputRange: [-200, 0, 200], outputRange: ['-15deg', '0deg', '15deg']})
        },
        {
          translateY: this.state.offsetY.a
        }
      ],

    }
  }

  getInactiveOpacity = ()=>{
    console.log(this.state.panX)
    return this.state.panX ? this.state.panX.interpolate({inputRange: [-300, -150, 0, 150, 300], outputRange: [1,0.7,0,0.7,1]}) : 1

  }
  initializePanResponder(){
    console.log('PAN RESPONDER')
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e,gestureState) => !this.props.profileVisible && Math.abs(gestureState.dy) < 5,
      onStartShouldSetPanResponder: (e,gestureState) => false,
      // onPanResponderGrant: () => {      },
      onPanResponderMove: Animated.event( [null, {dx: this.state.panX}] ),
      onPanResponderRelease: (e, gestureState) => {
        console.log(gestureState)
        var toValue = 0;
        if (gestureState.dx > 200 || gestureState.dx > 150 && Math.abs(gestureState.vx) > 3 ) {
          toValue = 500;
      } else if (gestureState.dx < -200 || gestureState.dx < -150 &&  Math.abs(gestureState.vx) > 3 ) {
          toValue = -500;
        }
        Animated.spring(this.state.panX, {
          toValue,                         // animate back to center or off screen
          velocity: gestureState.vx,       // maintain gesture velocity
          tension: 5,
          friction: 2,
        }).start();
        // this.state.panX.removeAllListeners();
        var id = this.state.panX.addListener(({value}) => { // listen until offscreen
          if (Math.abs(value) > 500) {
            const likeStatus = value > 0 ? 'approve' : 'deny';
            const likeUserId = this.props.potentials[0].user.id;
            MatchActions.sendLike(likeUserId,likeStatus,(this.props.rel == 'single' ? 'couple' : 'single'),this.props.rel)
            // this.state.panX.setValue(0)
            this.state.panX.removeListener(id);             // offscreen, so stop listening
          }
        })
      }
    })
  }

  _handleDoubleTap(){
    this.setState({ waitingForDoubleTap: false })
    this.props.toggleProfile();


  }


  _showProfile(potential){
    if(this.state.isDragging || this.state.isAnimating){
      return false;
    }
    this.props.toggleProfile(potential);
  }

  _hideProfile(){
    // this.setState({ profileVisible: false })
    //
    //
    this.props.toggleProfile();

  }

  render() {
    var {potentials,user} = this.props
    const cardStyle = StyleSheet.create({
        wrap:{
          transform:[
          {
            translateY: this.state.offsetY.b
          }],
          alignSelf:'center',
          width:(DeviceWidth - (this.props.profileVisible ? 0 : 40)),
          height:(DeviceHeight - (this.props.profileVisible ? 0 : 85)),
          left:this.props.profileVisible ? 0 : 20,
          right:this.props.profileVisible ? 0 : 20,
          top: 55,
          flex:1,
          position:'absolute',
      }
    });
    var pan = this.state.panX || 0,
        animStyle = this.getStyle(),
        inactiveCardOpacity = this.getInactiveOpacity();
          console.log(pan)

          if(pan && pan != 0){
            // console.log(this.refs, this.card.node, this.card &&  this.card.refs);
            //
            // this.card && this.card.node.setNativeProps({style:{backgroundColor: pan > 0 ? colors.sushi : colors.mandy}})
          }
    // var animIconStyle = this.getAnimatedIconStyle();

    console.log('render potentials',potentials)
    return (
      <View style={{
        position:'absolute',
        width:DeviceWidth,
        height:DeviceHeight,
        top:0,
        left:0,
        right:0,
        bottom:0
      }}>

      { potentials && potentials.length >= 1 && potentials[2] &&
        <Animated.View
        style={[
          styles.basicCard,
          {
            margin:40,
            transform:[
              {
                translateY: this.state.offsetY.c
              }
            ],
            marginTop:75,
            flex:1,
            backgroundColor:colors.white,
            marginBottom:0,
            overflow:'hidden',
            position:'absolute',
            height:DeviceHeight - 80,
            width:DeviceWidth-80
            // bottom:10
          }]
        }
        key={`${potentials[2].id || potentials[2].user.id}-wrapper`}>
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

      { potentials && potentials.length >= 1 && potentials[1] &&
        <Animated.View
          style={[cardStyle.wrap]}
          key={`${potentials[1].id || potentials[1].user.id}-wrapper`}
          ref={(card) => { this.nextcard = card }}
        >
          <InsideActiveCard
            key={`${potentials[1].id || potentials[1].user.id}-activecard`}
            user={user}
            inactiveOpacity={inactiveCardOpacity}
            ref={"_secondCard"}
            potential={potentials[1]}
            rel={user.relationship_status}
            isTopCard={false}
          />
        </Animated.View>

      }
      { potentials && potentials.length >= 1  && potentials[0] &&
        <Animated.View
          style={[cardStyle.wrap,animStyle]}
          key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
          {...this._panResponder.panHandlers}
          ref={(card) => { this.card = card }}
        >

          <InsideActiveCard
            user={user}
            key={`${potentials[0].id || potentials[0].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard={true}
            directionColor={this.state.directionColor}
            isMoving={this.state.panX}
            profileVisible={this.props.profileVisible}
            hideProfile={this._hideProfile.bind(this)}
            inactiveOpacity={inactiveCardOpacity}
            showProfile={this._showProfile.bind(this)}
            potential={potentials[0]}
          />

        </Animated.View>
      }


    </View>

    );

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

  componentDidUpdate(prevProps,prevState) {
    //
  }

  componentWillUpdate(nextProps){
      LayoutAnimation.configureNext(animations.layout.spring);
    //  if(nextProps.profileVisible !== this.props.profileVisible){
    //   LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    // }
  }
  setNativeProps(np){

    this.refs.incard && this.refs.incard.setNativeProps(np)
  }

  getAnimatedIconStyle =() =>{
    return {
      deny:{
        transform: [
          {
            scale: this.props.isMoving ? this.props.isMoving.interpolate({inputRange: [-DeviceWidth/2,-50,50], outputRange: [2,0,0]}) : 0
          }
        ]
      },
      approve:{
        transform: [
          {
            scale: this.props.isMoving ? this.props.isMoving.interpolate({inputRange: [50,50, DeviceWidth/2], outputRange: [0,0,2]}) : 0
          }
        ]
      }
    }
  }
  render(){

    var { rel, potential, profileVisible, isTopCard, isThirdCard, isMoving } = this.props

    var v = isMoving ? isMoving.addListener(({value}) => { // listen until offscreen

      this.setNativeProps({style:{
        backgroundColor: value > 0 ? colors.sushi : colors.mandy
      }})
    }) : null;


    var animIconStyle = this.getAnimatedIconStyle();
    var matchName = `${potential.user.firstname.trim()} ${potential.user.age}`;
    var distance = potential.user.distance
    if(rel == 'single') {
      matchName += ` & ${potential.partner.firstname.trim()} ${potential.partner.age}`
      distance = Math.min(distance,potential.partner.distance)
    }
    console.log('this._direction',this._direction)
    var tintOpacity = this.props.inactiveOpacity;
    var city = potential.user.city_state
    if(!profileVisible){
    return (
      <View ref={'cardinside'} key={`${potential.id || potential.user.id}-inside`}
        style={ [styles.shadowCard,{
          marginBottom: isTopCard ? 50 : 0,
          height: isTopCard ? DeviceHeight-80 : DeviceHeight-53
        } ]}>

          <View style={[styles.card,{
              margin:0,
              overflow: 'hidden',
              padding:0,
              position:'relative',
              backgroundColor:  isThirdCard ? colors.white : colors.outerSpace,

            },{
              transform:[ {scale:isTopCard ? 1 : isThirdCard ? 0.8 : 0.95}]
            }]} key={`${potential.id || potential.user.id}-view`}>

            {this.props.isThirdCard ? null :
              <Animated.View style={{
                  position:'relative',
                  opacity:isTopCard ? 1 : this.props.inactiveOpacity,
                  backgroundColor: this.props.directionColor || colors.white
                }} ref={"incard"}>
                <Swiper
                  automaticallyAdjustContentInsets={true}
                  _key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  vertical={true}
                  autoplay={false}
                  showsPagination={true}
                  showsButtons={false}
                  paginationStyle={{position:'absolute',right:25,top:25,height:100}}
                  dot={ <View style={styles.dot} />}
                  activeDot={ <View style={styles.activeDot} /> }>
                  <Animated.Image
                    source={{uri: potential.user.image_url}}
                   defaultSource={require('image!defaultuser')}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20,
                      backgroundColor:colors.white,
                      opacity:isMoving && isMoving.interpolate({inputRange: [-200,0,200], outputRange: [0,1,0]})
                    }]}
                    resizeMode={Image.resizeMode.cover} />
                  {rel == 'single' && potential.partner &&
                  <Animated.Image
                    source={{uri: potential.partner.image_url}}
                    key={`${potential.partner.id}-cimg`}
                   defaultSource={require('image!defaultuser')}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20,
                      opacity:isMoving && isMoving.interpolate({inputRange: [-200,0,200], outputRange: [0,1,0]})
                    }]}
                    resizeMode={Image.resizeMode.cover} />
                  }
                </Swiper>
                {
                    <Animated.View style={[styles.animatedIcon,animIconStyle.deny]}>
                      <Image source={require('image!iconDeny')} style={{backgroundColor:'transparent',width:60,height:60}}/>
                    </Animated.View>
                }
                {
                    <Animated.View style={[styles.animatedIcon,animIconStyle.approve]}>
                      <Image source={require('image!iconApprove')} style={{backgroundColor:'transparent',width:60,height:60}}/>
                    </Animated.View>
                }

              </Animated.View>}
              {this.props.isThirdCard ? null :

            <View
              key={`${potential.id || potential.user.id}-bottomview`}
              style={{
                height:130,
                width:DeviceWidth-40,
                backgroundColor: colors.white,
                flexDirection:'row',
                flex:1,
                alignSelf:'stretch',
                alignItems:'stretch',
                position:'absolute',
                top:isTopCard ? DeviceHeight-190 : DeviceHeight-160,
                left:0,
                right:0,
              }}
              >
               <TouchableHighlight underlayColor={colors.warmGrey} onPress={()=>{ this.props.showProfile(potential)}}
                 style={{
                   paddingTop:30,
                   paddingBottom:15,
                   height:130,
                 }}>
                  <View>
                    <Text style={[styles.cardBottomText,{width:DeviceWidth-40}]}>{
                      {matchName}
                    }</Text>
                    <Text style={[styles.cardBottomOtherText,{width:DeviceWidth-40}]}>{
                      `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                    }</Text>
                  </View>
                </TouchableHighlight>

            {rel == 'single' &&  <View style={{
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

            </View>}

          </View>
        </View>

    )
  }else{
// ProfileVisible
      return (
        <View
          ref={'cardinside'}
          key={`${this.props.potential.id || potential.user.id}-inside`}
          style={[ styles.card,{
            backgroundColor:colors.outerSpace,
            transform:[ {scale: isTopCard ? 1 : 0.95}, ]
          },styles.shadowCard]}>
          <ScrollView
          style={[{
            margin:0,
            width:DeviceWidth,
            height:DeviceHeight,
            padding:0,
            position:'relative',
          }]}
          key={`${this.props.potential.id || potential.user.id}-view`}>

          <Swiper
            automaticallyAdjustContentInsets={true}
            _key={`${potential.id || potential.user.id}-swiper`}
            loop={true}
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
                 defaultSource={require('image!defaultuser')}
                style={[styles.imagebg,{ marginRight:-40,marginTop:-20}]}
                resizeMode={Image.resizeMode.cover} />

            {rel == 'single' && potential.partner &&
              <Animated.Image
                source={{uri: potential.partner.image_url}}
                key={`${potential.partner.id}-cimg`}
                 defaultSource={require('image!defaultuser')}
                style={[styles.imagebg,{ marginRight:-40,marginTop:-20}]}
                resizeMode={Image.resizeMode.cover} />
              }
          </Swiper>

            <View
            key={`${this.props.potential.id || potential.user.id}-bottomview`}
            style={{
              height: 600,
              backgroundColor:colors.outerSpace,
              flex:1,
              alignSelf:'stretch',
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

              <View style={{padding:20}}>
                <Text style={[styles.cardBottomOtherText,{color:colors.white,marginBottom:15,marginLeft:0}]}>{
                    `About Us`
                }</Text>
                <Text style={{color:colors.white,fontSize:18,marginBottom:15}}>{
                    this.props.potential.bio
                }</Text>
              </View>

              {this.props.rel == 'single' && potential.partner ?
                         <ScrollableTabView tabs={['1','2']} renderTabBar={() => <CustomTabBar  /> }>
                          <ProfileTable profile={this.props.potential.user}
                            tabLabel={`${potential.user.firstname} ${potential.user.age}`}/>
                          <ProfileTable profile={potential.partner}
                            tabLabel={`${potential.partner.firstname} ${potential.partner.age}`}/>
                          </ScrollableTabView> :
                          <ProfileTable profile={potential.user}
                          tabLabel={`${potential.user.firstname} ${potential.user.age}`}/>
                      }


            </View>

          </View>


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
    var NavBar = React.addons.cloneWithProps(this.props.pRoute.navigationBar, { navigator: this.props.navigator, route: this.props.route})

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


    { potentials.length < 1 &&
      <FadeInContainer delayAmount={10000} duration={300}>
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

             title={ this.getPotentialInfo()}
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
            }}}>
          <CardStack user={this.props.user} navigator={this.props.navigator} pRoute={this.props.pRoute}/>
      </AltContainer>
    )
  }
}


export default Potentials;
var CustomTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{color: isTabActive ? colors.mediumPurple : colors.white}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  setAnimationValue(value) {
    this.refs['TAB_UNDERLINE_REF'].setNativeProps(precomputeStyle({
      left: (DeviceWidth * value) / this.props.tabs.length
    }));
  },

  render() {
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: (DeviceWidth-40) / 2,
      height: 4,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <View style={tabUnderlineStyle} ref={'TAB_UNDERLINE_REF'} />
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
  paddingBottom: 10,
  width:(DeviceWidth - 40 )/ 2,

},

tabs: {
  height: 50,
  flexDirection: 'row',
  marginTop: -10,
  borderWidth: 1,
  width:DeviceWidth-40,
  flex:1,
  marginHorizontal:20,
  borderTopWidth: 1,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth:1,
  overflow:'hidden',
  borderColor: colors.warmGrey,
},
animatedIcon:{
  height:60,
  width:60,
  borderRadius:30,
  alignItems:'center',
  justifyContent:'center',
  top:DeviceHeight/2 - 80,
  left:DeviceWidth/2 - 30,
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
      borderWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop:65,
    marginBottom:20,
    padding:0,
    width:DeviceWidth,
    height:DeviceHeight-100,
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
      duration: 400,
      create: {
        duration: 100,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.spring,
        springDamping: 50,
      },
      update: {
        duration: 800,
        type: LayoutAnimation.Types.spring,
        springDamping: 500,
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
};
