/* @flow */

import React from 'react-native';
import {
 StyleSheet,
 Text,
 View,
 LayoutAnimation,
 TouchableHighlight,
 Image,
 ScrollView,
 PanResponder
} from 'react-native';

import alt from '../flux/alt';
import precomputeStyle from 'precomputeStyle';
import RNTAnimation from 'react-native-tween-animation';
import MatchActions from '../flux/actions/MatchActions';

import AltContainer from 'alt/AltNativeContainer';
import TimerMixin from 'react-timer-mixin';
import colors from '../utils/colors';
import Swiper from 'react-native-swiper';

import reactMixin from 'react-mixin';
import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const PotentialsStore = '../flux/stores/PotentialsStore'

const THROW_OUT_THRESHOLD = 225;


@reactMixin.decorate(TimerMixin)
class ActiveCard extends React.Component{
  static displayName = 'ActiveCard'

  constructor(props){
    super()

    this.state = {
      position: {
        translateX: 0,
        translateY: 0,
      },
      profileVisible: false,
      isAnimating:false,
      isDragging: false,
      waitingForDoubleTap: false
    }
  }
  componentWillMount(){
    this._panResponder = {}
    this._previousLeft = 0
    this._previousTop = 0
    this._circleStyles = {}
    this._cardStyles = {translateX:0, translateY:0}
    this._handle = ''
    this.card = null // : ? { setNativeProps(props: Object): void } )

    this.props.isTopCard && this.initializePanResponder()
  }
  componentDidMount(){
    this._updatePosition();
  }
  componentWillUpdate(nextProps,nextState){
    if(nextProps.isTopCard && !this.props.isTopCard){

      // console.log('ANIMATE NEW CARD');
      // LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
    }
  }
  componentDidUpdate(prevProps,prevState){
    if(this.props.isTopCard && !prevProps.isTopCard){
      this.initializePanResponder()
    }
  }
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
  //
  // _highlight() {
  //   var nativeProps = precomputeStyle({
  //     shadowOpacity: 100,
  //     shadowRadius:   15,
  //     shadowOffset: {width:0, height: 10},
  //   });
  //
  //   this.card && this.card.setNativeProps(nativeProps)
  //
  // }
  //
  // _unHighlight() {
  //   var nativeProps = precomputeStyle({
  //     shadowOpacity: 50,
  //     shadowRadius: 5,
  //     shadowOffset: {width:0, height: 0},
  //     transform: [{scale: 1}]
  //   });
  //   this.card && this.card.setNativeProps(nativeProps);
  // }

  _updatePosition(tweenFrame) {
    const positionData = tweenFrame ? tweenFrame : this._cardStyles

    // start scaling immediately, keep scaling until 3/4 throw threshold is reach
    var newScale = Math.abs(positionData.translateX) > THROW_OUT_THRESHOLD * 0.75 ? 1.05 : 1 + (Math.abs(positionData.translateX) * 0.00025) // this is a magic number i pulled out of my ass

    // start rotating after translateX hits three quarter of throw threshold.
    var newRotate = Math.abs(positionData.translateX) < THROW_OUT_THRESHOLD * 0.75 ? 0 : Math.abs(positionData.translateX) - THROW_OUT_THRESHOLD * 0.75
    newRotate = (positionData.translateX > 0 ? newRotate : newRotate * -1) / 10 + 'deg'

    // start increasing shadow radius
    var newShadow = Math.abs(positionData.translateX) < THROW_OUT_THRESHOLD / 2 ? 5 : parseInt(Math.abs(positionData.translateX) - THROW_OUT_THRESHOLD / 2, 0)
    newShadow = newShadow > 30 ? 30 : newShadow
    // console.log(newShadow,'shadow')

    var newPos = {
      transform: [
        {translateX:  parseFloat(positionData.translateX.toFixed(2))},
        // {translateY:  parseFloat(positionData.translateY.toFixed(2))},
        {scale: parseFloat(newScale.toFixed(2))},
        {rotate: newRotate}
      ],
      shadowRadius: newShadow,

    }

    this.card && this.card.setNativeProps(precomputeStyle(newPos))
    // https://facebook.github.io/react-native/docs/direct-manipulation.html#precomputing-style
  }

