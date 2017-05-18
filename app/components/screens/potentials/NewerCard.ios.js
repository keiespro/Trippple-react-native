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


@pure
@onlyUpdateForKeys(['pan', 'potential', 'profileVisible', 'isTopCard'])
class NewerCard extends React.Component {
  constructor(props){
    super()
    this.state = {
      size: { width: props.cardWidth, height: props.cardHeight },
    };
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    console.log(layout);
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  reportModal() {
    const {potential} = this.props;

    this.props.dispatch(ActionMan.showInModal({
      component: 'ReportModal',
      passProps: {
        action: 'report',
        potential
      }
    }))
  }

  renderProfileVisible(){

    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = !!(potential.partner && potential.partner.gender);
    const slideFrames = isTopCard && hasPartner ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;

    return (
      <View key={`outer${potential.user.id}`} style={{            backgroundColor: 'black',width: DeviceWidth, }}>


        <ScrollView>
          <Header
            {...this.props}
            size={{
              width: this.state.size.width,
              height: this.state.size.height - 160,
              borderRadius: 12,
              overflow: 'hidden',
            }}
            imgLoadedCallback={() => { this.setState({carouselImgLoaded: true}) }}
            carouselImgLoaded={this.state.carouselImgLoaded}
            closeProfile={() => {
              this.props.closeProfile ? this.props.closeProfile() : this.props.navigator.pop()
            }}
          />

          <View
            style={{
              flexGrow: 1,
              backgroundColor: colors.outerSpace,
              width: this.state.size.width,
              alignItems: 'flex-start',
              paddingBottom: 100
            }}
          >

            <View
              style={{
                marginVertical: 8,
                width: 40,
                height: 8,
                borderRadius: 15,
                alignSelf: 'center',
                overflow: 'hidden',
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
                    cacheCity={this.props.dispatch}
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

                <TouchableOpacity
                  onPress={this.reportModal.bind(this)}
                >
                  <View
                    style={{ marginTop: 20, paddingBottom: 50 }}
                  >
                    <Text
                      style={{ fontFamily: 'omnes', color: colors.mandy, textAlign: 'center' }}
                    >Report or Block this user</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: 50,
                    zIndex: 9999,
                    alignItems: 'center',
                    width: 50,
                    justifyContent: 'center',
                    flex: 0,
                    alignSelf: 'center',
                  }}
                  onPress={() => (this.props.toggleProfile ? this.props.toggleProfile() : this.props.navigator.pop())}
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
    const hasPartner = !!(potential.partner && potential.partner.gender);
    const verifiedCouple = hasPartner && potential.couple.verified;
    const slideFrames = potential.partner ? [potential.user, potential.partner] : [potential.user];


    return (
      <View key={`outer${potential.user.id}`}>
        <Image
          source={potential.user.image_url ? {uri: potential.user.image_url } : require('./assets/defaultuser.png')}
          style={{
            height: DeviceHeight,
            width: cardWidth,

          }}
          onLayout={e => console.log(e.nativeEvent.layout)}

          key={`card${potential.user.id}img`}

        >

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
              top: profileVisible ? -200 : DeviceHeight - 160,
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
                  cacheCity={this.props.dispatch}
                  potential={potential}
                  seperator={seperator}
                  matchName={matchName}
                  city={city}
                  distance={distance}
                  textColor={colors.shuttleGray}
                />
                {verifiedCouple && (
                  <VerifiedCoupleBadge
                    placementStyle={{
                      position: 'absolute',
                      alignSelf: 'flex-start',
                      right: 15,
                      top: 63
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>

        </Image>
      </View>
    )
  }
  render() {
    return (
      <View
        style={{
          flexGrow: 1,
          borderRadius: 12,
          overflow: 'hidden',
          top: this.props.profileVisible && !this.props.spacedTop ? -60 : 0,


        }}
      >
        <StatusBar
          hidden={this.props.profileVisible}
          animated
          backgroundColor={'#000'}
          barStyle="default"
          translucent
          showHideTransition={'slide'}
        />

        <View
          style={{
            borderRadius: 12,
            overflow: 'hidden'

          }}
        >
          <Image
            source={this.props.potential.user.image_url ? {uri: this.props.potential.user.image_url } : require('./assets/defaultuser.png')}
            style={{
              height: DeviceHeight,
              width: this.props.cardWidth,
              position:'absolute',
              top:0,
              opacity:  1,
              backgroundColor: colors.shuttleGray,


            }}
            pointerEvents="none"
            onLayout={e => console.log(e.nativeEvent.layout)}

            key={`cardbg${this.props.potential.user.id}img`}

          />
          {this.props.profileVisible ? this.renderProfileVisible() : this.renderClosed()}
        </View>
      </View>
    )
  }
}


const Header = ({cardWidth, potential, closeProfile, imgLoadedCallback, carouselImgLoaded}) => (
  <View
    style={{
      flexGrow: 1,
      backgroundColor: colors.shuttleGray,
      borderTopLeftRadius: 11,
      overflow: 'hidden',
      borderTopRightRadius: 11,

    }}
  >
    <TouchableOpacity
      style={{
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0,
        top: 0,
        left: 0,
        paddingVertical: 14,
        paddingHorizontal: 12,
        position: 'absolute'
      }}
      onPress={closeProfile}
    >
      <Image
        resizeMode={Image.resizeMode.contain}
        style={{
          height: 15,
          width: 15,
          marginTop: 0,
        }}
        source={require('./assets/close@3x.png')}
      />
    </TouchableOpacity>

    {(potential.partner && potential.partner.id != 'NONE' ? (
      <Carousel
        bullets
        delay={2000}
        style={{
            backgroundColor: 'transparent',
            width: cardWidth,
            height: DeviceHeight-200,
            zIndex: carouselImgLoaded ? 1 : -1,

        }}
        autoplay
        bulletStyle={{
            marginHorizontal: 5
        }}
        bulletsContainerStyle={{
            width: 100,
        }}
        chosenBulletStyle={{
            marginHorizontal: 5

        }}
        onAnimateNextPage={p => (__DEV__ && console.log(p))}
      >
        {(potential.partner && potential.partner.id != 'NONE' ? [potential.user, potential.partner] : [potential.user]).map((slide, i) => (
          <Image
            key={`slide${potential.user.id}img${i == 1 ? 'partner' : ''}`}
            style={{
                width: cardWidth,
                height: DeviceHeight
            }}
            onLoad={imgLoadedCallback}
            source={slide.image_url ? {uri: slide.image_url } : require('./assets/defaultuser.png')}
          />
        ))}
      </Carousel>
    ) : (
      <Image
        key={`card${potential.user.id}img`}
        pointerEvents={'none'}
        style={{
          width: cardWidth,
          height: DeviceHeight-200
        }}
        onLayout={e => console.log(e.nativeEvent.layout)}
        source={potential.user.image_url ? {uri: potential.user.image_url } : require('./assets/defaultuser.png')}
      />
    ))}

  </View>
);

export default NewerCard;
