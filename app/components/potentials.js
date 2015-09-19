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
      profileVisible: false,
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
  }
  componentDidUpdate(prevProps,prevState){
    if(this.props.isTopCard && !prevProps.isTopCard){
      this.initializePanResponder()
    }
  }
  initializePanResponder(){
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e,gestureState) => !this.state.profileVisible && Math.abs(gestureState.dy) < 5,
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
    this.setState({ profileVisible: true, waitingForDoubleTap: false })
  }


  _showProfile(){
    if(this.state.isDragging || this.state.isAnimating){
      return false;
    }
    this.setState({ profileVisible: true })
  }

  _hideProfile(){ this.setState({ profileVisible: false }) }

  render() {
    return (

      <Animated.View style={{
          alignSelf:'center',
          transform: [
            {translateX: this.state.panX },
            {translateY: this.state.panY },
          ],
          width:(DeviceWidth - (this.state.profileVisible ? 0 : 40)),
          height:(DeviceHeight - (this.state.profileVisible ? 0 : 85)),
          left:this.state.profileVisible ? 0 : 20,
          right:this.state.profileVisible ? 0 : 20,
          top: (this.state.profileVisible ? 0 : 55),
          flex:1,
          position:'absolute',
        }}
        key={`${this.props.potential.id}-wrapper`}
        ref={(card) => { this.card = card }}
        {...this._panResponder.panHandlers}
        >


        <CoupleActiveCard
          isTopCard={this.props.isTopCard}
          profileVisible={this.state.profileVisible}
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

    return (
      <View ref={'cardinside'} key={`${this.props.potential.id}-inside`} style={

        [styles.card,{
          overflow: this.props.profileVisible ? 'visible' : 'hidden',
          marginBottom: this.props.isTopCard ? 0 : -25,
          height: this.props.profileVisible ? DeviceHeight : undefined,
          position:'relative',
          transform:[
            {scale:this.props.isTopCard ? 1 : 0.95},

          ]
        },{
            shadowColor:colors.darkShadow,
          shadowRadius:5,
          shadowOpacity:50,
          shadowOffset: {
              width:0,
              height: 5
          }
          }
        ] }>



        <ScrollView
            scrollEnabled={this.props.profileVisible ? true : false}
            horizontal={false}
            centerContent={true}
            bouncesZoom={true}
            contentContainerStyle={[styles.scrollSection,{
              alignItems:'stretch',
              overflow: 'visible',
            }]}>

          <View style={[styles.scrollSection,{
              overflow: 'visible',
              height:undefined,

            }]}
            key={`${this.props.potential.id}-view`}>

            {this.props.profileVisible ?
               <View style={{
                 height: DeviceHeight*2/3,
                position:'relative',
                top:0
              }}>

              <Swiper
                _key={`${this.props.potential.id}-swiper`}
                loop={true}
                horizontal={false}
                vertical={true}
                showsPagination={true}
                contentContainerStyle={{
                  position:'absolute',
                  top:0
                }}
                showsButtons={false}
                dot={ <View style={styles.dot} />}
                activeDot={ <View style={styles.activeDot} /> }>

                <Image source={{uri: this.props.potential.user.image_url}}
                  key={`${this.props.potential.user.id}-cimg`}
                  style={styles.imagebg}
                  resizeMode={Image.resizeMode.cover} />
                <Image source={{uri: this.props.potential.partner.image_url}}
                  key={`${this.props.potential.partner.id}-cimg`}
                  style={styles.imagebg}
                  resizeMode={Image.resizeMode.cover} />

              </Swiper>
                  <View  style={{position:'absolute',top:50,left:0,width: 50, backgroundColor:'transparent',height: 50,alignSelf:'center',justifyContent:'center'}}>
                    <TouchableHighlight  onPress={this.props.hideProfile}>
                      <Image source={require('image!closeWithShadow')} resizeMode={Image.resizeMode.cover}/>
                    </TouchableHighlight>
                  </View>

             </View>
              :

                <Swiper
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
                    style={styles.imagebg}
                    resizeMode={Image.resizeMode.cover} />
                  <Image source={{uri: this.props.potential.partner.image_url}}
                    key={`${this.props.potential.partner.id}-cimg`}
                    style={styles.imagebg}
                    resizeMode={Image.resizeMode.cover} />
                </Swiper>
            }

            <View
              key={`${this.props.potential.id}-bottomview`}
              style={{
                height:(this.props.profileVisible ? DeviceHeight / 3 : 80),
                bottom: this.props.profileVisible ? undefined : 0,
                // overflow:'visible',
                // left: 0,
                // marginTop: this.props.profileVisible ? -80 : 0,
                backgroundColor: colors.white,
                width: DeviceWidth - (this.props.profileVisible ? 0 : 40),
                flex:1,
                alignSelf:'stretch',
                alignItems:'stretch',
                position: this.props.profileVisible ? 'relative' : 'absolute'
              }}
              >
              {this.props.profileVisible ?
                <View style={{
                  width: DeviceWidth - (this.props.profileVisible ? 0 : 40),
                  paddingVertical:20
                  }}>
                  <Text style={styles.cardBottomText}>{
                    `${this.props.potential.user.firstname.trim()} and ${this.props.potential.partner.firstname.trim()}`
                  }</Text>
                </View>

              : <TouchableHighlight underlayColor={colors.warmGrey} onPress={()=>{ this.props.showProfile()}} style={{ paddingVertical:22 }}>
                  <Text style={styles.cardBottomText}>{
                    `${this.props.potential.user.firstname.trim()} and ${this.props.potential.partner.firstname.trim()}`
                  }</Text>
                </TouchableHighlight>
              }
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
              { this.props.profileVisible &&
                <View style={{height:undefined,width: DeviceWidth, padding:20}}>
                  <View>
                    <Text>{this.props.potential.bio}</Text>
                  </View>
                </View>
              }

            </View>
          </View>

        </ScrollView>

      </View>

    )

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
            marginTop:85,
            position:'absolute',
            width: DeviceWidth - 80,
            height:DeviceHeight - 100
          }]
        }>
        <View style={{
            height:70,
            bottom:0,
            position:'absolute',
            width: DeviceWidth - 80,
            backgroundColor:colors.white,
            flex:5,
            alignSelf:'stretch'
          } }/>
      </View>
    )

  }
}