  _handleStartShouldSetPanResponder = (e: Object, gestureState: Object) => {
    console.log('_handleStartShouldSetPanResponder',gestureState.dx,gestureState.moveX)

    // Should we become active when the user presses down on the card?
    if(Math.abs(gestureState.dx) < 1){
      if(this.state.waitingForDoubleTap){
        console.log('double tap');
        this._handleDoubleTap();
        return false

      }else{
        this.setState({waitingForDoubleTap:true})
        this.setTimeout(()=>{
          if(this.state.waitingForDoubleTap){
            this.setState({waitingForDoubleTap:false})
          }
        },200)

      }
    }
    // return Math.abs(gestureState.dy) < Math.abs(gestureState.dx) || Math.abs(gestureState.dx) > 1 && Math.abs(gestureState.dy) < 15
    // return Math.abs(gestureState.dx) > 0
    return Math.abs(gestureState.dy) * 2 < Math.abs(gestureState.dx)

  }

  _handleMoveShouldSetPanResponder = (e: Object, gestureState) => {
    console.log('_handleMoveShouldSetPanResponder',gestureState.dx,gestureState,e)
    // if(this.state.isDragging == true) return false;


    //TODO: correctly determine velocity to determine if gesture was a throw
    // if(Math.abs(gestureState.vx*10000000) > 5){
    //   return true;
    // }else{
    // return Math.abs(gestureState.dy) < Math.abs(gestureState.dx) || Math.abs(gestureState.dx) > 1 && Math.abs(gestureState.dy) < 15
    // return Math.abs(gestureState.dx) > 0
      return Math.abs(gestureState.dy) * 2 < Math.abs(gestureState.dx)
    // }
  }

  _handlePanResponderGrant = (e: Object, gestureState: Object) => {
    console.log('Pan Responder Grant',gestureState.dx,gestureState.moveX)
    // this.clearTimeout(this.x);
    // if(gestureState.dx > 0){
      this.setState({
        isDragging: true
      })

    // }
  }
  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    console.log('Pan Responder MOVE',gestureState.dx,gestureState)

