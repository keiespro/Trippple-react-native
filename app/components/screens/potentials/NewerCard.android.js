import React from 'react'
import { Text, View, StatusBar, ScrollView, Image, Animated, TouchableOpacity, Dimensions } from 'react-native'
import ActionMan from '../../../actions'
import styles from './styles'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import ParallaxSwiper from '../../controls/ParallaxSwiper'
import VerifiedCoupleBadge from '../../Badge/VerifiedCoupleBadge'
import {pure, onlyUpdateForKeys} from 'recompose'
import CityState from '../../CityState'
import CardLabel from '../../CardLabel'
import ApproveIcon from './ApproveIcon'
import DenyIcon from './DenyIcon'
import ParallaxView from '../../../parallax'
import Carousel from 'react-native-looped-carousel';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class NewerCard extends React.Component {
  constructor(props){
    super()
    this.state = {
      size: { width: props.width, height: props.height },
    };
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  renderProfileVisible(){

    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.gender ? true : false;
    const slideFrames = isTopCard && hasPartner ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;

    return (
      <View style={{width: DeviceWidth,}}>


        <ScrollView

          pointerEvents={'box-none'}
          automaticallyAdjustContentInsets={false}
          ref={component => { this._scrollView = component }}
          scrollEnabled={profileVisible}
          keyboardShouldPersistTaps
          showsVerticalScrollIndicator={false}
          horizontal={false}

          vertical

        >
        <Header {...this.props} size={{width: this.state.width, height: this.state.height,borderRadius:12, overflow:'hidden',}}/>
        <View style={{flexGrow: 1,backgroundColor: colors.outerSpace, width: this.state.width, alignItems: 'flex-start'}} >

        <View
          style={{
            marginVertical: 8,
            width: 40,
            height: 8,
            borderRadius: 15,
            alignSelf: 'center',
            backgroundColor: 'rgba(255,255,255,.2)',
            position: 'absolute',
            left: (DeviceWidth / 2) - 20
          }}
        />
        <View
          key={`blurkey${potential.user.id}`}
          style={{
            zIndex: 100,
            height: profileVisible ? this.state.height : 0,
            opacity: profileVisible ? 1 : 0,
            flexGrow: 1
          }}
        >

          <View style={{ paddingVertical: 40, width: DeviceWidth, flex: 10, marginTop: 0}}>

            <View style={{marginHorizontal: MagicNumbers.screenPadding / 2, marginBottom: 20}}>
              <CardLabel
                potential={potential}
                seperator={seperator}
                matchName={matchName}
                city={city}
                distance={distance}
                textColor={colors.white}
              />
              {verifiedCouple &&
                <VerifiedCoupleBadge
                  placementStyle={{position: 'relative', alignSelf: 'flex-start', left: 0, top: 0, marginTop: 20}}
                />
              }

            </View>

            {potential.user.bio && potential.user.bio.length ?
              <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth, flexDirection: 'column' }}>
                <Text
                  style={[styles.cardBottomOtherText, {
                    color: colors.white,
                    marginBottom: 15,
                    marginLeft: 0
                  }]}
                  >{ !hasPartner ? 'Looking for' : 'Looking for' }</Text>
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: 'omnes',
                    fontSize: 18,
                    marginBottom: 15
                  }}
                >{ potential.user.bio }</Text>
              </View> : null }

            {hasPartner && potential.partner.bio && potential.partner.bio.length ?
              <View
                style={{
                  margin: MagicNumbers.screenPadding / 2,
                  width: MagicNumbers.screenWidth
                }}
              >
                <Text style={{ fontFamily: 'omnes', color: colors.white, fontSize: 18, marginBottom: 15 }}>
                  {potential.partner.bio}
                </Text>
              </View> : null
                            }

            <UserDetails
              potential={potential}
              user={this.props.user}
              location={'card'}
            />
            <TouchableOpacity onPress={this.props.reportModal}>
              <View style={{ marginTop: 20, paddingBottom: 50 }}>
                <Text style={{ fontFamily: 'omnes', color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 50, zIndex: 9999, alignItems: 'center', width: 50, justifyContent: 'center', flex: 0, alignSelf: 'center',
              }}
              onPress={() => this.props.toggleProfile ? this.props.toggleProfile() : this.props.navigator.pop()}
            >
              <Image
                resizeMode={Image.resizeMode.contain}
                style={{ height: 12, width: 12, marginTop: 10 }}
                source={require('./assets/close@3x.png')}
              />
            </TouchableOpacity>


          </View>

        </View>

      </View>
</ScrollView>
  </View>


    )
  }
  renderClosed(){
    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;
    const hasPartner = potential.partner && potential.partner.gender ? true : false;
    const verifiedCouple = hasPartner && potential.couple.verified;
    const slideFrames =  potential.partner ? [potential.user, potential.partner] : [potential.user];


    return (
      <Image source={{uri: potential.user.image_url}} style={{height: DeviceHeight-60,width:cardWidth}}>

                <View
                  pointerEvents={'box-none'}

                  style={{
                    width: cardWidth,
                    height: 100,
                    opacity: profileVisible ? 0 : 1,
                    alignSelf: 'flex-end',
                    zIndex: 10,
                    backgroundColor: colors.white,
                    borderBottomLeftRadius: 11,
                    borderBottomRightRadius: 11,
                    position: 'absolute',

                    top: profileVisible ? -200 : DeviceHeight - 120,
                  }}
                >
                  <TouchableOpacity
                    onPress={this.props.toggleProfile}
                    pointerEvents={'box-only'}
                  >
                    <View

                      style={{
                        borderBottomLeftRadius: 11,
                        borderBottomRightRadius: 11,
                        padding: 20,
                        height: 100,

                      }}
                    >
                      <CardLabel
                        potential={potential}
                        seperator={seperator}
                        matchName={matchName}
                        city={city}
                        distance={distance}
                        textColor={colors.shuttleGray}
                      />
                      {verifiedCouple && <VerifiedCoupleBadge placementStyle={{position: 'absolute', alignSelf: 'flex-start', right: 15, top: 63}}/>}
                    </View>
                  </TouchableOpacity>
                </View>

      </Image>

    )
  }
  render() {


    return (
      <View style={{backgroundColor:'transparent',flexGrow:1}}>
          <View>
            {this.props.profileVisible ? this.renderProfileVisible() : this.renderClosed()}
          </View>
      </View>


    )
  }


}


class Header extends React.Component {

    render() {
      const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;
      const hasPartner = potential.partner && potential.partner.gender ? true : false;
      const verifiedCouple = hasPartner && potential.couple.verified;
      const slideFrames =  potential.partner ? [potential.user, potential.partner] : [potential.user];
      const size = {width: cardWidth,height: DeviceHeight-200 }
      return (
        <View style={{ flexGrow: 1,backgroundColor: 'transparent' }} onLayout={this._onLayoutDidChange}>
          <Carousel
            delay={2000}
            style={[{backgroundColor:'transparent'},size]}
            autoplay
            pageInfo
            onAnimateNextPage={(p) => __DEV__ && console.log(p)}
          >
            {slideFrames.map((slide,i) => <Image
              key={`slide${i}`}
              style={size}
              source={slide.image_url ? {uri: slide.image_url } : {uri:null}}
            />)}
          </Carousel>
        </View>
      );
    }
  }

export default NewerCard;
