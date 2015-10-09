var React = require('react-native')
var {PanResponder, TouchableHighlight, StyleSheet, Text, View, Animated, Dimensions, StyleSheet} = React

var DeviceWidth = Dimensions.get('window').width
var DeviceHeight = Dimensions.get('window').height
import colors from '../utils/colors'
// var styles = require('./styles.js')

var SwipeoutBtn = React.createClass({
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
    var btn = this.props


    return  (

        <Animated.View style={{transform:[
            {scale:this.props.offsetX.interpolate({
              inputRange:   [-300, -100, -25, 0, 25, 100, 300],
              outputRange:  [1.9, 1.3, 0, 0.1, 0, 1, 1.2],
              extrapolate:'clamp'
            })},
            {rotate:'0deg'}
          ]}}>
          {btn.component ?
            <View style={{
              height: btn.height,
              width: btn.width,
            }}>{btn.component}</View>
          : <Text style={styles.swipeoutBtnText}>{btn.text}</Text>
          }
        </Animated.View>
    )
  }
})

var Swipeout = React.createClass({
  getDefaultProps() {
    return {
      onOpen: (sectionID, rowID) => {console.log('onOpen: '+sectionID+' '+rowID)},
      rowID: -1,
      sectionID: -1,
    }
  },
  getInitialState() {
    return {
      autoClose: this.props.autoClose || false,
      btnWidth: DeviceWidth/5,
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
    var width = DeviceWidth,
    height = 100;
    // this.refs.swipeoutContent.measure((ox, oy, width, height) => {
      this.setState({
        btnWidth: (width/5),
        btnsLeftWidth: this.props.left ? (width/5)*this.props.left.length : 0,
        btnsRightWidth: this.props.right ? (width/5)*this.props.right.length : 0,
        contentHeight: height,
        contentWidth: width,
      })
    // })
    this.initializePanResponder()

  },
  componentWillReceiveProps(nextProps) {
    nextProps.close && this._close()
  },



  initializePanResponder(){
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e,gestureState) => Math.abs(gestureState.dy) < 5,
      onStartShouldSetPanResponder: (e,gestureState) => false,
      onPanResponderGrant: () => { this.props.scroll(false)},
      onPanResponderStart: () => { this.props.onOpen(this.props.sectionID, this.props.rowID)},
      onPanResponderMove: Animated.event( [null, {dx: this.state.offsetX}] ),
      onStartShouldSetPanResponderCapture:(e,gestureState) =>  false,
      onMoveShouldSetPanResponderCapture:(e,gestureState) =>  Math.abs(gestureState.dy) < 5,
      onPanResponderTerminationRequest:(e,gestureState) => false,
      onPanResponderEnd: (e, gestureState) => {
        var {contentWidth,btnsLeftWidth,btnsRightWidth} = this.state
        var offsetX = gestureState.dx
        var posY = gestureState.dy
        //  minimum threshold to open swipeout
        var openX = 100

        //  should activate swipeout action
        var openLeft = offsetX > openX
        var openRight = offsetX < -openX



        var toValue = 0

        Animated.spring(this.state.offsetX, {
          toValue,
          velocity: gestureState.vx,
        }).start(()=> this.props.scroll(true));

      }
    })
  },



  //  close swipeout on button press,
  _autoClose: function(btn) {
    var onPress = btn.onPress
    onPress && onPress()
    this.state.autoClose && this._close()
  },
  _close: function() {
    Animated.timing(this.state.offsetX, {
      toValue:0,
      duration: 150,
    }).start(()=> this.props.scroll(true));

    this.setState({
      openedRight: false,
      openedLeft: false,
    })
  },
  render(){
    var contentWidth = this.state.contentWidth
    var offsetX = this.state.offsetX


    return (
      <View style={{position:'relative',width:DeviceWidth,overflow:'hidden',backgroundColor:colors.dark}}>

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
                width: DeviceWidth/5,

            }]}>
            {
              this.props.left.map((btn, i) => {
                return (
                  <SwipeoutBtn
                  offsetX={this.state.offsetX}
                    backgroundColor={btn.backgroundColor}
                    color={btn.color}
                    component={btn.component}
                    height={100}
                    key={i}
                    onPress={() => this._autoClose(this.props.left[i])}
                    text={btn.text}
                    type={btn.type}
                    underlayColor={btn.underlayColor}
                    width={DeviceWidth/5}/>
                )
              })
            }
          </View>
        : <View/>}

        {this.props.right  ?
          <View style={[styles.swipeoutBtns, {
              right: 0,
              width: DeviceWidth/5,

            }]}>
            {
              this.props.right.map((btn, i) => {
                return (
                  <SwipeoutBtn
                  offsetX={this.state.offsetX}
                    backgroundColor={btn.backgroundColor}
                    color={btn.color}
                    component={btn.component}
                    height={100}
                    key={i}
                    onPress={() => this._autoClose(this.props.right[i])}
                    text={btn.text}
                    type={btn.type}
                    underlayColor={btn.underlayColor}
                    width={DeviceWidth/5}/>
                )
              })
            }
          </View>
        : <View/>}
        </View>

        <Animated.View
          style={[styles.swipeoutContent,{width:DeviceWidth,transform:[{translateX:offsetX}]}]}
          ref="swipeoutContent"  {...this._panResponder.panHandlers} >
          {this.props.children}
        </Animated.View>

      </View>
    )
  }
})

module.exports = Swipeout

var styles = StyleSheet.create({
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