class CardStack extends Component{
  constructor(props){
    super()
  }
  render(){

    if(this.props.potentials.length){
      return (
        <View style={{width:DeviceWidth,height:DeviceHeight,flex:1,alignSelf:'stretch',backgroundColor:colors.outerSpace}}>

        {this.props.potentials[2] &&
          <View style={{shadowColor:colors.darkShadow,shadowRadius:5,shadowOffset:{width:0,height:5},shadowOpacity:30}}>
            <DummyCard />
          </View>
        }
        {this.props.potentials[1] &&
          <ActiveCard key={`${this.props.potentials[1].id}-activecard`} user={this.props.user} potential={this.props.potentials[1]} isTopCard={false}/>
        }
        {this.props.potentials[0] &&
          <ActiveCard key={`${this.props.potentials[0].id}-activecard`} user={this.props.user} potential={this.props.potentials[0]} isTopCard={true}/>
        }
        </View>
      )
    }else{
      //TODO: show what when no potential matches ?
      return (
        <View user={this.props.user} style={{backgroundColor:colors.outerSpace}} >
          <TouchableHighlight onPress={() => MatchActions.getPotentials()}>
            <View style={{padding:50}}>
            <Text>(DEV MODE) TAP TO GET MORE POTENTIALS</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }
}

class Potentials extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <AltContainer store={PotentialsStore}>
        <CardStack user={this.props.user} />
      </AltContainer>
    )
  }
}


export default Potentials;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow:'hidden',
    top:50
  },
  innerContainer:{
    backgroundColor: '#fff',
    paddingBottom:50,
    paddingTop:0,
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
    height: undefined,
    bottom:0,
    top:0,
    left:0,
    right:0,

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
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor:'rgba(0,0,0,.2)',
      overflow:'hidden',

    },
  card: {
    borderRadius:3,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor:'rgba(0,0,0,.2)',
    justifyContent: 'center',
    alignItems: 'stretch',

  },



  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    margin:0,
    padding:0,
    alignItems:'stretch',
    flexDirection:'column',
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
