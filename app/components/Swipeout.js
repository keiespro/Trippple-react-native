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
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.swipeoutBtnTouchable}
        underlayColor={this.props.underlayColor}
      >
        <View  >
          {btn.component ?
            <View style={{
              height: btn.height,
              width: btn.width,
            }}>{btn.component}</View>
          : <Text style={styles.swipeoutBtnText}>{btn.text}</Text>
          }
        </View>
      </TouchableHighlight>
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
        var openX = 50

        //  should open swipeout
        var openLeft = offsetX > openX  ? 100 : 0
        var openRight = offsetX < -openX  ? -100 : 0

        //  account for open swipeouts
        if (this.state.openedRight){
          openRight = offsetX-openX < -openX
        }
        if (this.state.openedLeft){
          openLeft = offsetX+openX > openX
        }

        var toValue = openLeft || openRight || 0
        if(toValue != 0){
          this.setState({
            openedRight: toValue < 0,
            openedLeft: toValue > 0,
          })
        }else{
          this.setState({
            openedRight: false,
            openedLeft: false,
          })
        }
        Animated.timing(this.state.offsetX, {
          toValue,
          duration: 300,
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
      <View style={{position:'relative',width:DeviceWidth,overflow:'hidden',backgroundColor:'black'}}>

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
