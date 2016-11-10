import React from 'react'
import { Text, View, BackAndroid, Image, TouchableNativeFeedback, Animated, TouchableOpacity, Dimensions } from 'react-native'
import ActionMan from '../../../actions'
import styles from './styles'
// import XButton from '../../buttons/XButton'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import ParallaxSwiper from '../../controls/ParallaxSwiper'
import VerifiedCoupleBadge from '../../Badge/VerifiedCoupleBadge'
import {pure,onlyUpdateForKeys} from 'recompose'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const CardLabel = pure(({potential, city, textColor, matchName}) => (
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
));

@pure
@onlyUpdateForKeys(['key','pan','potentials','profileVisible'])
class NewCard extends React.Component {

  constructor() {
    super()
    this.state = {

    }
  }


  onLayout(e) {
    const {layout} = e.nativeEvent

    if (!this.state.contentHeight) {
      console.log('layout.height,layout.width',layout.height,layout.width);
      this.handleSize(layout.height,layout.width)
    }
  }

  // handleBackFromOpenProfile(e, x){
  //   console.log(e, x);
  //   // e.preventDefault();
  //   e && e.stopPropagation();
  //   this.props.dispatch({ type: 'CLOSE_PROFILE' });
  //   this.dontHandleBackFromOpenProfile()
  // }
  //
  // dontHandleBackFromOpenProfile(){
  //   BackAndroid.removeEventListener('hardwareBackPress', this.handleBackFromOpenProfile.bind(this))
  // }

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

  handleSize(contentHeight,contentWidth) {
    this.setState({contentHeight,contentWidth})
  }
  renderInsideProfile(){
    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.gender ? true : false;
    const slideFrames = isTopCard && hasPartner ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;

    return (
      <View style={{flexGrow:1,alignItems:'flex-start'}} >

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
                    height: profileVisible ? this.state.contentHeight : 0,
                    opacity: profileVisible ? 1 : 0,
                    flexGrow:1
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
                      {verifiedCouple && <VerifiedCoupleBadge placementStyle={{position: 'relative', alignSelf: 'flex-start', left: 0, top: 0, marginTop: 20}} />}

                    </View>

                    {potential.user.bio && potential.user.bio.length ?
                      <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth, flexDirection: 'column' }}>
                        <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                                                  !hasPartner ? 'Looking for' : 'Looking for'
                                              }</Text>
                        <Text style={{ color: colors.white, fontFamily: 'omnes',fontSize: 18, marginBottom: 15 }}>{
                                                  potential.user.bio
                                              }</Text>
                      </View> : null
                                      }

                    {hasPartner && potential.partner.bio && potential.partner.bio.length ?
                      <View
                        style={{
                          margin: MagicNumbers.screenPadding / 2,
                          width: MagicNumbers.screenWidth
                        }}
                      >
                        <Text style={{    fontFamily: 'omnes', color: colors.white, fontSize: 18, marginBottom: 15 }}>
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
                      <View style={{ marginTop: 20, paddingBottom: 50 }}>
                        <Text style={{     fontFamily: 'omnes',color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        height: 50, zIndex: 9999, alignItems: 'center', width: 50, justifyContent: 'center', flex: 0, alignSelf: 'center',
                      }}
                      onPress={() => this.props.closeProfile ? this.props.closeProfile() : this.props.navigator.pop()}
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

    )
  }
  render() {
    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.gender ? true : false;
    const slideFrames = isTopCard && hasPartner ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;


    const anistyle = [{
      flexGrow: 1,
      top: 0,

      width: DeviceWidth,
      borderRadius: 11,

      // height:DeviceHeight-60
    }];

    const aniblurstyle = [{
      backgroundColor: colors.sushi,
      // width: DeviceWidth,
      flexGrow: 1,
      // flexGrow: 10,
      // marginTop: 160,
      borderRadius: 11,

      height: profileVisible ? DeviceHeight : DeviceHeight,

      position: 'absolute',
      alignSelf: 'center',

    }]

    return (
      <View
        key={`topkey${potential.user.id}`}
        style={anistyle}
        pointerEvents={'box-none'}

      >

        <ParallaxSwiper
          contentContainerStyle={[{
            height: profileVisible ? DeviceHeight : DeviceHeight - 60,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexGrow: 1,
            borderRadius: 11,

          }]}
          autoplay={verifiedCouple ? true : false}
          slideFrames={slideFrames}
          height={profileVisible ? DeviceHeight : DeviceHeight - 60}
          showsVerticalScrollIndicator={false}
          style={[{
            flexGrow: 1,
            borderRadius: 11,

          }]}
          potentialkey={this.props.potential.user.id}
          header={<View  pointerEvents={'none'}  style={{zIndex:-100}}/>}
          dispatch={this.props.dispatch}
          windowHeight={0}
          width={DeviceWidth}
          isTopCard={isTopCard}
          pan={this.props.pan}
          profileVisible={profileVisible}
          killProfile={this.closeProfile.bind(this)}
        >
          <View
            style={aniblurstyle}
          />

          { profileVisible && this.renderInsideProfile()}

        </ParallaxSwiper>

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

      top: profileVisible ? -200 : DeviceHeight-120,
    }}>
        <TouchableNativeFeedback
          useForeground
          background={TouchableNativeFeedback.Ripple(colors.shuttleGray)}
          onPress={this.openProfile.bind(this)}
          pointerEvents={'box-only'}

        >
          <View

          style={{
            borderBottomLeftRadius: 11,
            borderBottomRightRadius: 11,
            padding: 20,
            height: 100,

          }}>
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
        </TouchableNativeFeedback>
        </View>

      </View>
    )
  }
}

export default NewCard;