    this._cardStyles = {
      translateX: gestureState.dx,
      translateY: 0
    };
    this._updatePosition();

  }
  _handlePanResponderEnd = (e: Object, gestureState: Object) => {

    this.setState({
      isDragging: false
    })
    // this._unHighlight();
    console.log('Pan Responder End',Math.abs(gestureState.dx))

    Math.abs(gestureState.dx) > THROW_OUT_THRESHOLD ? this._throwOutCard(gestureState) : this._resetCard(gestureState)

  }
  _throwOutCard(gestureState){
    var self = this;

    console.debug('throwout',self.props.potential,self.props.potential.user.id)


    const likeStatus = gestureState.dx > 0 ? 'approve' : 'deny';
    const likeUserId = this.props.potential.user.id;


        this.setState({
          isAnimating: true
        })

    var animation = new RNTAnimation({
      start: {
        translateY: 0,
        translateX: self._cardStyles.translateX
      },
      end: {
        translateY: 0,
        translateX: (likeStatus === 'approve' ? DeviceWidth * 2 : -DeviceWidth * 2)
      },
      duration: 500,
      tween: 'easeOutBack',
      frame: (tweenFrame) => self._updatePosition( tweenFrame ),
      // TODO: like goes to couple id instead of user (initiator of couple) id?
      done: () => MatchActions.sendLike(likeUserId,likeStatus)
    });

  }
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
      duration: Math.abs(self._cardStyles.translateX) * 1.5,

      // Tween function
      tween: 'easeOutBack',

      // Update the component's state each frame
      frame: (tweenFrame) => {
        self._updatePosition( tweenFrame );
      },

      done: () => {
        self.setState({ isAnimating:false })
      }
    });
  }

  render() {

    return (

      <View style={

          {
          alignSelf:'center',
          width:(DeviceWidth - (this.state.profileVisible ? 0 : 40)),
          height:(DeviceHeight - (this.state.profileVisible ? 0 : 85)),
          // bottom:(35),
          left:this.state.profileVisible ? 0 : 20,
          right:this.state.profileVisible ? 0 : 20,
          top: (this.state.profileVisible ? 0 : 55),
          flex:1,
          shadowColor:colors.darkShadow,
          shadowRadius:5,
          position:'absolute',
          shadowOpacity:50,
          shadowOffset: {
              width:0,
              height: 5
          }
        }

      }
      key={`${this.props.potential.id}-wrapper`}
        ref={(card) => { this.card = card }}
        {...this._panResponder.panHandlers}>


        <CoupleActiveCard
          isTopCard={this.props.isTopCard}
          profileVisible={this.state.profileVisible}
          hideProfile={this._hideProfile}
          showProfile={this._showProfile.bind(this)}
          potential={this.props.potential} />

        </View>
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




class CoupleActiveCard extends React.Component{
  constructor(props){
    super()

    this.displayName = 'CoupleInsideActiveCard'

  }
  componentDidUpdate(prevProps,prevState) {
    // if(prevProps.profileVisible != this.props.profileVisible) LayoutAnimation.spring()
    //  LayoutAnimation.configureNext(animations.layout.easeInEaseOut);

  }
  componentWillUpdate(nextProps){
    if(nextProps.isTopCard && !this.props.isTopCard){
      console.log('ANIMATE NEW CARD');

      LayoutAnimation.spring();
    }
    if(nextProps.profileVisible !== this.props.profileVisible){
      LayoutAnimation.spring()
    }
  }
  render(){

    return (
      <View ref={'cardinside'} key={`${this.props.potential.id}-inside`} style={

        [styles.card,{
          overflow: this.props.profileVisible ? 'visible' : 'hidden',
          marginBottom:this.props.isTopCard ? 0 : -25,
          height: this.props.profileVisible ? DeviceHeight : undefined,
          position:'relative',
          transform:[
            {scale:this.props.isTopCard ? 1 : 0.95},

          ]
        }] }>

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
                height: this.props.profileVisible ? 300 : undefined,
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
                position: this.props.profileVisible ? undefined : 'absolute'
              }}
              >
              {this.props.profileVisible ?
                <View style={{
                  width: DeviceWidth - (this.props.profileVisible ? 0 : 40),
                  paddingVertical:20
                  }}>
                    <Text style={styles.cardBottomText}>{`${this.props.potential.user.firstname.trim()} and ${this.props.potential.partner.firstname.trim()}`}</Text>
                </View>

              : <TouchableHighlight underlayColor={colors.warmGrey} onPress={()=>{ this.props.showProfile()}} style={{ paddingTop:20 }}>
                  <Text style={styles.cardBottomText}>{`${this.props.potential.user.firstname.trim()} and ${this.props.potential.partner.firstname.trim()}`}</Text>
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
                <Image source={{uri: this.props.potential.user.image_url}} key={this.props.potential.user.id + 'img'} style={[styles.circleimage, {marginRight:5}]} />
                <Image source={{uri: this.props.potential.partner.image_url}} key={this.props.potential.partner.id + 'img'} style={styles.circleimage}/>
              </View>
              { this.props.profileVisible &&
                <View style={{height:undefined,width: DeviceWidth, padding:20}}>
                  <View  style={{position:'absolute',top:0,left:0,width: 50, height: 50}}>
                    <TouchableHighlight  onPress={this.props.hideProfile}>
                      <Text>Close</Text>
                    </TouchableHighlight>
                  </View>
                  <View>
                    <Text>TEXT</Text>
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

//
// var CoupleProfile =React.createClass({
//
//   render(){
//
//       return(
//         <View style={[styles.card,{width: DeviceWidth}]} key={this.props.potential.id+'view'}>
//           {/**/}
//           <Swiper
//             _key={this.props.potential.id+'swiper'}
//             style={[styles.wrapper]}
//             loop={true}
//             horizontal={false}
//             vertical={true}
//             showsPagination={true}
//             showsButtons={false}
//             dot={ <View style={styles.dot} />}
//             activeDot={ <View style={styles.activeDot} /> }>
//             <Image source={{uri: this.props.potential.image_url}} key={this.props.potential.id+'cimg'} style={[styles.imagebg,{width: DeviceWidth}]} />
//             <Image source={{uri: this.props.potential[1].image_url}} key={this.props.potential[1].id+'cimg'} style={[styles.imagebg,{width: DeviceWidth}]} />
//           </Swiper>
//
//           <View key={this.props.potential.id+'bottomview'}  style={{backgroundColor:colors.white,width: DeviceWidth, alignSelf:'stretch'}}>
//             <Text style={styles.cardBottomText}>{`${this.props.potential.firstname} and ${this.props.potential[1].firstname}`}</Text>
//
//             <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
//               <Image source={{uri: this.props.potential.image_url}} style={[styles.circleimage,{marginRight:5}]}/>
//               <Image source={{uri: this.props.potential[1].image_url}} style={styles.circleimage}/>
//             </View>
//             <TouchableHighlight  onPress={this.props.hideProfile}>
//               <Text>Close</Text>
//             </TouchableHighlight>
//             <View style={{height:360,padding:20}}>
//               <Text>TEXT</Text>
//             </View>
//
//           </View>
//
//       </View>
//
//       )
//
//   }
// })
//
//
// class CoupleInactiveCard extends React.Component{
//   constructor(props){
//     super(props)
//   }
//   render(){
//       return(
//         <View key={this.props.potential.id+'wrapper'} style={[styles.basicCard,{margin:30,marginTop:75,position:'absolute',width: DeviceWidth-60,height:DeviceHeight-100}]}>
//           <Image source={{uri: this.props.potential.image_url}} key={this.props.potential.id+'cimg'} style={[styles.imagebg,{width: DeviceWidth-60}]} />
//           <View style={{height:70,bottom:0,position:'absolute',width: DeviceWidth-60,backgroundColor:colors.white, flex:5, alignSelf:'stretch'}}>
//             <Text style={styles.cardBottomText}>{`${this.props.potential.firstname} and ${this.props.potential[1].firstname}`}</Text>
//
//             <View style={{height:60,top:-30,position:'absolute',width:135,right:0,backgroundColor:'transparent',flexDirection:'row'}}>
//               <Image source={{uri: this.props.potential.image_url}} style={[styles.circleimage,{marginRight:5}]}/>
//               <Image source={{uri: this.props.potential[1].image_url}} style={styles.circleimage}/>
//             </View>
//
//           </View>
//         </View>
//       )
//   }
// }

class DummyCard extends React.Component{
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

// stub
class CardStack extends React.Component{
  constructor(props){

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
                <ActiveCard key={`${this.props.potentials[1].id}-activecard`} user={this.props.user} potential={this.props.potentials[1]} isTopCard={false}/>

              /*
                <View style={{shadowColor:colors.darkShadow,shadowRadius:5,shadowOffset:{width:0,height:5},shadowOpacity:50}}>
                  <CoupleInactiveCard  user={this.props.user} potential={this.props.potentials[1]} />
                </View>
              */
              }
              {this.props.potentials[0] &&
                <ActiveCard key={`${this.props.potentials[0].id}-activecard`} user={this.props.user} potential={this.props.potentials[0]} isTopCard={true}/>
              }
            </View>
        )
      }else{
         return (
          <View user={this.props.user} >
            <TouchableHighlight onPress={() => MatchActions.getPotentials()}>
              <View style={{padding:50}}>
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
    super()
  }
  render(){
    return (
      <AltContainer stores={{
          potentials(props) { return { store: PotentialsStore, value: PotentialsStore.getAll() }}
      }}>
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
