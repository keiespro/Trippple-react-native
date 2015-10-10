'use strict';

var React = require('react-native');
var {
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated
} = React;

var DefaultTabBar = require('./components/CustomTabBar');
var deviceWidth = Dimensions.get('window').width;

var TAB_BAR_REF = 'TAB_BAR';

var ScrollableTabView = React.createClass({
  getDefaultProps() {
    return {
      edgeHitWidth: 30,
    }
  },

  getInitialState() {
    return { currentPage: new Animated.Value(0), pageNumber:0 };
  },

  componentDidMount() {

  },

  // componentWillMount() {
    // Initialize the spring that will drive animations




    // this._scrollSpring.addListener({
    //   onSpringUpdate: () => {
    //     if (!this.scrollView) { return; }
    //
    //     var currentValue = this._scrollSpring.getCurrentValue();
    //     var offsetX = deviceWidth * currentValue;
    //
    //     this.scrollView.setNativeProps(precomputeStyle({
    //       transform: [{translateX: -1 * offsetX}],
    //     }));
    //
    //     // Pass the currentValue on to the tabBar component
    //     this.refs[TAB_BAR_REF].setAnimationValue(currentValue);
    //   },
    // });
    //
  //   this._panResponder = PanResponder.create({
  //     // Claim responder if it's a horizontal pan
  //     onMoveShouldSetPanResponder: (e, gestureState) => {
  //       if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
  //         if ((gestureState.moveX <= this.props.edgeHitWidth ||
  //             gestureState.moveX >= deviceWidth - this.props.edgeHitWidth) &&
  //               this.props.locked !== true) {
  //           if(this.props.hasTouch){
  //             this.props.hasTouch(true);
  //           }
  //
  //           return true;
  //         }
  //       }
  //     },
  //
  //     // Touch is released, scroll to the one that you're closest to
  //     onPanResponderRelease: (e, gestureState) => {
  //       var relativeGestureDistance = gestureState.dx / deviceWidth,
  //           lastPageIndex = this.props.children.length - 1,
  //           vx = gestureState.vx;
  //           console.log(relativeGestureDistance);
  //       this.goToPage(gestureState.dx,relativeGestureDistance);
  //     },
  //
  //     // Dragging, move the view with the touch
  //     onPanResponderMove: Animated.event( [null, {dx: this.state.currentPage } ])
  //
  //   });
  // },

  componentWillReceiveProps(nextProps) {

  },



  goToPage(pageNumber) {
    this.state.pageNumber !== pageNumber && this.props.onChangeTab &&
      this.props.onChangeTab({i: pageNumber, ref: this.props.children[pageNumber]});
      var w = deviceWidth / this.props.children.length

    Animated.spring(this.state.currentPage,{
      toValue: pageNumber*w,
      friction: 8,
      tension: 70,
    }).start()
    this.setState({pageNumber})
  },

  renderTabBar(props) {
    if (this.props.renderTabBar) {
      return  this.props.renderTabBar(props);
    } else {
      return <DefaultTabBar {...props} />;
    }
  },

  render() {
    var w = deviceWidth / this.props.children.length
    var sceneContainerStyle = {
      width: deviceWidth * this.props.children.length,
      flex: 1,
      left:0,
      flexDirection: 'row',
      transform:[
        {translateX:this.state.currentPage ? this.state.currentPage.interpolate({
                inputRange: this.props.children.map((c,i) => w * i ),
                outputRange: this.props.children.map((c,i) => deviceWidth * -i),
              }) : 0
        }
      ]

    };

    return (
      <View style={{flex: 1}}>
        {this.renderTabBar({goToPage: this.goToPage,
                            tabs: this.props.children.map((child) => child.props.tabLabel),
                            activeTab: this.state.currentPage,
                            pageNumber: this.state.pageNumber,
                            ref: TAB_BAR_REF})}

        <Animated.View style={sceneContainerStyle}
              ref={view => { this.scrollView = view; }}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
});

module.exports = ScrollableTabView;
