/* @flow */

'use strict';

const React = require('react-native');
const {
 StyleSheet,
 Text,
 View,
 TouchableOpacity,
 LayoutAnimation,
 Touchable,
 TouchableWithoutFeedback,
 TouchableHighlight,
 Image,
 TextInput,
 ScrollView,
 PanResponder
} = React;

const alt = require('../flux/alt');

const precomputeStyle = require('precomputeStyle');

const RNTAnimation = require('react-native-tween-animation');
const MatchActions = require('../flux/actions/MatchActions');
const p = require("../flux/stores/PotentialsStore");
const PotentialsStore = alt.createStore(p, 'PotentialsStore');
const AltContainer = require('alt/AltNativeContainer');
const Logger = require('../utils/logger');
const DeviceHeight = require('Dimensions').get('window').height;
const DeviceWidth = require('Dimensions').get('window').width;
const TimerMixin = require('react-timer-mixin');

const THROW_OUT_THRESHOLD = 225;

const colors = require('../utils/colors');
const Swiper = require('react-native-swiper');


// class InactiveCard extends React.Component{
//   constructor(props){
//     super(props);
//   }
//   render(){
//
//     return (
//
//
//
//     )
//   }
// }
var ActiveCard = React.createClass({
  displayName: "ActiveCard",
  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  _cardStyles: {translateX:0, translateY:0},
  _handle: '',
  card: (null : ?{ setNativeProps(props: Object): void }),

  mixins: [TimerMixin],

  componentWillMount(){
    if(this.props.isTopCard) this.initializePanResponder()
  },
  componentDidUpdate(prevProps,prevState){
    if(this.props.isTopCard && !prevProps.isTopCard) this.initializePanResponder()
  },
  initializePanResponder(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: this._handleOnStartShouldSetResponderCapture,
      onMoveShouldSetPanResponderCapture: this._handleOnMoveShouldSetResponderCapture,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
      // onPanResponderTerminationRequest: this._hanlePanResponderTerminationRequest,


    });
    this._previousLeft = 0;
    this._previousTop = 0;
    this._cardStyles = {
      translateY: this._previousTop,
      translateX: this._previousLeft
   }
 },
  getInitialState(){
    return ({
      position: {
       translateX: 0,
       translateY: 0,
     },
     showProfile: false,
     isAnimating:false,
     isDragging: false
    })
  },
  componentDidMount(){
    this._updatePosition();
  },
  // componentWillUpdate(nextProps,nextState){
  //   if(nextProps.potential[0].id != this.props.potential[0].id ) this._updatePosition({translateY: 0,translateX: 0})
  //
  // },
  // componentDidUpdate(prevProps,prevState){
  //   if(prevState.showProfile != this.state.showProfile) LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
  // },
  _showProfile(){

    if(this.state.isDragging || this.state.isAnimating) return false;

    this.setState({
      showProfile: true
    })
  },
  _hideProfile(){

    this.setState({
      showProfile: false
    })
  },
  _highlight() {
    var nativeProps = precomputeStyle({
      shadowOpacity: 100,
      shadowRadius:   15,
      shadowOffset: {width:0, height: 0},
      transform: [{scale: 1.05}, ...this._cardStyles]
    });

    this.card && this.card.setNativeProps(nativeProps)


  },

  _unHighlight() {
    var nativeProps = precomputeStyle({
      shadowOpacity: 50,
      shadowRadius: 5,
      shadowOffset: {width:0, height: 0},
      transform: [{scale: 1}]
    });
    this.card && this.card.setNativeProps(nativeProps);
  },
  componentWillUpdate(nextProps,nextState){
    if(nextProps.potential[0].id != this.props.potential[0].id){
      this._updatePosition()
    }
  },
  // shouldComponentUpdate(nextProps,nextState){
  //   if(nextProps.potential[0].id != this.props.potential[0].id){
  //     this._updatePosition()
  //   }
  // },

  _updatePosition(tweenFrame) {
    var positionData = tweenFrame ? tweenFrame : this._cardStyles;
    var newPos = {
      transform: [
        {translateX:  parseFloat(positionData.translateX.toFixed(2))},
        {translateY:  parseFloat(positionData.translateY.toFixed(2))},
        // {scale: this.state.isDragging ? 1.05 : 1}
      ]
    }

    this.card && this.card.setNativeProps(precomputeStyle(newPos))
  },

  _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    Logger.log('_handleStartShouldSetPanResponder',gestureState.dx,gestureState.moveX)

    // Should we become active when the user presses down on the card?
    // this.x = this.setTimeout(()=>{
      // if(this.state.isDragging == true || this.state.isAnimating == true) return false;
    //
    //   this._showProfile();
    // },1000)


    return Math.abs(gestureState.dy) < Math.abs(gestureState.dx) && Math.abs(gestureState.dx) > 1 && Math.abs(gestureState.dy) < 15

  },

  _handleMoveShouldSetPanResponder(e: Object, gestureState): boolean {
    Logger.log('_handleMoveShouldSetPanResponder',gestureState.dx,gestureState,e)
    // if(this.state.isDragging == true) return false;

    //TODO: correctly determine velocity to determine if gesture was a throw
    // if(Math.abs(gestureState.vx*10000000) > 5){
    //   return true;
    // }else{
      return Math.abs(gestureState.dy) < Math.abs(gestureState.dx)
    // }
  },

  _handlePanResponderGrant(e: Object, gestureState: Object) {
    Logger.log('Pan Responder Grant',gestureState.dx,gestureState.moveX)
    // this.clearTimeout(this.x);
    // if(gestureState.dx > 0){
      this.replaceState({
        isDragging: true
      })
      if(!this.state.isDragging) this._highlight();
    // }
  },
  _handlePanResponderMove(e: Object, gestureState: Object) {
    Logger.log('Pan Responder MOVE',gestureState.dx,gestureState)
    // if(this.x) this.clearTimeout(this.x);
    // this._highlight();

    this._cardStyles = {
      translateX: gestureState.dx,
      translateY: 0
    };
    this._updatePosition();

  },
  _handlePanResponderEnd(e: Object, gestureState: Object) {

    this.replaceState({
      isDragging: false
    })
    this._unHighlight();
    Logger.log('Pan Responder End',Math.abs(gestureState.dx))

    Math.abs(gestureState.dx) > THROW_OUT_THRESHOLD ? this._throwOutCard(gestureState) : this._resetCard(gestureState)

  },
  _throwOutCard(gestureState){
    Logger.debug('throwout',gestureState.dx,this.state.isDragging)

    this.setState({
      isAnimating: true
    })

    var self = this;
    var likeStatus = gestureState.dx > 0 ? 'approve' : 'deny';

    var animation = new RNTAnimation({

      // Start state
      start: {
        translateY: 0,
        translateX: self._cardStyles.translateX
      },

      // End state
      end: {
        translateY: 0,
        translateX: (likeStatus == 'approve' ? 1000 : -1000)
      },

      // Animation duration
      duration: 300,

      // Tween function
      tween: 'easeOutBack',

      frame: (tweenFrame) => {
        self._updatePosition( tweenFrame );
      },

      done: () => {

        MatchActions.sendLike(this.props.potential[0]['id'],likeStatus);
        //
        // self.replaceState({
        //   isAnimating:false,
        //   // position: {
        //   //   translateY:0,
        //   //   translateX:0
        //   // }
        // })
      }
    });

  },
  _resetCard(gestureState){
    this.setState({
      isAnimating: true
    })

    var self = this;


    var animation = new RNTAnimation({

      // Start state
      start: {
        translateY: self._cardStyles.translateY,
        translateX: self._cardStyles.translateX
      },

      // End state
      end: {
        translateY: 0,
        translateX: 0
      },

      // Animation duration
      duration: Math.abs(self._cardStyles.translateX)*1.5,

      // Tween function
      tween: 'easeOutBack',

      // Update the component's state each frame
      frame: (tweenFrame) => {
        self._updatePosition( tweenFrame );
      },

      done: () => {
        self.replaceState({
          isAnimating:false,
          // position: {
          //   translateX:0,
          //   translateY:0
          // }
        })
      }
    });
  },
  render() {

    return (

      <View style={
        this.props.isTopCard ? {
          alignSelf:'center',
          width:(DeviceWidth - 40),
          height:(DeviceHeight -  85),
          bottom:(35),
          left:20,
          right:20,
          top:(55),
          flex:1,
          shadowColor:colors.darkShadow,
          shadowRadius:5,
          position:'absolute',
          shadowOpacity:50,
          shadowOffset: {
              width:0,
              height: 5
          }
        } :  {
                shadowColor:colors.darkShadow,
                shadowRadius:5,
                // bottom:(35),
                left:20,
                right:20,
                top:(75),
                flex:1,
                alignSelf:'center',
                position:'absolute',
                shadowOffset:{width:0, height:5},
                shadowOpacity:50,
                width:(DeviceWidth - 40),
                height:(DeviceHeight - 85),
              }
      }
      key={this.props.potential[0]['id']+'wrapper'}
        ref={(card) => { this.card = card }}
        {...this._panResponder.panHandlers}>


        <CoupleActiveCard
          isTopCard={this.props.isTopCard}
          showProfile={this.state.showProfile}
          hideProfile={this._hideProfile}
          potential={this.props.potential} />

        </View>
    );

  },
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

});




