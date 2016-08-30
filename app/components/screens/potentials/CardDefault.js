import { Text, View, Image, TouchableHighlight, Animated, ScrollView, Dimensions } from 'react-native';
import React from "react";
import Swiper from 'react-native-swiper';
import { MagicNumbers } from '../../../utils/DeviceConfig';
import ApproveIcon from './ApproveIcon';
import DenyIcon from './DenyIcon';
import colors from '../../../utils/colors';
import styles from './styles';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class CardDefault extends React.Component {
  render(){
    const {potential,cardWidth,cardHeight} = this.props
    const hasPartner = potential.partner && potential.partner.id && potential.partner.id !== "NONE";
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null];
    if (hasPartner) {
      names.push(potential.partner.firstname.trim());
    }
    console.log(potential,potential.partner);

    const { rel, isTopCard, pan } = this.props;
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
          style={[{
            height: cardHeight,
          }]}
        >

        <ScrollView
          scrollEnabled={false}
          ref={'scrollbox'}
          centerContent={false}
          alwaysBounceHorizontal={false}
          horizontal={true}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          canCancelContentTouches={false}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: cardHeight,
            left: 0,
            right: 0,
            width: cardWidth,
            overflow: 'hidden',
          }}
          contentOffset={{ x: 0, y: 0 }}
          style={[styles.card, {
            margin: 0,
            padding: 0,
            position: 'relative',
            width: cardWidth,
            backgroundColor: colors.white,
          }]}
          key={`${potential.user.id}-view`}
        >
          <Animated.View
            key={`${potential.user.id}bgopacity`}

            ref={isTopCard ? 'incard' : null}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              left: 0,
              right: 0,
              marginHorizontal: 0,
              flexDirection: 'column',
              position: 'relative',
              backgroundColor: isTopCard ? this.props.pan && this.props.pan.x.interpolate({
                inputRange: [-300, -80, -10, 0, 10, 80, 300],
                outputRange: [
                  'rgb(232,74,107)',
                  'rgb(232,74,107)',
                  'rgb(255,255,255)',
                  'rgb(255,255,255)',
                  'rgb(255,255,255)',
                  'rgb(66,181,125)',
                  'rgb(66,181,125)',
                ],
              }) : colors.white,
            }}
          >
            {hasPartner ?
              <Swiper
                  key={`${potential.user.id}-swiper`}
                  loop={true}
                  horizontal={true}
                  activeIndex={this.props.activeIndex}
                  vertical={false}
                  style={{
                    alignSelf: 'center',
                    marginLeft: 0,
                    height: undefined,
                    marginRight: 0,
                    left: 0,
                  }}
                  showsPagination={true}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot, styles.activeDot]} />}
                  paginationStyle={{ position: 'absolute', paddingRight: 30,
                    width:DeviceWidth-100,
                    right: 0, bottom: 0, height: 25 }}
                >

                <View
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg, { overflow: 'hidden', width:DeviceWidth-100, }]}
                >
                  <Animated.Image
                    source={ potential.user.image_url ? { uri: potential.user.image_url } : { uri: 'assets/defaultuser@3x.png' }}
                    key={`${potential.user.id}-cimg1`}
                    defaultSource={{ uri: 'assets/defaultuser@3x.png' }}
                    style={[styles.imagebg, {
                      backgroundColor: colors.white,
                      left: 0,
                      right: 0,
                      opacity: isTopCard && pan ? pan.x.interpolate({
                        inputRange: [-300, -80, 0, 80, 300],
                        outputRange: [0, 1, 1, 1, 0],
                      }) : 1,
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
                </View>

                {hasPartner &&  potential.partner.image_url != ""  && <View
                  key={`${potential.partner.id}-touchableimg`}
                  style={[styles.imagebg, { overflow: 'hidden' }]}
                >
                  <Animated.Image
                    source={ potential.partner.image_url ? { uri: potential.partner.image_url } : { uri: 'assets/defaultuser@3x.png' }}
                    key={`${potential.partner.id}-cimg2`}
                    defaultSource={{ uri: 'assets/defaultuser@3x.png' }}
                    style={[styles.imagebg, {
                      backgroundColor: colors.white,
                      left: 0,
                      right: 0,
                      opacity: isTopCard && pan ? pan.x.interpolate({
                        inputRange: [-300, -80, 0, 80, 300],
                        outputRange: [0, 1, 1, 1, 0],
                      }) : 1,
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
                </View>}

              </Swiper> :
              <View
                style={{
                  alignSelf: 'center',
                  marginLeft: 0,
                  height: undefined,
                  marginRight: 0,
                  left: 0,
                  alignItems: 'stretch',
                }}
              >
                <View
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg, {
                    height: DeviceHeight - 50,
                  }]}
                  onPress={this.props.openProfileFromImage}
                >
                  <Animated.Image
                    source={{ uri: potential.user.image_url }}
                    defaultSource={{ uri: 'assets/defaultuser@3x.png' }}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg, {
                      backgroundColor: colors.white,
                      width: DeviceWidth, height: DeviceHeight,
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
                height: 120 + MagicNumbers.screenPadding / 2,
                marginTop: isTopCard ? -20 : -20,
                marginLeft: 20,
                right: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
                backgroundColor: colors.white,
                width: DeviceWidth - MagicNumbers.screenPadding / 2,
                flexDirection: 'row',
                position: 'absolute',
                alignSelf: 'stretch', alignItems: 'stretch',
              }}
            >
              <TouchableHighlight
                underlayColor={colors.mediumPurple20}
                onPress={this.props.openProfileFromImage}
              >
                <View key={'1k2'} style={{ flexDirection: 'row' }}>
                  <View
                    key={`${potential.user.id}-infos`}
                    style={{
                      padding: isTopCard ? 15 : 15,
                      paddingTop: MagicNumbers.is4s ? 20 : 15,
                      paddingBottom: MagicNumbers.is4s ? 10 : 15,
                      height: 80,
                      width: cardWidth,
                      bottom: 0,
                      alignSelf: 'stretch',
                      flexDirection: 'column',
                      position: 'relative', top: 0,
                    }}
                  >
                    <Text
                      style={[styles.cardBottomText, {}]}
                      key={`${potential.user.id}-names`}
                    >{ matchName }
                    </Text>
                    <Text
                      style={[styles.cardBottomOtherText, {}]}
                      key={`${potential.user.id}-matchn`}
                    >{
                        (city) + seperator + (distance && distance.length ? `${distance} ${distance == 1 ? 'mile' : 'miles'} away` : ``)
                    }</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </Animated.View>

          {isTopCard ? <DenyIcon pan={this.props.pan}/> : null }

          {isTopCard ? <ApproveIcon pan={this.props.pan}/> : null }

        </ScrollView>
        <View
          key={'navbarholder'}
          style={{
            width: DeviceWidth,
            position: 'absolute',
            top: 150,
          }}
        />
      </View>

    )

  }
}

export default CardDefault;
