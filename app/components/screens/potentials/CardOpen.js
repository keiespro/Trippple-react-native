import React from "react";

import { StyleSheet, Text, View, StatusBar, LayoutAnimation, Image, TouchableOpacity, TouchableHighlight, Animated, ScrollView, Dimensions } from "react-native";

import SliderTabBar from './SliderTabBar';
import animations from './LayoutAnimations';
import styles from './styles';
import ReportModal from '../../modals/ReportModal';

import ScrollableTabView from '../../scrollable-tab-view';

import colors from '../../../utils/colors';
import Swiper from 'react-native-swiper';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import { MagicNumbers } from '../../../utils/DeviceConfig';

import UserDetails from '../../UserDetails';
import reactMixin from 'react-mixin';

import Analytics from '../../../utils/Analytics';


import ActionMan from '../../../actions/';


class CardOpen extends React.Component {
  render(){
    const {potential} = this.props
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null];
    const hasPartner = potential.partner &&  potential.partner.id && potential.partner.id !== "NONE";

    if (hasPartner && potential.partner.firstname) {
      names.push(potential.partner.firstname.trim());
    }

    const { rel, profileVisible, isTopCard, pan } = this.props;
    let matchName = names[0];
    let distance = potential.user.distance;
    const city = potential.user.city_state || ``;

    const partnerDistance = hasPartner ? potential.partner.distance : null;
    if (hasPartner) {
      matchName = `${matchName} & ${names[1]}`;
      distance = Math.min(distance, partnerDistance || 0);
    }
    const seperator = distance && distance.length && city && city.length ? ' | ' : '';