var CoupleActiveCard = React.createClass({
  displayName: "CoupleInsideActiveCard",

  componentDidUpdate(prevProps,prevState) {
    if(prevProps.showProfile != this.props.showProfile)
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);

  },

  render(){

      return(
        <View key={this.props.potential[0].id+'inside'} style={
          // this.props.isTopCard ? [styles.card,{
          //   overflow: this.props.showProfile ? 'visible' : 'hidden',
          //   shadowColor:colors.darkShadow,
          //   shadowRadius:15,
          //   shadowOpacity:50,
          //   shadowOffset: {
          //       width:0,
          //       height: 10
          //   }
          // }] : [
          //   styles.basicCard,
          //   {margin:30,marginTop:75,position:'absolute'}
          // ]
          [styles.card,{
            overflow: this.props.showProfile ? 'visible' : 'hidden',
            shadowColor:colors.darkShadow,
            shadowRadius:15,
            shadowOpacity:50,
            shadowOffset: {
                width:0,
                height: 10
            }
          },
          {transform:[{scale:this.props.isTopCard ? 1 : 0.955}]}

          ]
          }>

          <ScrollView
              scrollEnabled={this.props.showProfile ? true : false}
              horizontal={false}
              centerContent={true}
              bouncesZoom={true}
              contentContainerStyle={[styles.scrollSection,{
                alignItems:'stretch',
                overflow: 'visible',
                paddingBottom:this.props.showProfile ? 3000 : 0

              }]}>

          <View
            style={[styles.scrollSection,{
              overflow: 'visible',
              height:undefined,

            }]}
            key={this.props.potential[0]['id']+'view'}>
            <Swiper
              _key={this.props.potential[0]['id']+'swiper'}
              loop={true}
              horizontal={false}
              vertical={true}
              showsPagination={true}
              showsButtons={false}
              dot={ <View style={styles.dot} />}
              activeDot={ <View style={styles.activeDot} /> }>
              <Image source={{uri: this.props.potential[0].image_url}}
                key={this.props.potential[0]['id']+'cimg'}
                style={styles.imagebg}
                resizeMode={Image.resizeMode.cover} />
              <Image source={{uri: this.props.potential[1].image_url}}
                key={this.props.potential[1]['id']+'cimg'}
                style={styles.imagebg}
                resizeMode={Image.resizeMode.cover} />
            </Swiper>

        <View
          key={this.props.potential[0]['id']+'bottomview'}
          style={{
            height:(this.props.showProfile ? undefined : 80),
            bottom:0,
            position: this.props.showProfile ? 'relative' : 'absolute',
            left: 0,
            marginTop: this.props.showProfile ? -80 : 0,
            backgroundColor: colors.white,
            width: DeviceWidth-(this.props.showProfile ? 0 : 40),
            flex:1,
            alignSelf:'stretch',
            alignItems:'stretch',
          }}
          >
          <View style={{
            width: DeviceWidth-(this.props.showProfile ? 0 : 40),
            paddingVertical:20

            }}>

              <Text style={styles.cardBottomText}>{`${this.props.potential[0].firstname} and ${this.props.potential[1].firstname}`}</Text>
          </View>
          <View style={{
              height:60,
              top:-30,
              position:'absolute',
              width:135,
              right:0,
              backgroundColor:'transparent',
              flexDirection:'row'}}>
            <Image source={{uri: this.props.potential[0].image_url}} key={this.props.potential[0]['id']+'img'} style={[styles.circleimage,{marginRight:5}]}/>
            <Image source={{uri: this.props.potential[1].image_url}} key={this.props.potential[1]['id']+'img'} style={styles.circleimage}/>
          </View>
          { this.props.showProfile &&
            <View style={{height:undefined,width: DeviceWidth, padding:20}}>
              <TouchableHighlight  onPress={this.props.hideProfile}>
                <Text>Close</Text>
              </TouchableHighlight>
                <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
                <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
                <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
                <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
                <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
                <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
              </View>}

        </View>
        </View>

        </ScrollView>

      </View>

      )

  }
})


