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
import {MagicNumbers} from './DeviceConfig';


//
//
// var TAB_UNDERLINE_REF = 'TAB_UNDERLINE';
//
//
// var CustomTabBar = React.createClass({
//   propTypes: {
//     goToPage: React.PropTypes.func,
//     activeTab: React.PropTypes.object,
//     tabs: React.PropTypes.array,
//     pageNumber:React.PropTypes.number
//   },
//
//   renderTabOption(name, page) {
//     var isTabActive = this.props.pageNumber === page;
//
//     return (
//       <TouchableOpacity key={name} onPress={() => {this.props.goToPage(page)}}>
//         <View style={[styles.tab]}>
//           <Text style={{fontFamily:'Montserrat',fontSize:15,padding:5,color: isTabActive ? colors.white : colors.shuttleGray}}>{name}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   },
//
//   render() {
//     var numberOfTabs = this.props.tabs.length;
//     var w = DeviceWidth / numberOfTabs
//
//     var tabUnderlineStyle = {
//       position: 'absolute',
//       width: DeviceWidth / numberOfTabs,
//       height: 2,
//       backgroundColor: colors.mediumPurple,
//       bottom: 0,
//       left:0,
//       transform: [
//         {
//           translateX: this.props.activeTab ? this.props.activeTab.interpolate({
//               inputRange: this.props.tabs.map((c,i) => (w * i) ),
//               outputRange: [0,w,(w * 2)]
//             }) : 0
//           }]
//
//     };
//
//     return (
//       <View style={styles.tabs}>
//         {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
//         <Animated.View style={tabUnderlineStyle} ref={TAB_UNDERLINE_REF} />
//       </View>
//     );
//   },
// });
//

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

  goToPage(pageNumber) {
    this.state.pageNumber !== pageNumber && this.props.onChangeTab &&
      this.props.onChangeTab({i: pageNumber, ref: this.props.children[pageNumber]});
      var w = MagicNumbers.screenWidth / this.props.children.length

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
    var w = MagicNumbers.screenWidth / this.props.children.length
    var sceneContainerStyle = {
      width: MagicNumbers.screenWidth * this.props.children.length,
      flex: 1,
      left:0,
      // paddingHorizontal:MagicNumbers.screenPadding/2,
      flexDirection: 'row',
      overflow:'hidden',
      transform:[
        {translateX:this.state.currentPage ? this.state.currentPage.interpolate({
                inputRange: this.props.children.map((c,i) => w * i ),
                outputRange: this.props.children.map((c,i) => MagicNumbers.screenWidth * -i),
              }) : 0
        }
      ]

    };

    return (
      <View style={{flex: 1}}>
      {this.renderTabBar({
        goToPage: this.goToPage,
        tabs: this.props.children.map((child) => child.props.tabLabel),
        activeTab: this.state.currentPage,
        pageNumber: this.state.pageNumber,
        ref: TAB_BAR_REF
      })}

      <Animated.View
        style={[sceneContainerStyle,{ }]}
        ref={view => { this.scrollView = view; }}
        >
        {this.props.children}
        </Animated.View>
      </View>
    );
  }
});

module.exports = ScrollableTabView;