    return (
        <View
          ref={'cardinside'}
          key={`${potential.user.id}-inside`}
          style={{
            backgroundColor: '#000',
            top: 0,
            position: 'absolute',
            right: 0,
            left: 0,
            alignItems: 'flex-start',
            height: DeviceHeight,
            alignSelf: 'stretch',

          }}
        >
          <StatusBar animated={true} barStyle="light-content" />
          <ScrollView
            style={{
              margin: 0,
              paddingTop: 0,
              top: 0,
              left: 0,
              backgroundColor: colors.dark,
              right: 0,
            }}
            canCancelContentTouches={true}
            horizontal={false}
            vertical={true}
            ref={'scrollbox'}
            contentContainerStyle={{
              borderRadius: 8,
              overflow: 'hidden',
            }}
            showsVerticalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            scrollEnabled={true}
            contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
            key={`${potential.user.id}-view`}
          >

            <Animated.View
              key={`${potential.user.id}bgopacity`}
              ref={"incard"}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                left: 0,
                right: 0,
                marginHorizontal: 0,
                flexDirection: 'column',
                position: 'relative', width: DeviceWidth
              }}
            >

              {hasPartner ?
                <Swiper
                  key={`${potential.user.id}-swiper`}
                  loop={true}
                  horizontal={true}
                  activeIndex={this.props.activeIndex}
                  vertical={false}
                  autoplay={false}
                  showsPagination={true}
                  showsButtons={false}
                  width={DeviceWidth}
                  height={DeviceHeight}
                  style={{ overflow: 'hidden' }}
                  paginationStyle={{ position: 'absolute', right: 10, bottom: 100, height: 100 }}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot, styles.activeDot]} />}
                >
                  <View
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg, {
                    }]}
                  >
                    <Animated.Image
                      source={ potential.user.image_url ? { uri: potential.user.image_url } : null}
                      key={`${potential.user.id}-cimg`}
                      style={[styles.imagebg, {
                        width: undefined,
                        opacity: this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -80, 0, 80, 300],
                          outputRange: [0, 1, 1, 1, 0],
                        }) : 1,
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                  </View>

                  {potential.partner.image_url && potential.partner.image_url != ""  && <View
                      pressRetentionOffset={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      key={`${potential.partner.id}-touchableimg`}
                      style={[styles.imagebg, { }]}
                    >
                      <Animated.Image
                        source={ potential.partner.image_url ? { uri: potential.partner.image_url } : null}
                        key={`${potential.partner.id}-cimg`}
                        style={[styles.imagebg, {
                          width: undefined,
                          opacity: this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0, 1, 1, 1, 0],
                          }) : 1,
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                    </View>
                  }

                  </Swiper> :
                  <View
                    style={{
                      alignSelf: 'center',
                      marginLeft: 0,
                      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      marginRight: 0,
                      left: 0, alignItems: 'stretch',
                    }}
                  >
                    <View
                      underlayColor={colors.mediumPurple}
                      pressRetentionOffset={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      key={`${potential.user.id}-touchableimg`}
                      style={[styles.imagebg, { overflow: 'hidden', width: DeviceWidth }]}
                      onPress={this.props.openProfileFromImage}
                    >
                      <Animated.Image
                        source={{ uri: potential.image_url || potential.image || potential.user.image_url }}
                        key={ `${potential.user.id}-cimg`}
                        style={[styles.imagebg, {
                          alignSelf: 'stretch', height: DeviceHeight,
                          width: DeviceWidth,
                          opacity: this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -80, 0, 80, 300],
                            outputRange: [0, 1, 1, 1, 0],
                          }) : 1,
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                    </View>
                  </View>
                }

                <View
                  key={`${potential.user.id}-bottomview`}
                  style={{
                    top: 0,
                    marginTop: (DeviceHeight <= 568 ? -120 : -120),
                    backgroundColor: colors.outerSpace,
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    left: 0,
                    right: 0,
                    marginLeft: 0,
                    width: DeviceWidth,
                    position: 'relative',
                  }}
                >
                  <TouchableHighlight
                    underlayColor={colors.outerSpace}
                    onPress={() => {}}
                  >
                    <View
                      key={'1k2'}
                      style={{ flexDirection: 'column', alignItems: 'center', width: DeviceWidth, justifyContent: 'center', position: 'relative' }}
                    >
                      <View
                        key={`${potential.user.id}-infos`}
                        style={{
                          width: DeviceWidth,
                          left: 0,
                          height: 180,
                          marginLeft: MagicNumbers.screenPadding,
                          paddingVertical: 20,
                        }}
                      >
                        <Text
                          key={`${potential.user.id}-names`}
                          style={[styles.cardBottomText, { color: colors.white }]}
                        >{this.props.matchName}</Text>
                        <Text
                          key={`${potential.user.id}-matchn`}
                          style={[styles.cardBottomOtherText, { color: colors.white }]}
                        >{
                            city + seperator + (distance && distance.length ? `${distance} ${distance == 1 ? 'mile' : 'miles'} away` : ``)
                        }</Text>
                      </View>

                    </View>
                  </TouchableHighlight>

                  <View
                    style={{
                      top: -50, flexDirection: 'column', alignItems: 'center', left: 0, justifyContent: 'center', backgroundColor: colors.outerSpace, width: DeviceWidth
                    }}
                  >

                    {potential.bio && potential.user.bio &&
                      <View style={{ margin: MagicNumbers.screenPadding / 2, width: DeviceWidth }}>
                        <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                            rel == 'single' ? `About Me` : `About Us`
                        }</Text>
                        <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                            potential.bio || potential.user.bio
                        }</Text>
                      </View>
                    }

                    <View style={{ paddingVertical: 20, width: DeviceWidth, alignItems: 'stretch' }}>
                      <UserDetails
                        potential={potential}
                        user={this.props.user}
                        location={'card'}
                      />
                    </View>

                    <TouchableOpacity onPress={this.props.reportModal}>
                      <View style={{ marginTop: 20, paddingBottom: 50 }}>
                        <Text style={{ color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flexDirection: 'column', height: 50, alignItems: 'center', width: 50, justifyContent: 'center' }}
                      onPress={this.props.closeProfile}
                    >
                      <Image
                        resizeMode={Image.resizeMode.contain}
                        style={{ height: 12, width: 12, marginTop: 10 }}
                        source={{ uri: 'assets/close@3x.png' }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </View>
        );
  }
}

export default CardOpen;