var CoupleProfile =React.createClass({

  render(){

      return(
        <View style={[styles.card,{width: DeviceWidth}]} key={this.props.potential[0]['id']+'view'}>
          {/**/}
          <Swiper
            _key={this.props.potential[0]['id']+'swiper'}
            style={[styles.wrapper]}
            loop={true}
            horizontal={false}
            vertical={true}
            showsPagination={true}
            showsButtons={false}
            dot={ <View style={styles.dot} />}
            activeDot={ <View style={styles.activeDot} /> }>
            <Image source={{uri: this.props.potential[0].image_url}} key={this.props.potential[0]['id']+'cimg'} style={[styles.imagebg,{width: DeviceWidth}]} />
            <Image source={{uri: this.props.potential[1].image_url}} key={this.props.potential[1]['id']+'cimg'} style={[styles.imagebg,{width: DeviceWidth}]} />
          </Swiper>

          <View key={this.props.potential[0]['id']+'bottomview'}  style={{backgroundColor:colors.white,width: DeviceWidth, alignSelf:'stretch'}}>
            <Text style={styles.cardBottomText}>{`${this.props.potential[0].firstname} and ${this.props.potential[1].firstname}`}</Text>

            <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
              <Image source={{uri: this.props.potential[0].image_url}} style={[styles.circleimage,{marginRight:5}]}/>
              <Image source={{uri: this.props.potential[1].image_url}} style={styles.circleimage}/>
            </View>
            <TouchableHighlight  onPress={this.props.hideProfile}>
              <Text>Close</Text>
            </TouchableHighlight>
            <View style={{height:360,padding:20}}>
              <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
              <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
              <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
              <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
              <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
              <Text>{"transform [{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}] "}</Text>
            </View>

          </View>

      </View>

      )

  }
})


