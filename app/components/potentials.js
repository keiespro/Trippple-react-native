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

import reactMixin from 'react-mixin';
import Dimensions from 'Dimensions';

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
    return (

      <Animated.View style={{
          alignSelf:'center',
          transform: [
            {translateX: this.state.panX },
            {translateY: this.state.panY },
          ],
          width:(DeviceWidth - (this.props.profileVisible ? 0 : 40)),
          height:(DeviceHeight - (this.props.profileVisible ? 0 : 85)),
          left:this.props.profileVisible ? 0 : 20,
          right:this.props.profileVisible ? 0 : 20,
          top: (this.props.profileVisible ? 0 : 55),
          flex:1,
          position:'absolute',
        }}
        key={`${this.props.potential.id}-wrapper`}
        ref={(card) => { this.card = card }}
        {...this._panResponder.panHandlers}
        >


        <CoupleActiveCard
          isTopCard={this.props.isTopCard}
          profileVisible={this.props.profileVisible}
          hideProfile={this._hideProfile.bind(this)}
          showProfile={this._showProfile.bind(this)}
          potential={this.props.potential}
        />

      </Animated.View>
    );

  }
/*

{this.props.user.relationship_status == 'single' ?

:
        <View style={styles.singleCard} >
          <Image source={{uri: this.props.potential.image_url}} style={styles.imagebg} >
            <Text style={[styles.absoluteText,styles.absoluteTextBottom]}>{this.props.potential.firstname}</Text>
          </Image>
        </View>
      }
      */

}




class CoupleActiveCard extends Component{

