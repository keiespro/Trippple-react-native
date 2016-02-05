import React, {
  PanResponder,
  TouchableHighlight,
  Image,
  InteractionManager,
  Text,
  View,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native'

const DeviceWidth = Dimensions.get('window').width
const DeviceHeight = Dimensions.get('window').height
import colors from '../utils/colors'
import ThreeDots from '../buttons/ThreeDots'
const BTN_MAX = DeviceWidth/2
const BTNWIDTH = 100
const BTNTHRESHOLD = 150

const SwipeoutBtn = React.createClass({
  getDefaultProps: function() {
    return {
      backgroundColor: null,
      color: null,
      component: null,
      underlayColor: null,
      height: 0,
      key: null,
      onPress: null,
      text: 'Click me',
      type: '',
      width: 0,
    }
  },
  render: function() {
    var {btn,offsetX,width,height,isFavourited,rowData} = this.props,
        {isFavourited} = rowData,
        opacityOutputRange = [
          [ 0, 1, 1, 1 ],[1, 0, 0, 0]
        ],
        scaleOutputRange = [
           [ 1.5, 1.0, 0.5, 0.1],
           [ 1.5, 1.2, 1.2, 1.2],
         ];
    return  (
      <View style={{ height, width,
        alignSelf: btn.component ? 'flex-end': 'flex-start', flex:1 }}>
     {
                btn.component ?
                <View style={styles.swipeButtons}>
                  <View style={{height, width, alignItems:'center',top:0,left:0,bottom:0,position:'absolute',right:0, paddingVertical:30,backgroundColor: 'transparent'}}>
                    <Animated.Image
                      source={{uri: 'assets/iconDeny@3x.png'}}
                      resizeMode={Image.resizeMode.contain}

                      style={[ {
                        tintColor:offsetX.interpolate({
                          inputRange:  [-width,-60,0,50],
                          outputRange:['rgba(232,74,107,1.0)','rgba(232,74,107,0.2)','rgba(232,74,107,0.1)','rgba(232,74,107,0.0)']
                                      }),
                        width:30,height:30,
                       transform:[
                          {
                            translateX: offsetX.interpolate({
                                            inputRange:  [-width,-60,-50,50],
                                            outputRange: [-5,-10,-20, -20]
                                          }),
                            scale: offsetX.interpolate({
                              inputRange:  [-width,-60,-50,50],
                                              outputRange: [ 1.9, 1.25, 1.5,   1.5],
                            })
                          },
                        ]
                      }]}/></View>
                  </View> :
               <View style={[styles.swipeButtons,{
                 alignItems:'center',justifyContent:'center',width,height
               }]}>
               <Animated.View style={[ {
                  transform:[
                     {
                       scale: offsetX.interpolate({
                         inputRange:   [0.0,  25,  BTNWIDTH, BTNTHRESHOLD, 500],
                         outputRange:  [0,    0,   0.5,      1,          1.5  ],
                       })
                     },
                     {rotate:'0deg'}
                   ]
                 }]}><ThreeDots /></Animated.View></View>

           }
        </View>
    )
  }
})

const Swipeout = React.createClass({
  getDefaultProps() {
    return {
      onOpen: (sectionID, rowID) => { /* no op*/},
      rowID: -1,
      sectionID: -1,
    }
  },
  getInitialState() {
    return {
      autoClose: this.props.autoClose || false,
      btnWidth: BTNWIDTH,
      btnsLeftWidth: 0,
      btnsRightWidth: 0,
      contentHeight: 100,
      offsetX: new Animated.Value(0),
      contentWidth: DeviceWidth,
      openedLeft: false,
      openedRight: false,
      swiping: false,
    }
  },
  componentWillMount() {
    const width = DeviceWidth,
          height = 100;
    // this.refs.swipeoutContent.measure((ox, oy, width, height) => {
      this.setState({
        btnWidth: (BTNWIDTH),
        btnsLeftWidth: this.props.left ? 75 : 0,
        btnsRightWidth: this.props.right ? 75 : 0,
        contentHeight: height,
        contentWidth: width,
      })
    // })
    this.initializePanResponder()

  },
  // shouldComponentUpdate(nextProps,nextState){
  //   return nextProps.rowData.unreadCount ? true : false
  // },
  initializePanResponder(){

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e,gestureState) => Math.abs(gestureState.dy) < 5,
      onStartShouldSetPanResponder: (e,gestureState) => false,
      onPanResponderGrant: () => {
        this.props.scroll(false);

      },
      onPanResponderMove: Animated.event( [null, {
        dx: this.state.offsetX
      }] ),
      onStartShouldSetPanResponderCapture:(e,gestureState) =>  false,
      onMoveShouldSetPanResponderCapture:(e,gestureState) =>  Math.abs(gestureState.dy) < 5,
      onPanResponderEnd: (e, gestureState) => {

        const { contentWidth, btnsLeftWidth, btnsRightWidth} = this.state,
              { action } = gestureState.dx > 0 ? this.props.left[0] : this.props.right[0],
              toValue = 0;

        if(Math.abs(gestureState.dx) < BTNTHRESHOLD){

          Animated.spring(this.state.offsetX, {
            toValue,
            velocity: gestureState.vx,
            tension:90,
            friction: 3
          }).start(() => {
            this.props.scroll(true);
          }) // enable scrolling in parent scrollview when done

        }else{
          action()

          Animated.sequence([
            Animated.timing(this.state.offsetX,{
              toValue: gestureState.dx,
              duration:0
            }),
            Animated.delay( gestureState.dx > 0 ? 200 :  600 ),
            Animated.spring(this.state.offsetX, {
              toValue,
              friction:7,
              tension:85,
              velocity: gestureState.vx,
            })
          ]).start(()=>{

            // InteractionManager.runAfterInteractions(()=>{
              this.props.scroll(true);
            // });
          })
        }
      }
    })
  },

  render(){
    const { offsetX, contentWidth } = this.state,
          { rowData } = this.props;
    return (
      <Animated.View style={{
          position:'relative',
          width:DeviceWidth,
          overflow:'hidden',
          backgroundColor:   offsetX.interpolate({
            inputRange:   [-BTN_MAX,  -BTNWIDTH/2,   0,        BTNWIDTH/2,         BTN_MAX   ],
            outputRange:  [ colors.dark,colors.dark,colors.outerSpace,colors.dark, colors.dark,],
          })
        }}>
        <View
          style={{
            width:DeviceWidth,
            justifyContent:'space-between',
            flexDirection:'row',
            height:100,
            overflow:'hidden',
            position:'absolute',
            top:0,
            left:0,
            right:0
          }}>

        {this.props.left ?
          <View style={[styles.swipeoutBtns,{
                left: 0,
                overflow:'hidden',
                width: BTNWIDTH,

            }]}>
            {
              this.props.left.map((btn, i) => {
                return (
                  <SwipeoutBtn
                  offsetX={this.state.offsetX}
                    height={100}
                    rowData={rowData}
                    key={i}
                    text={btn.text}
                    type={btn.type}
                    btn={btn}
                    width={BTNWIDTH}
                    />
                )
              })
            }
          </View>
        : <View/>}

        {this.props.right  ?
          <View style={[styles.swipeoutBtns, {
              right: 0,
              width: BTNWIDTH,

            }]}>
            {
              this.props.right.map((btn, i) => {
                return (
                  <SwipeoutBtn
                    offsetX={this.state.offsetX}
                    backgroundColor={btn.backgroundColor}
                    color={btn.color}
                    rowData={rowData}
                    component={btn.component}
                    height={100}
                    key={i}
                    onPress={() => this._autoClose(this.props.right[i])}
                    text={btn.text}
                    btn={btn}
                    type={btn.type}
                    width={BTNWIDTH}/>
                )
              })
            }
          </View>
        : <View/>}
        </View>

        <Animated.View
          style={[styles.swipeoutContent,{width:DeviceWidth,transform:[{translateX:offsetX.interpolate({
            inputRange:   [-500,          -BTNWIDTH, 0, BTNWIDTH, 500         ],
            outputRange:  [-BTN_MAX, -BTNWIDTH, 0, BTNWIDTH, BTN_MAX],
          })}]}]}
          ref="swipeoutContent"  {...this._panResponder.panHandlers} >
          {this.props.children}
        </Animated.View>

      </Animated.View>
    )
  }
})

