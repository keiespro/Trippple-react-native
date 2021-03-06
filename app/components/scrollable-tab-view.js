'use strict';

import { Dimensions, View, Animated } from 'react-native';
import React from "react";

import DefaultTabBar from './controls/CustomTabBar'
const deviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
import {MagicNumbers} from '../utils/DeviceConfig';
import Analytics from '../utils/Analytics'


const TAB_BAR_REF = 'TAB_BAR';

const ScrollableTabView = React.createClass({
  getDefaultProps() {
    return {
      edgeHitWidth: 30,
      padded: true
    }
  },

  getInitialState() {
    var w = this.props.startPage ? (this.props.padded ? MagicNumbers.screenWidth : deviceWidth) / this.props.children.length : 0

    return {
      currentPage: new Animated.Value(w),
      width: this.props.padded ? MagicNumbers.screenWidth : deviceWidth,
      pageNumber:this.props.startPage || 0
    };


  },

  goToPage(pageNumber) {
    this.state.pageNumber !== pageNumber && this.props.onChangeTab &&
      this.props.onChangeTab({i: pageNumber, ref: this.props.children[pageNumber]});
      var w = this.state.width / this.props.children.length

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
    var w = this.state.width / this.props.children.length
    var sceneContainerStyle = {
      width: this.state.width * this.props.children.length,
      left:0,
      bottom:0,
      paddingBottom: 30,
      flexDirection: 'row',
      overflow:'hidden',
      transform:[
        {translateX:this.state.currentPage ? this.state.currentPage.interpolate({
                inputRange: this.props.children.map((c,i) => w * i ),
                outputRange: this.props.children.map((c,i) => this.state.width * -i),
              }) : 0
        }
      ]

    };

    return (
      <View style={{ }}>
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

export default ScrollableTabView;