class CoupleInactiveCard extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
      return(
        <View key={this.props.potential[0]['id']+'wrapper'} style={[styles.basicCard,{margin:30,marginTop:75,position:'absolute',width: DeviceWidth-60,height:DeviceHeight-100}]}>
          <Image source={{uri: this.props.potential[0].image_url}} key={this.props.potential[0]['id']+'cimg'} style={[styles.imagebg,{width: DeviceWidth-60}]} />
          <View style={{height:70,bottom:0,position:'absolute',width: DeviceWidth-60,backgroundColor:colors.white, flex:5, alignSelf:'stretch'}}>
            <Text style={styles.cardBottomText}>{`${this.props.potential[0].firstname} and ${this.props.potential[1].firstname}`}</Text>

            <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
              <Image source={{uri: this.props.potential[0].image_url}} style={[styles.circleimage,{marginRight:5}]}/>
              <Image source={{uri: this.props.potential[1].image_url}} style={styles.circleimage}/>
            </View>

          </View>
        </View>
      )
  }
}

class DummyCard extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
      return(
        <View style={[styles.basicCard,{margin:40,marginTop:85,position:'absolute',width: DeviceWidth-80,height:DeviceHeight-100}]}>
          <View style={{height:70,bottom:0,position:'absolute',width: DeviceWidth-80,backgroundColor:colors.white, flex:5, alignSelf:'stretch'}}/>
        </View>
      )
  }
}

// stub
class CardStack extends React.Component{
  constructor(props){
    console.log('SinglesCardStack',props.potentials)
    super(props)
  }
  render(){

      if(this.props.potentials.length){
        return (
            <View style={{width:DeviceWidth,height:DeviceHeight,flex:1,alignSelf:'stretch'}}>

              {this.props.potentials[2] &&
                <View style={{shadowColor:colors.darkShadow,shadowRadius:5,shadowOffset:{width:0,height:5},shadowOpacity:30}}>
                  <DummyCard />
                </View>
              }
              {this.props.potentials[1] &&
                <ActiveCard key={this.props.potentials[1][0]['id']+'activecard'} user={this.props.user} potential={this.props.potentials[1]} isTopCard={false}/>

              /*
                <View style={{shadowColor:colors.darkShadow,shadowRadius:5,shadowOffset:{width:0,height:5},shadowOpacity:50}}>
                  <CoupleInactiveCard  user={this.props.user} potential={this.props.potentials[1]} />
                </View>
              */
              }
              {this.props.potentials[0] &&
                <ActiveCard key={this.props.potentials[0][0]['id']+'activecard'} user={this.props.user} potential={this.props.potentials[0]} isTopCard={true}/>
              }
            </View>
        )
      }else{
         return(
          <View user={this.props.user}>
            <TouchableHighlight onPress={() => MatchActions.getPotentials()}>
              <View>
                <Text> get </Text>
              </View>
            </TouchableHighlight>
          </View>
        )
       }
   }
}

class Potentials extends React.Component{
  constructor(props){
    super(props)
  }
  render(){


    return(
      <AltContainer
        stores={{
          potentials (props) {
            return {
              store: PotentialsStore,
              value: PotentialsStore.getAll()
            }
          }
        }}>
        <CardStack user={this.props.user} />

      </AltContainer>

    )
  }
}


module.exports = Potentials;
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
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 3,
    marginBottom: 3,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.outerSpace,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 3,
    marginBottom: 3,
    borderWidth: 2,
    borderColor: colors.mediumPurple20
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
    borderColor: colors.shuttleGray,
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
      duration: 200,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY

      },
      update: {

        duration: 200,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.spring,
        springDamping: 1000

      }
    }
  }
};
