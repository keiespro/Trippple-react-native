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
  Animated,
  ScrollView,
  PanResponder
} from 'react-native';

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
      waitingForDoubleTap: false
    }
  }
  componentWillMount(){
    this._panResponder = {}

  }
  componentDidMount(){
    this.state.panX.setValue(0);     // Start 0
    // this.state.inactiveCardOpacity.setValue(0.5);     // Start 0

    Mixpanel.track('On - Potentials Screen');

  }
  componentDidUpdate(prevProps,prevState){
    console.log(this.props.potentials[0])

    if(prevProps.potentials[0] && this.props.potentials[0] && this.props.potentials[0].id != prevProps.potentials[0].id){
      this.state.panX.setValue(0)

    }
  }
  componentWillReceiveProps(nProps){
    if(this.props.potentials[0] || nProps.potentials[0].id && this.props.potentials[0].id != nProps.potentials[0].id){
      this.initializePanResponder()
    }
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
        }
      ]
    }
  }
  getAnimatedIconStyle =() =>{
    return {
      deny:{
        backgroundColor: colors.mandy,
        transform: [
          {
            translateX: this.state.panX.interpolate({inputRange: [-250, 0, 250], outputRange: [DeviceWidth/2-80,-50,-50]})
          },
          {
            scale: this.state.panX.interpolate({inputRange: [-250, 0, 250], outputRange: [1.3,0.2,0]})
          }
        ]
      },
      approve:{
        backgroundColor: colors.sushi,
        transform: [
          {
            translateX: this.state.panX.interpolate({inputRange: [-250, 0, 250], outputRange: [DeviceWidth+80,DeviceWidth+80,DeviceWidth/2-80]})
          },
          {
            scale: this.state.panX.interpolate({inputRange: [-250, 0, 250], outputRange: [0,0.2,1.3]})
          }
        ]
      }
    }
  }
  getInactiveOpacity = ()=>{
    console.log(this.state.panX)
    return this.state.panX ? this.state.panX.interpolate({inputRange: [-300, -150, 0, 150, 300], outputRange: [0.9,0.2,0.2,0.2,0.9]}) : 0.5

  }
  initializePanResponder(){
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
        this.state.panX.removeAllListeners();
        var id = this.state.panX.addListener(({value}) => { // listen until offscreen
          if (Math.abs(value) > 400) {
            const likeStatus = value > 0 ? 'approve' : 'deny';
            const likeUserId = this.props.potentials[0].user.id;
            MatchActions.sendLike(likeUserId,likeStatus)
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


  _showProfile(){
    if(this.state.isDragging || this.state.isAnimating){
      return false;
    }
    this.props.toggleProfile();
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

          alignSelf:'center',
          width:(DeviceWidth - (this.props.profileVisible ? 0 : 40)),
          height:(DeviceHeight - (this.props.profileVisible ? 0 : 85)),
          left:this.props.profileVisible ? 0 : 20,
          right:this.props.profileVisible ? 0 : 20,
          top: (this.props.profileVisible ? 0 : 55),
          flex:1,
          position:'absolute',
      }
    });
    var pan = this.state.panX || 0,
        animStyle = this.getStyle(),
        inactiveCardOpacity = this.getInactiveOpacity();
          console.log(pan)
    var animIconStyle = this.getAnimatedIconStyle();
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
        <DummyCard />
      }

      { potentials && potentials.length >= 1 && potentials[1] &&
        <View
          style={[cardStyle.wrap]}
          key={`${this.props.potentials[1].id}-wrapper`}
          ref={(card) => { this.nextcard = card }}
        >
        <InsideActiveCard
          key={`${potentials[1].id}-activecard`}
          user={user}
          inactiveOpacity={inactiveCardOpacity}
          ref={"_secondCard"}
          potential={potentials[1]}
          rel={user.couple ? 'couple' : 'single'}
          isTopCard={false}
        />
      </View>

      }
      { potentials && potentials.length >= 1  && potentials[0] &&
        <Animated.View
          style={[cardStyle.wrap,animStyle]}
          key={`${this.props.potentials[0].id}-wrapper`}
          ref={(card) => { this.card = card }}
          {...this._panResponder.panHandlers}
        >

        <InsideActiveCard
          user={user}
          key={`${potentials[0].id}-activecard`}
          rel={user.couple ? 'couple' : 'single'}
          isTopCard={true}
          profileVisible={this.props.profileVisible}
          hideProfile={this._hideProfile.bind(this)}
          inactiveOpacity={1}
          showProfile={this._showProfile.bind(this)}
          potential={this.props.potentials[0]}
        />

        </Animated.View>
      }
      { potentials && potentials.length >= 1  && potentials[0] &&
          <Animated.View style={[styles.animatedIcon,animIconStyle.deny]}>
            <Image source={require('image!close')} style={{width:20,height:20}}/>
          </Animated.View>
      }
      { potentials && potentials.length >= 1  && potentials[0] &&
          <Animated.View style={[styles.animatedIcon,animIconStyle.approve]}>
            <Image source={require('image!smallCheckMark')} style={{width:25,height:18}}/>
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
    if(nextProps.isTopCard && !this.props.isTopCard){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }else if(nextProps.profileVisible !== this.props.profileVisible){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    }
  }
  render(){

    var { rel, potential, profileVisible, isTopCard } = this.props

    var matchName = `${potential.user.firstname.trim()} ${potential.user.age}`;
    var distance = potential.user.distance
    if(rel == 'single') {
      matchName += ` & ${potential.partner.firstname.trim()} ${potential.partner.age}`
      distance = Math.min(distance,potential.partner.distance)
    }
    var city = potential.user.city_state
    if(!profileVisible){
    return (
      <View ref={'cardinside'} key={`${potential.id}-inside`}
        style={ [styles.shadowCard,{
          marginBottom: this.props.isTopCard ? 25 : 0,
          height: this.props.isTopCard ? DeviceHeight-60 : DeviceHeight-83
        } ]}>

          <View style={[styles.card,{
              margin:0,
              overflow: 'hidden',
              padding:0,
              position:'relative',
              backgroundColor:colors.outerSpace,

            },{
              marginBottom: this.props.isTopCard ? 25 : -25,
              transform:[ {scale:this.props.isTopCard ? 1 : 0.95}]
            }]} key={`${potential.id}-view`}>

            <Animated.View style={{opacity:this.props.inactiveOpacity || 1}}>
                <Swiper
                  automaticallyAdjustContentInsets={true}
                  _key={`${potential.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  vertical={true}
                  autoplay={false}
                  showsPagination={true}
                  showsButtons={false}
                  paginationStyle={{position:'absolute',right:25,top:25,height:100}}
                  dot={ <View style={styles.dot} />}
                  activeDot={ <View style={styles.activeDot} /> }>
                  <Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20,backgroundColor:colors.white }]}
                    resizeMode={Image.resizeMode.cover} />
                  {rel == 'single' &&
                  <Image
                    source={{uri: potential.partner.image_url}}
                    key={`${potential.partner.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20,backgroundColor:colors.white }]}
                    resizeMode={Image.resizeMode.cover} />
                  }
                </Swiper>

              </Animated.View>

            <View
              key={`${potential.id}-bottomview`}
              style={{
                height:130,
                width:DeviceWidth-40,
                backgroundColor: colors.white,
                flexDirection:'row',
                flex:1,
                alignSelf:'stretch',
                alignItems:'stretch',
                position:'absolute',
                top:isTopCard ? DeviceHeight-190 : DeviceHeight-180,
                left:0,
                right:0,
              }}
              >
               <TouchableHighlight underlayColor={colors.warmGrey} onPress={()=>{ this.props.showProfile()}}
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
              </View>

            </View>

          </View>
        </View>

    )
  }else{
// ProfileVisible
      return (
        <View ref={'cardinside'} key={`${this.props.potential.id}-inside`} style={

          [styles.card,{
            transform:[ {scale: isTopCard ? 1 : 0.95}, ]
          },styles.shadowCard]}>
          <View style={[{
              margin:0,
              width:DeviceWidth,
              height:DeviceHeight,
              padding:0,
              position:'relative'
             }]} key={`${this.props.potential.id}-view`}>


          <ParallaxSwiper
            showsVerticalScrollIndicator={false}
            windowHeight={500}



            navigator={this.props.navigator}
            style={[{backgroundColor:'transparent',paddingTop:0, },{flex:1,width:DeviceWidth, height:DeviceHeight,top:0,position:'absolute', }]}
            swiper={React.addons.createFragment(<Swiper
              onMomentumScrollEnd={ (e, state, context) => {
                this.setState({slideIndex: state.index})
              }}

                index={this.state.slideIndex || 0}
                _key={`${this.props.potential.id}-swiper`}
                loop={true}
                horizontal={true}
                style={{flexDirection:'row'}}
                vertical={false}
                showsPagination={true}
                showsButtons={false}
                dot={ <View style={styles.dot} />}
                activeDot={ <View style={styles.activeDot} /> }>

                <Image source={{uri: this.props.potential.user.image_url}}
                  key={`${this.props.potential.user.id}-cimg`}
                  style={[styles.imagebg,{ margin:0 }]}
                  resizeMode={Image.resizeMode.cover} />

                {this.props.rel == 'single' &&
                <Image source={{uri: this.props.potential.partner.image_url}}
                  key={`${this.props.potential.partner.id}-cimg`}
                  style={[styles.imagebg,{ margin:0 }]}
                  resizeMode={Image.resizeMode.cover} />
                }
              </Swiper>)}
            header={(



                <View style={styles.closeProfile}>
                  <TouchableHighlight underlayColor={colors.mediumPurple20} onPress={this.props.hideProfile}>
                    <View style={{padding:20}}>
                      <Image source={require('image!closeWithShadow')} resizeMode={Image.resizeMode.contain}/>
                    </View>
                  </TouchableHighlight>
                </View>


              )}>

              <BlurView blurType={'light'}
                key={`${this.props.potential.id}-bottomview`}
                style={{
                  height:( 500),
                  backgroundColor:'transparent',
                  flex:1,
                  alignSelf:'stretch',
                  alignItems:'stretch',
                  left:0,
                  right:0,
                }} >
                <View style={{ width: DeviceWidth , paddingVertical:20 }}>
                  <Text style={[styles.cardBottomText,{ width: DeviceWidth, }]}>{
                    matchName
                  }</Text>
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
                      style={[styles.circleimage, {marginRight:5}]}
                    />
                    <Image
                      source={{uri: this.props.potential.partner.image_url}}
                      key={this.props.potential.partner.id + 'img'}
                      style={styles.circleimage}
                      />
                </View>
                    }

                  <View style={{width: DeviceWidth, padding:20}}>

                      <View>
                        <Text>{this.props.potential.bio}</Text>
                      </View>
                  </View>

              </BlurView>

              <View style={styles.bottomButtons}>
                <TouchableHighlight
                  style={[styles.topButton, {backgroundColor:colors.shuttleGray }]}
                  onPress={()=>{this.props.hideProfile(); console.log('REJECT')}}
                  underlayColor={colors.white}>
                  <Image source={require('image!close')} />
                </TouchableHighlight>

                <TouchableHighlight
                style={[styles.topButton, {backgroundColor:colors.sushi }]}
                onPress={()=>{this.props.hideProfile(); console.log('APPROVE')}}
                  underlayColor={colors.white}>
                  <Image source={require('image!smallCheckMark')} />
                  </TouchableHighlight>
              </View>
         </ParallaxSwiper>

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
      <View
        style={[
          styles.basicCard,
          {
            margin:40,
            marginTop:75,
            marginBottom:50,
            position:'absolute',
            width: DeviceWidth - 80,
            height:DeviceHeight - 100,
            bottom:10
          }]
        }>
        <View style={{
            height:70,
            bottom:0,
            position:'absolute',
            width: DeviceWidth - 80,
            backgroundColor:colors.white,
            flex:1,
            alignSelf:'stretch'
          } }/>
      </View>
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
  }
  updateSecondCard(style){
    console.log(this.refs,style)
    console.log(this.refs._secondCard)
    // this.refs._secondCard && this.refs._secondCard.setNativeProps(style)
    // this.setState({secondStyles:style})
  }
  render(){
    var { potentials, user } = this.props
    var NavBar = React.addons.cloneWithProps(this.props.pRoute.navigationBar, { navigator: this.props.navigator, route: this.props.route})

      return (
        <View style={{backgroundColor:colors.outerSpace}}>

        <View style={[styles.cardStackContainer,{backgroundColor:'transparent'}]}>

        { potentials.length ?  <Cards
            user={user}
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
       {!this.state.profileVisible && NavBar}

     </View>
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
animatedIcon:{
  height:60,
  width:60,
  borderRadius:30,
  borderColor:colors.white,
  borderWidth:4,
  alignItems:'center',
  justifyContent:'center',
  top:DeviceHeight/2 - 30,
  position:'absolute',
  shadowColor:colors.darkShadow,
  shadowRadius:5,
  shadowOpacity:50,
  shadowOffset: {
    width:0,
    height: 5
  }
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
      duration: 500,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.spring,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 300
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
