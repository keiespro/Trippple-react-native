import React from "react";
import {Text, View, TouchableOpacity, Dimensions, Animated} from "react-native";
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import styles from './styles'
import {MagicNumbers} from '../../../utils/DeviceConfig'

import colors from '../../../utils/colors';

var SliderTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.object,
    tabs: React.PropTypes.array,
    pageNumber:React.PropTypes.number
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.pageNumber === page;
    return (
      <TouchableOpacity key={name+page} onPress={() => this.props.goToPage(page)}>
      <View style={[styles.tab,]}>
          <Text
            style={{
              fontFamily:'Montserrat',
              fontSize:16,
              color: isTabActive ? colors.white : colors.shuttleGray}}
            >{
              name.toUpperCase()
            }</Text>
        </View>
      </TouchableOpacity>
    );
  },



  render() {
    var numberOfTabs = this.props.tabs.length;
    var w = MagicNumbers.screenWidth/ numberOfTabs;

    const tabUnderlineStyle = {
      position: 'absolute',
      width: MagicNumbers.screenWidth / 2,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left:0,
      transform:[
        {translateX: this.props.activeTab ? this.props.activeTab.interpolate({
                inputRange: this.props.tabs.map((c,i) => (w * i) ),
                outputRange: [0,w]
              }) : 0
            }]
    };

    return (
      <View style={[styles.tabs,{marginBottom:20}]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={'TAB_UNDERLINE_REF'} />
      </View>
    );
  },
});


export default SliderTabBar
