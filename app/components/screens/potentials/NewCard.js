import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from "react";

import UserDetails from '../../UserDetails';

import {BlurView} from 'react-native-blur'
import Swiper from '../../controls/swiper';
import colors from '../../../utils/colors';
import styles from './styles'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import ParallaxSwiper from  '../../controls/ParallaxSwiper'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const CardLabel = (props) => (
  <View>
    <Text
      style={[styles.cardBottomText, {color:props.textColor}]}
      key={`${props.potential.user.id}-names`}
    >{ props.matchName }
    </Text>
    <Text
      style={[styles.cardBottomOtherText, {color:props.textColor}]}
      key={`${props.potential.user.id}-matchn`}
    >{
        props.city + props.seperator + (props.distance ? ` ${props.distance} ${props.distance == 1 ? 'mile' : 'miles'} away` : ``)
    }</Text>
  </View>
);


class NewCard extends React.Component {
  render(){
    const {profileVisible, cardWidth, cardHeight, city, seperator, potential, activeIndex, user, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.image_url && potential.partner.image_url !== "";
    const slideFrames = hasPartner ? [potential.user,potential.partner] : [potential.user]
    const tmpCardHeight = profileVisible ? cardHeight : cardHeight;
    const slides = slideFrames.map((p,i) => {
      return (
        <View
          key={`${p.id}slide${i}`}
          style={{backgroundColor:'red',flex:1,position:'relative',height:tmpCardHeight,width:cardWidth}}
        >
          <Image
            onLayout={(e)=>console.log(e.nativeEvent.layout,'LAYOUT')}
            source={{uri: p.image_url }}
            resizeMode="cover"
            style={{flex:1,height:tmpCardHeight,width:cardWidth}}
          />
      </View>
      )
    });

    return (
      <View>

        <ParallaxSwiper
          contentContainerStyle={[{height: profileVisible ? DeviceHeight : cardHeight,flexDirection:'column',alignItems:'flex-end',flex:1,width:cardWidth}]}
          scrollEnabled={profileVisible ? true : false}
          showsVerticalScrollIndicator={false}
          style={[{flex:10,height:(DeviceHeight*2)}]}
          header={<View/>}
          windowHeight={100}
          swiper={(
            <Swiper
              width={cardWidth}
              height={DeviceHeight}
              style={{flex:0,zIndex:0,backgroundColor:'yellow',top:0}}>
             {slides}
           </Swiper>
          )}
        >

          <BlurView  key={'blurkey'+potential.user.id} blurType="dark" style={{
            backgroundColor:colors.outerSpace20,
            position:'relative',
            zIndex:100,
            height: profileVisible ? (DeviceHeight*2)-200 : 0,
            opacity: profileVisible ? 1 : 0, overflow:'hidden',
            flex:0,
            bottom:0,
            alignSelf:'flex-end',
            width: DeviceWidth,
            marginTop:-100,
          }}
          >
            <View pointerEvents={'box-only'} style={{ paddingVertical: 20, width: DeviceWidth,flex: 1,}}>
              <View style={{marginHorizontal:MagicNumbers.screenPadding/2,marginBottom:20}}>
                <CardLabel
                  potential={potential}
                  seperator={seperator}
                  matchName={matchName}
                  city={city}
                  distance={distance}
                  textColor={colors.white}
                />
              </View>
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
          </BlurView>

          {!profileVisible &&
            <TouchableHighlight
              style={{width:cardWidth,height:100,alignSelf:'flex-end',zIndex:10,flex:-1,position:'absolute',bottom:120}}
              underlayColor={colors.mediumPurple20}
              onPress={this.props.openProfileFromImage}
            >
              <View style={{width:cardWidth,height:100,flex:1}}>
                <BlurView key={'blurkey'+potential.user.id}
                  blurType="xlight"
                  style={{backgroundColor:colors.white20,width:cardWidth,height:100,padding:20}}
                >
                  <CardLabel
                    potential={potential}
                    seperator={seperator}
                    matchName={matchName}
                    city={city}
                    distance={distance}
                    textColor={colors.shuttleGray}
                  />
                </BlurView>
              </View>
            </TouchableHighlight>
          }
      </ParallaxSwiper>
    </View>
    )
  }
}

export default NewCard;
