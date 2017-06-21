import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import colors from '../../../utils/colors';
import { MagicNumbers } from '../../../utils/DeviceConfig';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const theslides = [
  {
    title: ' ',
    img: require('./assets/logo.png'),
    content: ' ',
  },
  {
    title: 'BROWSE',
    img: require('./assets/tour-browse.png'),
    content: 'Find like-minded Couples and Singles.',
  },
  {
    title: 'MATCH',
    img: require('./assets/tour-match.png'),
    content: 'If they like you too, we\'ll connect you.',
  },
  {
    title: 'CONNECT',
    img: require('./assets/tour-connect.png'),
    content: 'Chat with real Couples or Singles who share your interests.',
  },
  {
    title: 'PRIVATE & DISCREET',
    img: require('./assets/tour-privacy.png'),
    content: 'Protect your identity. Easily block friends and family.',
  },
];

class Carousel extends Component {

  constructor() {
    super();

    this.state = {
      index: 0,
      offset: 0,
      slides: theslides,
    };
  }

  handleScroll(e) {
    let off = e.nativeEvent.contentOffset.x;
    if (off % DeviceWidth > 0) return;
    if (off < this.state.offset) {
      if (off < 0) {
        off = e.nativeEvent.contentOffset.x + (DeviceWidth * 5);
      }
    } else if (off >= DeviceWidth * this.state.slides.length) {
      off = e.nativeEvent.contentOffset.x - (DeviceWidth * 5);
    }
    this.setState({
      index: parseInt(off / DeviceWidth),
      offset: off,
    });
  }

  render() {
    const { slides } = this.state;
    const l = slides.length;
    const welcomeSlides = [...slides, ...slides].map((slide, i) => (
      <View
        key={`${i}slide${i % l}`}
        style={[styles.slide]}
      >
        <Image
          defaultSource={slide.img}
          resizeMode={Image.resizeMode.contain}
          source={slide.img}
          style={{
            marginBottom: 25,
            marginTop: i % l == 0 ? 100 : 0,
            paddingTop: 0,
            width: i % l == 0 ? MagicNumbers.screenWidth + 50 : MagicNumbers.screenPadding * 4,
            height: MagicNumbers.is4s ? 150 : (DeviceHeight / 3) + MagicNumbers.screenPadding,
          }}
        />
        <View style={[styles.textwrap, {marginBottom: 5}]} >
          <Text
            style={[styles.textplain, {
              fontFamily: 'montserrat',
              fontSize: MagicNumbers.is4s ? 18 : 22,
              fontWeight: '800',
              marginTop: 15,
            }]}
          >
            {slide.title}
          </Text>
        </View>
        {slide.content && (
          <View style={styles.textwrap}>
            <Text
              style={[styles.textplain, {
                fontSize: MagicNumbers.is5orless ? 18 : 20,
              }]}
            >
              {slide.content}
            </Text>
          </View>
        )}
      </View>
    ));

    return (
      <View collapsable>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            alignSelf: 'stretch',
            justifyContent: 'center',
          }}
          contentOffset={{x: this.state.offset, y: 0}}
          grayDots
          horizontal
          onScroll={this.handleScroll.bind(this)}
          pagingEnabled
          removeClippedSubviews
          scrollEventThrottle={DeviceWidth * 5}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[styles.carousel, { height: DeviceHeight - 140}]}
        >
          {welcomeSlides}
        </ScrollView>

        <View
          pointerEvents="none"
          style={{
            alignItems: 'center',
            bottom: MagicNumbers.screenPadding,
            flexDirection: 'row',
            justifyContent: 'center',
            left: 0,
            right: 0,
            position: 'absolute',
          }}
        >
          {this.state.slides.map((s, i) => <View key={`${i}dots`} style={[styles.dot, this.state.index == i ? styles.activeDot : null]} />)}
        </View>
      </View>
    )
  }
}

Carousel.displayName = 'Carousel';

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.shuttleGray,
    borderColor: colors.shuttleGray,
    borderRadius: 6,
    borderWidth: 2,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
  },
  activeDot: {
    backgroundColor: colors.brightPurple,
    borderColor: colors.brightPurple,
    borderWidth: 2,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
  },
  textplain: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 22,
    fontFamily: 'omnes',
    textAlign: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 22,
  },
  carousel: {
    marginTop: 0,
    width: DeviceWidth,
  },
  slide: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: MagicNumbers.screenPadding / 2,
    width: DeviceWidth,
  },
  textwrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});

export default Carousel;
