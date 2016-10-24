import React from 'react'
import { Text, View, BackAndroid, Image, TouchableHighlight, Animated, TouchableOpacity, Dimensions } from 'react-native'
import ActionMan from '../../../actions'
import styles from './styles'
// import XButton from '../../buttons/XButton'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import ParallaxSwiper from '../../controls/ParallaxSwiper'
import VerifiedCoupleBadge from '../../Badge/VerifiedCoupleBadge'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const CardLabel = ({potential, city, textColor, matchName}) => (
  <View pointerEvents={'none'}>
    <Text
      style={[styles.cardBottomText, {color: textColor}]}
      key={`${potential.user.id}-names`}
    >{ matchName }</Text>
    <Text
      style={[styles.cardBottomOtherText, {color: textColor}]}
      key={`${potential.user.id}-matchn`}
    >{city}</Text>
  </View>
);


class NewCard extends React.Component {

  constructor() {
    super()
    this.state = {
      isOpen: new Animated.Value(100),
    }
  }

  componentWillReceiveProps(nProps) {
    if (this.props.profileVisible != nProps.profileVisible) {
      Animated.spring(this.state.isOpen, {
        toValue: nProps.profileVisible ? 0 : 100
      }).start()
    }

    if (!this.props.profileVisible && nProps.profileVisible) {
      BackAndroid.addEventListener('hardwareBackPress', e => this.handleBackFromOpenProfile(e))
    }
  }

  componentWillUnmount(){
    this.dontHandleBackFromOpenProfile()
  }

  onLayout(e) {
    const {layout} = e.nativeEvent

    if (!this.state.contentHeight) {
      this.handleSize(layout.height + 1000)
    }
  }

  handleBackFromOpenProfile(e, x){
    console.log(e, x);
    // e.preventDefault();
    e && e.stopPropagation();
    this.props.dispatch({ type: 'CLOSE_PROFILE' });
    this.dontHandleBackFromOpenProfile()
  }

  dontHandleBackFromOpenProfile(){
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackFromOpenProfile.bind(this))
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

  closeProfile() {
    this.props.dispatch({ type: 'CLOSE_PROFILE' });
  }

  openProfile() {
    this.props.dispatch({ type: 'OPEN_PROFILE' });
  }