export default Swipeout

const styles = StyleSheet.create({
  swipeout: {
    backgroundColor: '#dbddde',
    flex: 1,
    overflow: 'hidden',
  },
  swipeoutBtnTouchable: {
    flex: 1,
    backgroundColor: colors.dark,

  },
  swipeoutBtn: {
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',

  },
  swipeoutBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
  swipeButtons:{
    width:75,
    height:100,
    position:'relative'
  },
  swipeoutBtns: {
    flex: 1,
    position:'absolute'
  },
  swipeoutContent: {
    flex: 1,
    backgroundColor: '#fb3d38',

    position:'relative'
  },
  colorDelete: {
    backgroundColor: '#fb3d38',
  },
  colorPrimary: {
    backgroundColor: '#006fff'
  },
  colorSecondary: {
    backgroundColor: '#fd9427'
  },
})





//
// <View style={styles.swipeButtons}>
//   <View style={{height, width,
//       alignItems:'center',top:0,left:0,bottom:0,position:'absolute',right:0, paddingVertical:40,backgroundColor: 'transparent'}}>
//      <Animated.Image
//        style={{
//          alignSelf:'center',
//         tintColor: colors.dandelion,
//         width:15,height:20,
//         transform:[
//           {
//             scale: offsetX.interpolate({
//               inputRange:   [-BTNTHRESHOLD, -BTNWIDTH, -25, 0.0],
//               outputRange: scaleOutputRange[~~isFavourited],
//             })
//           },
//           {rotate:'0deg'}
//         ],
//         opacity: offsetX.interpolate({
//           inputRange:   [-BTNTHRESHOLD, -BTNWIDTH, 0, BTNWIDTH],
//           outputRange:  opacityOutputRange[~~!isFavourited],
//          })
//        }}
//        source={{uri: 'assets/star@3x.png'}}
//        resizeMode={Image.resizeMode.contain}
//      />
//    </View>
//    <View style={{height, width,
//        alignItems:'center',top:0,left:0,bottom:0,position:'absolute',right:0, paddingVertical:40,backgroundColor:'transparent' }}>
//      <Animated.Image
//        style={{
//         alignSelf:'center',
//         width:15,height:20,
//         tintColor: isFavourited ? colors.dandelion   : 'transparent',
//         transform:[
//           {
//             scale: offsetX.interpolate({
//               inputRange:   [-BTNTHRESHOLD, -BTNWIDTH, -25, 0.0],
//               outputRange: scaleOutputRange[~~isFavourited],
//             })
//           },
//           {rotate:'0deg'}
//         ],
//
//         opacity: offsetX.interpolate({
//            inputRange:   [-BTNTHRESHOLD, -BTNWIDTH, 0, BTNWIDTH],
//            outputRange:  opacityOutputRange[~~isFavourited],
//        })
//          }}
//
//        source={{uri: 'assets/starOutline@3x.png'}}
//        resizeMode={Image.resizeMode.contain}
//      />
//    </View>
//  </View>
