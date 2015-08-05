/* @flow */

'use strict';

var React = require('react-native');
var {
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

var alt = require('../flux/alt');

var precomputeStyle = require('precomputeStyle');

var RNTAnimation = require('react-native-tween-animation');
var MatchActions = require('../flux/actions/MatchActions');
var p = require("../flux/stores/PotentialsStore");
var PotentialsStore = alt.createStore(p, 'PotentialsStore');
var AltContainer = require('alt/AltNativeContainer');
var Logger = require('../utils/logger');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var TimerMixin = require('react-timer-mixin');

var THROW_OUT_THRESHOLD = 250;
var colors = require('../utils/colors');
var Swiper = require('react-native-swiper');


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
  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  _cardStyles: {},
  _handle: '',
  card: (null : ?{ setNativeProps(props: Object): void }),
mixins: [TimerMixin],
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: this._handleOnStartShouldSetResponderCapture,
      onMoveShouldSetPanResponderCapture: this._handleOnMoveShouldSetResponderCapture,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._hanlePanResponderTerminationRequest,


    });
    this._previousLeft = 0;
    this._previousTop = 0;
    this._cardStyles = {
      left: this._previousLeft,
      top: this._previousTop,
   }
  },

  getInitialState(){
    return ({
      position: {
       left: this._previousLeft,
       top: 0,
     },
     showProfile: false,
     isAnimating:false,
     isDragging: false
    })
  },
  componentDidMount() {
    this._updatePosition();


  },

  componentDidUpdate(prevProps,prevState) {
    if(prevState.showProfile != this.state.showProfile)
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);

  },
  _showProfile(){
    console.log("_showProfile")
    if(this.state.isDragging || this.state.isAnimating) return false;

    this.setState({
      showProfile: true
    })
  },
  _hideProfile(){
    console.log("_hideProfile")
    this.setState({
      showProfile: false
    })
  },
  render() {
    console.log('render pots',this.props.user,this.props.potential)

      //
      // if(this.state.showProfile){
      //   return (
      //     <View
      //       key="activecardprofile"
      //       ref={(card) => { this.card = card }}
      //
      //       >
      //
      //       <CoupleProfile
      //         potential={this.props.potential}
      //         />
      //
      //     </View>
      //   )
      // }else{
        return (
          <View key="activecardprofile"
            ref={(card) => { this.card = card }}
            {...this._panResponder.panHandlers}
            style={{
              marginHorizontal:(this.state.showProfile ? 0 : 20),
              // width:(DeviceWidth - (this.state.showProfile ? 0 : 40)),
              // height:(DeviceHeight - (this.state.showProfile ? 0 : 75)),
              marginBottom:(this.state.showProfile ? 0 : 15),
              marginTop:(this.state.showProfile ? 0 : 55),
              flex:1,
              // position:'absolute',
              shadowColor:colors.darkShadow,
              shadowRadius:5,
              shadowOpacity:50,
              shadowOffset: {
                  width:0,
                  height: 10
              }}}>


            <CoupleActiveCard
              showProfile={this.state.showProfile}
              hideProfile={this._hideProfile}
              potential={this.props.potential} />

          </View>
        );
      // }
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
  _highlight() {
    var nativeProps = precomputeStyle({
      shadowOpacity: 100,
      shadowRadius:   0,
      shadowOffset: {width:0, height: 0},
      transform: [{scale: 1.05}]
    });

    this.card && this.card.setNativeProps(nativeProps)

    //   scale:2,
    //   // marginTop:40,
    //   // marginBottom:5,
    //   // padding:10,
    //   // width:DeviceWidth - 20,
    //
    //
    //
    // });
  },

  _unHighlight() {
    var nativeProps = precomputeStyle({
      shadowOpacity: 50,
      shadowRadius: 5,
      shadowOffset: {width:0, height: 0},
      transform: [{scale: 1}]
      // marginTop:55,
      // marginBottom:15,
      // padding:20,
      // width:DeviceWidth - 40,


    });
    this.card && this.card.setNativeProps(nativeProps);
  },
  componentWillUpdate(nextProps,nextState){
    if(nextProps.potential[0].id != this.props.potential[0].id){
      this._updatePosition({top:0,left:0})
    }
  },
  onPanResponderRelease(e: Object, gestureState: Object){
    console.log('onPanResponderRelease')
  },
  _hanlePanResponderTerminationRequest(e: Object, gestureState: Object){
    console.log('_hanlePanResponderTerminationRequest',e.nativeEvent,gestureState)
  },
  _updatePosition(tweenFrame) {
    // console.log('update position',this._cardStyles)
    this.card && this.card.setNativeProps(tweenFrame ? tweenFrame : this._cardStyles);
  },
  _handleOnStartShouldSetPanResponderCapture(e, gestureState){
    console.log(e,'_handleOnStartShouldSetResponderCapture');
    // return false;
  },
  _handleOnMoveShouldSetPanResponderCapture(e, gestureState){
    console.log(e,'_handleOnMoveShouldSetResponderCapture');
    // return false;
  },
  _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    Logger.log('_handleStartShouldSetPanResponder',gestureState.dx)

    // Should we become active when the user presses down on the card?
    this.x = this.setTimeout(()=>{
      this._showProfile();
    },1000)

    return false
  },

  _handleMoveShouldSetPanResponder(e: Object, gestureState): boolean {
    Logger.log('_handleMoveShouldSetPanResponder',gestureState.dy)

      this.clearTimeout(this.x);

    // Should we become active when the user moves a touch over the card?
    if(this.state.isDragging == true) return true;
    return Math.abs(gestureState.dy) < 1
  },

  _handlePanResponderGrant(e: Object, gestureState: Object) {
    this._highlight();
    Logger.log('Pan Responder Grant',gestureState.dx)

    console.log({gestureState},e)

      this.replaceState({
        isDragging: true
      })


  },
  _handlePanResponderMove(e: Object, gestureState: Object) {
    Logger.log('Pan Responder MOVE',gestureState.dx)
    if(this.x) this.clearTimeout(this.x);

    this._cardStyles.left = this._previousLeft + gestureState.dx;
    this._cardStyles.top = 0;
    this._updatePosition();

  },
  _handlePanResponderEnd(e: Object, gestureState: Object) {

    this.replaceState({
      isDragging: false
    })

    this._unHighlight();
    Logger.log('Pan Responder End',Math.abs(gestureState.moveX))
    console.log(e,gestureState,'end touch')
    if(Math.abs(gestureState.dx) > THROW_OUT_THRESHOLD ){

      Logger.debug('throwout',gestureState.dx)

        this.setState({
          isAnimating: true
        })

        var self = this;
        var likeStatus = gestureState.dx > 0 ? 'approve' : 'deny';

        MatchActions.sendLike(this.props.potential[0]['id'],likeStatus);

        var animation = new RNTAnimation({

          // Start state
          start: {
            top: this._cardStyles.top,
            left: this._cardStyles.left
          },

          // End state
          end: {
            top: 0,
            left: likeStatus == 'approve' ? 1000 : -1000
          },

          // Animation duration
          duration: 500,

          // Tween function
          tween: 'easeOutBack',

          // Update the component's state each frame
          frame: (tweenFrame) => {
            // console.log(tweenFrame);
            self._updatePosition( tweenFrame );
          },

          // Optional callback
          done: () => {

            console.log('All done!');
            self.replaceState({
              isAnimating:false,
              position: {
                left:0,
                top:0
              }
            })
            // Optionally reverse the animation
            // animation.reverse(() => {});
          }
        });

    }else{

        this.setState({
          isAnimating: true
        })

        var self = this;


        var animation = new RNTAnimation({

          // Start state
          start: {
            top: this._cardStyles.top,
            left: this._cardStyles.left
          },

          // End state
          end: {
            top: 0,
            left: 0
          },

          // Animation duration
          duration: 500,

          // Tween function
          tween: 'easeOutBack',

          // Update the component's state each frame
          frame: (tweenFrame) => {

            // console.log(tweenFrame);

            self._updatePosition( tweenFrame );
          },

          // Optional callback
          done: () => {

            console.log('All done!');
            self.replaceState({
              isAnimating:false,
              position: {
                left:0,
                top:0
              }
            })
            // Optionally reverse the animation
            // animation.reverse(() => {});
          }
        });





    }


  },
});




