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
import Swiper from 'react-native-swiper';
import FadeInContainer from './FadeInContainer'
import reactMixin from 'react-mixin';
import Dimensions from 'Dimensions';
import {BlurView,VibrancyView} from 'react-native-blur'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import PotentialsStore from '../flux/stores/PotentialsStore'

const THROW_OUT_THRESHOLD = 225;


@reactMixin.decorate(TimerMixin)
class ActiveCard extends Component{

  static displayName = 'ActiveCard'

  constructor(props){
    super()

    this.state = {
      panX: new Animated.Value(0),
      panY: new Animated.Value(0),
      waitingForDoubleTap: false
    }
  }
  componentWillMount(){
    this._panResponder = {}

    this.props.isTopCard && this.initializePanResponder()
  }
  componentDidMount(){
    this.state.panX.setValue(0);     // Start 0
    this.state.panY.setValue(0);     // Start 0
    Mixpanel.track('On - Potentials Screen');

  }
  componentDidUpdate(prevProps,prevState){
    if(this.props.isTopCard && !prevProps.isTopCard){
      this.initializePanResponder()
    }
  }
  initializePanResponder(){
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e,gestureState) => !this.props.profileVisible && Math.abs(gestureState.dy) < 5,
      onStartShouldSetPanResponder: (e,gestureState) => false,
      // onPanResponderGrant: () => {      },
      onPanResponderMove: Animated.event( [null, {dx: this.state.panX}] ),
      onPanResponderRelease: (e, gestureState) => {
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
            const likeUserId = this.props.potential.user.id;
            MatchActions.sendLike(likeUserId,likeStatus)
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

    const cardStyle = StyleSheet.create({
        wrap:{
          transform: [
            {translateX: this.state.panX },
            {translateY: this.state.panY },
          ],
          alignSelf:'center',
          width:(DeviceWidth - (this.props.profileVisible ? 0 : 40)),
          height:(DeviceHeight - (this.props.profileVisible ? 0 : 85)),
          left:this.props.profileVisible ? 0 : 20,
          right:this.props.profileVisible ? 0 : 20,
          top: (this.props.profileVisible ? 0 : 55),
          flex:1,
          position:'absolute',
      }
    })

    return (

      <Animated.View style={cardStyle.wrap}
        key={`${this.props.potential.id}-wrapper`}
        ref={(card) => { this.card = card }}
        {...this._panResponder.panHandlers}
        >

        <InsideActiveCard
          rel={this.props.user.couple ? 'couple' : 'single'}
          isTopCard={this.props.isTopCard}
          profileVisible={this.props.profileVisible}
          hideProfile={this._hideProfile.bind(this)}
          showProfile={this._showProfile.bind(this)}
          potential={this.props.potential}
        />

      </Animated.View>
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
      LayoutAnimation.spring();
    }else if(nextProps.profileVisible !== this.props.profileVisible){
      LayoutAnimation.spring()
    }
  }
  render(){

    var { rel, potential, profileVisible, isTopCard } = this.props
    var matchName = `${this.props.potential.user.firstname.trim()}`;
    if(rel == 'single') matchName += ` and ${this.props.potential.partner.firstname.trim()}`

    if(!profileVisible){
    return (

      <View ref={'cardinside'} key={`${potential.id}-inside`}
        style={ [styles.card,{
          marginBottom: this.props.isTopCard ? 0 : -25,
          transform:[ {scale:this.props.isTopCard ? 1 : 0.95}, ]
        },styles.shadowCard]}>

          <View style={[{
              margin:0,
              overflow: 'hidden',
              padding:0,
              position:'relative'
             }]} key={`${potential.id}-view`}>

                <Swiper
                  automaticallyAdjustContentInsets={true}
                  _key={`${potential.id}-swiper`}
                  loop={true} horizontal={false} vertical={true} autoplay={false}
                  showsPagination={true} showsButtons={false}
                  dot={ <View style={styles.dot} />}
                  activeDot={ <View style={styles.activeDot} /> }>
                  <Image source={{uri: this.props.potential.user.image_url}}
                    key={`${this.props.potential.user.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20 }]}
                    resizeMode={Image.resizeMode.cover} />
                  {this.props.rel == 'single' &&
                  <Image source={{uri: this.props.potential.partner.image_url}}
                    key={`${this.props.potential.partner.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20 }]}
                    resizeMode={Image.resizeMode.cover} />
                  }
                </Swiper>


            <BlurView blurType={'dark'}
              key={`${this.props.potential.id}-bottomview`}
              style={{
                height:120,
                width:DeviceWidth-40,
                backgroundColor: 'transparent',
                flexDirection:'row',
                flex:1,
                alignSelf:'stretch',
                alignItems:'stretch',
                position:'absolute',
                top:DeviceHeight-120,
                left:20,
                right:0,
              }}
              >
               <TouchableHighlight underlayColor={colors.warmGrey} onPress={()=>{ this.props.showProfile()}}>
                  <View>
                    <Text style={[styles.cardBottomText,{width:DeviceWidth-40}]}>{
                      {matchName}
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
                    source={{uri: this.props.potential.user.image_url}}
                    key={this.props.potential.user.id + 'img'}
                    style={[styles.circleimage, {marginRight:5}]}
                  />
                  {this.props.rel == 'single' &&
                  <Image
                    source={{uri: this.props.potential.partner.image_url}}
                    key={this.props.potential.partner.id + 'img'}
                    style={styles.circleimage}
                    />
                  }
              </View>



            </BlurView>
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
                  onPress={()=>{console.log("REJECT")}}
                  underlayColor={colors.white}>
                  <Image source={require('image!close')} />
                </TouchableHighlight>

                <TouchableHighlight
                style={[styles.topButton, {backgroundColor:colors.sushi }]}
                onPress={()=>{console.log("APPROVE")}}
                  underlayColor={colors.white}>
                  <Image source={require('image!close')} />
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
            backgroundColor:'transparent',
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
  render(){
    var { potentials, user } = this.props
    var NavBar = React.addons.cloneWithProps(this.props.pRoute.navigationBar, { navigator: this.props.navigator, route: this.props.route})

      return (
        <View style={styles.cardStackContainer}>

        { potentials && potentials.length >= 1 && potentials[2] &&
          <DummyCard />
        }

        { potentials && potentials.length >= 1 && potentials[1] &&
          <ActiveCard
            key={`${potentials[1].id}-activecard`}
            user={user}
            potential={potentials[1]}
            isTopCard={false}/>
        }

        { potentials && potentials.length >= 1  && potentials[0] &&
          <ActiveCard
          key={`${potentials[0].id}-activecard`}
          user={user}
          potential={potentials[0]}
          profileVisible={this.state.profileVisible}
          toggleProfile={this.toggleProfile.bind(this)}
          isTopCard={true}/>
        }

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

shadowStyles:{
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
    borderRadius:3,
    backgroundColor: colors.dark,
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
    borderRadius:3,
    backgroundColor: colors.dark,
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
  top:10,left:5,width: 50,
  backgroundColor:'transparent',
  height: 50,alignSelf:'center',
  overflow:'hidden',
  justifyContent:'center',alignItems:'center',padding:20,borderRadius:25
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
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: 'transparent',
    width: 20,
    height: 20,
    borderRadius: 10,
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

  width:DeviceWidth,height:DeviceHeight,flex:1,alignItems:'center',justifyContent:'center',alignSelf:'stretch',backgroundColor:colors.outerSpace
  },

  cardBottomText:{
    marginLeft:15,
    fontFamily:'Montserrat',
    color: colors.shuttleGray,
    fontSize:22,
    marginTop:10
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