  handleSize(contentHeight) {
    this.setState({contentHeight})
  }
  render() {
    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.gender ? true : false;
    const slideFrames = hasPartner ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;


    const anistyle = [{
      flex: 1,
      top: 0,
      height: profileVisible ? DeviceHeight : DeviceHeight - 60,
      overflow: this.props.profileVisible ? 'visible' : 'hidden',
      // width: this.state.isOpen.interpolate({
      //   inputRange: [0, 100],
      //   outputRange: [DeviceWidth, DeviceWidth - 40],
      //   extrapolate: 'clamp',
      //
      // }),
      // height: this.state.isOpen.interpolate({
      //   inputRange: [0, 100],
      //   outputRange: [DeviceHeight, DeviceHeight - 75],
      //   extrapolate: 'clamp',
      //
      // })
    }];

    const aniblurstyle = [{
      backgroundColor: colors.outerSpace50,
      // width: DeviceWidth,
      paddingBottom: 120,
      flex: 10,
      flexGrow: 10,
      marginTop: 160,

      // height: this.props.profileVisible ? this.state.contentHeight : 0,
      position: 'relative',
      alignSelf: 'flex-end',
      overflow: 'hidden',
    }]

    return (
      <Animated.View
        key={`topkey${potential.user.id}`}
        style={anistyle}
        onLayout={this.onLayout.bind(this)}
      >

        <ParallaxSwiper
          contentContainerStyle={[{
            // minHeight: this.props.profileVisible ? DeviceHeight : cardHeight,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flex: 1
          }]}
          slideFrames={slideFrames}
          scrollEnabled={profileVisible}
          showsVerticalScrollIndicator={false}
          style={[{
            flex: 1,
            position: 'relative',
            top: profileVisible ? -40 : 0,
            zIndex: 1
            // width: cardWidth,
          }]}
          header={<View />}
          dispatch={this.props.dispatch}
          windowHeight={0}
          width={cardWidth}
          isTopCard={isTopCard}
          pan={this.props.pan}
          profileVisible={profileVisible}
          killProfile={this.closeProfile.bind(this)}
        >
          <View
            blurType="dark"
            style={aniblurstyle}
          >
            {profileVisible ?
              <View
                style={{
                  marginVertical: 8,
                  width: 40,
                  height: 8,
                  borderRadius: 15,
                  alignSelf: 'center',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  position: 'absolute',
                  top: 0,
                  left: (DeviceWidth / 2) - 20
                }}
              /> : null
            }
            <View
              key={`blurkey${potential.user.id}`}
              style={{
                // height: profileVisible ? this.state.contentHeight : 0,
                opacity: profileVisible ? 1 : 0,
                flex: 10
              }}
            >

              <View
                style={{
                  paddingVertical: 40,
                  width: DeviceWidth,
                  flex: 10,
                  marginTop: 0
                }}
              >

                <View
                  style={{
                    marginHorizontal: MagicNumbers.screenPadding / 2,
                    marginBottom: 20,


                  }}
                >
                  <CardLabel
                    potential={potential}
                    seperator={seperator}
                    matchName={matchName}
                    city={city}
                    distance={distance}
                    textColor={colors.white}
                  />
                  {verifiedCouple && <VerifiedCoupleBadge placementStyle={{position: 'absolute', alignSelf: 'flex-start', right: 0, top: 0, marginTop: 20}} />}

                </View>

                {potential.user.bio && potential.user.bio.length ?
                  <View
                    style={{
                      margin: MagicNumbers.screenPadding / 2,
                      width: MagicNumbers.screenWidth,
                      flexDirection: 'column'
                    }}
                  >
                    <Text
                      style={[
                        styles.cardBottomOtherText,
                        {
                          color: colors.white,
                          marginBottom: 15,
                          marginLeft: 0,
                          fontFamily: 'omnes',
                        }
                      ]}
                    >{ !hasPartner ? 'Looking for' : 'Looking for' }</Text>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 18,
                        marginBottom: 15,
                        fontFamily: 'omnes',
                      }}
                    >{ potential.user.bio }</Text>
                  </View> : null
                }

                {hasPartner && potential.partner.bio && potential.partner.bio.length ?
                  <View
                    style={{
                      margin: MagicNumbers.screenPadding / 2,
                      width: MagicNumbers.screenWidth
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 18,
                        marginBottom: 15,
                        fontFamily: 'omnes',
                      }}
                    >
                      {potential.partner.bio}
                    </Text>
                  </View> : null
                }

                <UserDetails
                  potential={potential}
                  user={this.props.user}
                  location={'card'}
                />

                <TouchableOpacity onPress={this.reportModal.bind(this)}>
                  <View
                    style={{
                      marginTop: 20,
                      paddingBottom: 50
                    }}
                  >
                    <Text
                      style={{
                        color: colors.mandy,
                        fontFamily: 'omnes',
                        textAlign: 'center'
                      }}
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
                  onPress={this.props.closeProfile}
                >
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={{ height: 12, width: 12, marginTop: 10 }}
                    source={require('./assets/close.png')}
                  />
                </TouchableOpacity>
              </View>

            </View>

          </View>

        </ParallaxSwiper>

        <TouchableHighlight
          style={{
            width: cardWidth,
            height: 100,
            opacity: profileVisible ? 0 : 1,
            alignSelf: 'flex-end',
            zIndex: 1000,
            // flex: -1,
            backgroundColor: colors.white,
            borderBottomLeftRadius: 11,
            borderBottomRightRadius: 11,
            position: 'absolute',
            padding: 20,

            bottom: profileVisible ? -230 : 0,
          }}
          pointerEvents={'box-only'}
          underlayColor={colors.mediumPurple20}
          onPress={this.openProfile.bind(this)}
        >
          <View >
            <CardLabel
              potential={potential}
              seperator={seperator}
              matchName={matchName}
              city={city}
              distance={distance}
              textColor={colors.shuttleGray}
            />
            {verifiedCouple && <VerifiedCoupleBadge placementStyle={{position: 'absolute', alignSelf: 'flex-start', right: -5, top: 43}}/>}
          </View>
        </TouchableHighlight>

      </Animated.View>
    )
  }
}

export default NewCard;