var CoupleActiveCard = React.createClass({


  render(){

      return(


        <View
          style={[styles.card,{
            width: DeviceWidth-(this.props.showProfile ? 0 : 40),
            height: this.props.showProfile ? undefined : (DeviceHeight - 75),
            overflow: this.props.showProfile ? 'visible' : 'hidden'
          }]}
          key={this.props.potential[0]['id']+'view'}>
          <ScrollView
              scrollEnabled={this.props.showProfile ? true : false}
              contentContainerStyle={[styles.scrollSection,{
                height:undefined,
                flex:3
              }]}>

            <Swiper
              _key={this.props.potential[0]['id']+'swiper'}
              loop={true}
              horizontal={false}
              vertical={true}
              height={ this.props.showProfile ? 200 : undefined}
              showsPagination={true}
              showsButtons={false}
              dot={ <View style={styles.dot} />}
              activeDot={ <View style={styles.activeDot} /> }>
              <Image source={{uri: this.props.potential[0].image_url}}
                key={this.props.potential[0]['id']+'cimg'}
                style={styles.imagebg} />
              <Image source={{uri: this.props.potential[1].image_url}}
                key={this.props.potential[1]['id']+'cimg'}
                style={styles.imagebg} />
            </Swiper>

        <View
          key={this.props.potential[0]['id']+'bottomview'}
          style={{
            height:(this.props.showProfile ? undefined : 80),
            bottom:0,
            position: this.props.showProfile ? 'relative' : 'absolute',
            backgroundColor: colors.white,
            width: DeviceWidth-(this.props.showProfile ? 0 : 40),
            flex:1,
            alignSelf:'stretch'}}
          >
          <Text style={styles.cardBottomText}>{`${this.props.potential[0].firstname} and ${this.props.potential[1].firstname}`}</Text>

          <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
            <Image source={{uri: this.props.potential[0].image_url}} key={this.props.potential[0]['id']+'img'} style={[styles.circleimage,{marginRight:5}]}/>
            <Image source={{uri: this.props.potential[1].image_url}} key={this.props.potential[1]['id']+'img'} style={styles.circleimage}/>
          </View>
          { this.props.showProfile && <View style={{height:undefined,padding:0}}>
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
        <View style={[styles.basicCard,{margin:30,marginTop:75,position:'absolute',width: DeviceWidth-60,height:DeviceHeight-100}]}>
          <Image source={{uri: this.props.potential[0].image_url}} style={[styles.imagebg,{width: DeviceWidth-60}]} />
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
              <View style={{shadowColor:colors.darkShadow,shadowRadius:20,shadowOffset:{width:0,height:10},shadowOpacity:80}}>
                <DummyCard />
              </View>
              <View style={{shadowColor:colors.darkShadow,shadowRadius:15,shadowOffset:{width:0,height:10},shadowOpacity:100}}>
                <CoupleInactiveCard  user={this.props.user} potential={this.props.potentials[1]} />
              </View>

              <ActiveCard user={this.props.user} potential={this.props.potentials[0]}/>

            </View>
        )
      }else{
         return(
          <View user={this.props.user} potential={this.props.potentials}>
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
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY

      },
      update: {
        delay: 500,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};