  static displayName = 'CoupleInsideActiveCard'
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
    if(!this.props.profileVisible){
    return (
      <View ref={'cardinside'} key={`${this.props.potential.id}-inside`}
      style={ [styles.card,{
          marginBottom: this.props.isTopCard ? 0 : -25,
          transform:[ {scale:this.props.isTopCard ? 1 : 0.95}, ]
        },styles.shadowCard]}>

          <View style={[{
              margin:0,
              overflow: 'hidden',
              padding:0,
              position:'relative'
             }]} key={`${this.props.potential.id}-view`}>

              <View style={{overflow:'hidden'}}>
                <Swiper
                automaticallyAdjustContentInsets={true}
                  _key={`${this.props.potential.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  vertical={true}
                  showsPagination={true}
                  style={{overflow:'hidden',position:'relative'}}
                  showsButtons={false}
                  dot={ <View style={styles.dot} />}
                  activeDot={ <View style={styles.activeDot} /> }>
                  <Image source={{uri: this.props.potential.user.image_url}}
                    key={`${this.props.potential.user.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20 }]}
                    resizeMode={Image.resizeMode.cover} />
                  <Image source={{uri: this.props.potential.partner.image_url}}
                    key={`${this.props.potential.partner.id}-cimg`}
                    style={[styles.imagebg,{ marginRight:-40,marginTop:-20 }]}
                    resizeMode={Image.resizeMode.cover} />
                </Swiper>


              </View>
            <View
              key={`${this.props.potential.id}-bottomview`}
              style={{
                height:120,
                width:DeviceWidth-40,
                backgroundColor: colors.white,
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
                      `${this.props.potential.user.firstname.trim()} and ${this.props.potential.partner.firstname.trim()}`
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
                  <Image
                    source={{uri: this.props.potential.partner.image_url}}
                    key={this.props.potential.partner.id + 'img'}
                    style={styles.circleimage}
                    />

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
            transform:[ {scale:this.props.isTopCard ? 1 : 0.95}, ]
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
            style={[{backgroundColor:colors.outerSpace,paddingTop:0, },{flex:1,width:DeviceWidth, height:DeviceHeight,top:0,position:'absolute' }]}
            swiper={<Swiper
              onMomentumScrollEnd={ (e, state, context) => {
                this.setState({slideIndex: state.index})
              }}

                index={this.state.slideIndex || 0}
                _key={`${this.props.potential.id}-swiper`}
                loop={true}
                horizontal={false}

                vertical={true}
                showsPagination={true}
                showsButtons={false}
                dot={ <View style={styles.dot} />}
                activeDot={ <View style={styles.activeDot} /> }>

                <Image source={{uri: this.props.potential.user.image_url}}
                  key={`${this.props.potential.user.id}-cimg`}
                  style={[styles.imagebg,{ margin:0 }]}
                  resizeMode={Image.resizeMode.cover} />
                <Image source={{uri: this.props.potential.partner.image_url}}
                  key={`${this.props.potential.partner.id}-cimg`}
                  style={[styles.imagebg,{ margin:0 }]}
                  resizeMode={Image.resizeMode.cover} />

              </Swiper>}
            header={(



                <View style={{position:'absolute',top:30,left:20,width: 50, backgroundColor:'transparent',height: 50,alignSelf:'center',justifyContent:'center'}}>
                  <TouchableHighlight  onPress={this.props.hideProfile}>
                    <Image source={require('image!closeWithShadow')} resizeMode={Image.resizeMode.contain}/>
                  </TouchableHighlight>
                </View>

              )}>

              <View
                key={`${this.props.potential.id}-bottomview`}
                style={{
                  height:( 500),
                  backgroundColor:colors.outerSpace,
                  flex:1,
                  alignSelf:'stretch',
                  alignItems:'stretch',
                  left:0,
                  right:0,
                }} >
                  <View style={{
                    width: DeviceWidth ,
                    paddingVertical:20
                    }}>
                    <Text style={[styles.cardBottomText,{
                    width: DeviceWidth,

                    }]}>{
                      `${this.props.potential.user.firstname.trim()} and ${this.props.potential.partner.firstname.trim()}`
                    }</Text>
                  </View>
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
                  <View style={{width: DeviceWidth, padding:20}}>

                      <View>
                        <Text>You are welcome to contribute comments, but they should be relevant to the conversation. We reserve the right to remove off-topic remarks in the interest of keeping the conversation focused and engaging. Shameless self-promotion is well, shameless, and will get canned.</Text>
                      </View>
                  </View>

              </View>

              <View style={styles.bottomButtons}>
                <TouchableHighlight
                  style={[styles.topButton, {backgroundColor:colors.shuttleGray }]}
                  onPress={()=>{console.log("REJECT")}}
                  underlayColor={colors.white}>
                  <Image
                    source={require('image!close')}
                    />
                </TouchableHighlight>

                <TouchableHighlight
                style={[styles.topButton, {backgroundColor:colors.sushi }]}
                onPress={()=>{console.log("APPROVE")}}
                  underlayColor={colors.white}>
                  <Image
                    source={require('image!close')}
                    />
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
  }
  toggleProfile(){
    this.setState({profileVisible:!this.state.profileVisible})
  }
  render(){
    console.log(this.props.potentials)
    var NavBar = React.addons.cloneWithProps(this.props.pRoute.navigationBar, { navigator: this.props.navigator, route: this.props.route})

      return (
        <View style={{width:DeviceWidth,height:DeviceHeight,flex:1,alignItems:'center',justifyContent:'center',alignSelf:'stretch',backgroundColor:colors.outerSpace}}>

        {this.props.potentials && this.props.potentials.length >= 1  && this.props.potentials[2] &&
            <DummyCard />
        }

        { this.props.potentials && this.props.potentials.length >= 1 && this.props.potentials[1] &&
          <ActiveCard key={`${this.props.potentials[1].id}-activecard`} user={this.props.user} potential={this.props.potentials[1]} isTopCard={false}/>
        }
        {this.props.potentials && this.props.potentials.length >= 1  && this.props.potentials[0] &&
          <ActiveCard key={`${this.props.potentials[0].id}-activecard`} user={this.props.user} potential={this.props.potentials[0]} profileVisible={this.state.profileVisible} toggleProfile={this.toggleProfile.bind(this)} isTopCard={true}/>
        }

    { this.props.potentials.length < 1 &&
         <Image source={require('image!placeholderDashed')}
            resizeMode={Image.resizeMode.contain}
            style={styles.dashedBorderImage}>
            <Image source={require('image!iconClock')} style={{height:150,width:150,marginBottom:40}}/>
            <Text style={{color:colors.white,fontFamily:'Montserrat-Bold',fontSize:20,marginBottom:10}}>COME BACK AT MIDNIGHT</Text>
            <Text style={{color:colors.rollingStone,fontSize:20,marginHorizontal:70,marginBottom:180,textAlign:'center'}}>You’re all out of potential matches for today.</Text>

        </Image>
      }
      {!this.state.profileVisible && NavBar}

       </View>
      )
    }
}

class Potentials extends Component{
  constructor(props){
    super()
    MatchActions.getPotentials();

  }
  render(){
    return (
      <AltContainer store={PotentialsStore}>
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
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
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
