import React from 'react'
import { Text, View, BackAndroid, StatusBar,Image, TouchableNativeFeedback,InteractionManager, Animated, TouchableOpacity, Dimensions } from 'react-native'
import ActionMan from '../../../actions'
import styles from './styles'
// import XButton from '../../buttons/XButton'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import ParallaxSwiper from '../../controls/ParallaxSwiper'
import VerifiedCoupleBadge from '../../Badge/VerifiedCoupleBadge'
import {pure, onlyUpdateForKeys} from 'recompose'
import ApproveIcon from './ApproveIcon'
import DenyIcon from './DenyIcon'

import CityState from '../../CityState'
import CardLabel from '../../CardLabel'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const anistyle = [{
  flexGrow: 1,
  width: DeviceWidth,
  backgroundColor: colors.white,
  borderRadius: 13,
  top:0,
  overflow:'visible',
}];

const aniblurstyle = [{
  flexGrow: 1,
  overflow:'visible',

  borderRadius: 11,
}];

@pure
@onlyUpdateForKeys(['key', 'pan', 'potentials', 'profileVisible', 'isTopCard'])
class NewCard extends React.Component {

  constructor() {
    super()
    this.state = {

    }
  }

  componentWillReceiveProps(nProps){
    if(!this.props.profileVisible && nProps.profileVisible){
      BackAndroid.addEventListener('hardwareBackPress', this.handleBackFromOpenProfile.bind(this))
    }
  }
  onLayout(e) {
    const {layout} = e.nativeEvent
    // InteractionManager.runAfterInteractions(() => {

      if(!this.state.contentHeight) {
        this.handleSize(layout.height, layout.width)
      }
    // })
  }

  handleBackFromOpenProfile(e, x){
    // console.log(e, x);
    // e && e.preventDefault();
    // e && e.stopPropagation();
    this.props.dispatch({ type: 'CLOSE_PROFILE' });
    // this.dontHandleBackFromOpenProfile()
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

  handleSize(contentHeight, contentWidth) {
    this.setState({contentHeight, contentWidth})
  }
  renderInsideProfile(){

    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.gender ? true : false;
    const slideFrames = isTopCard && hasPartner ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;

    return (
      <View style={{
        flexGrow: 1,
        alignItems: 'flex-start',
      }} >
         <StatusBar
          animated
          backgroundColor={'#000'}
          barStyle="default"
          showHideTransition={'slide'}
        />

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
              {verifiedCouple && <VerifiedCoupleBadge placementStyle={{position: 'relative', alignSelf: 'flex-start', left: 0, top: 0, marginTop: 20}} />}

            </View>

            {potential.user.bio && potential.user.bio.length ?
              <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth, flexDirection: 'column' }}>
                <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                                                  !hasPartner ? 'Looking for' : 'Looking for'
                                              }</Text>
                <Text style={{ color: colors.white, fontFamily: 'omnes', fontSize: 18, marginBottom: 15 }}>{
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
            <TouchableOpacity onPress={this.reportModal.bind(this)}>
              <View style={{ marginTop: 20, paddingBottom: 50 }}>
                <Text style={{ fontFamily: 'omnes', color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
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


    return (
      <View
        key={`topkey${potential.user.id}`}
        style={anistyle}
        pointerEvents={'box-none'}

      >

        <ParallaxSwiper
          contentContainerStyle={[{
            height: profileVisible ? DeviceHeight+160 : DeviceHeight - 60,
            alignItems: 'stretch',
            justifyContent: 'center',
            flexDirection: 'column',
            flexGrow: 1,
            borderRadius: 9,
            width:DeviceWidth,
          }]}

          autoplay={verifiedCouple}
          slideFrames={slideFrames}
          height={profileVisible ? DeviceHeight+160 : DeviceHeight - 60}
          showsVerticalScrollIndicator={false}
          style={[{
            flexGrow: 1,
            borderRadius: 9,
            height: profileVisible ? DeviceHeight+60 : DeviceHeight - 60,
            marginBottom:-100

          }]}
          potentialkey={this.props.potential.user.id}
          header={<View pointerEvents={'none'} style={{zIndex: -100}}/>}
          dispatch={this.props.dispatch}
          windowHeight={0}
          width={DeviceWidth}
          isTopCard={isTopCard}
          pan={this.props.pan}
          profileVisible={profileVisible}
          killProfile={this.closeProfile.bind(this)}
        >
          {/* <View
            style={aniblurstyle}
          /> */}

          { profileVisible && this.renderInsideProfile()}

        </ParallaxSwiper>
        {profileVisible && <TouchableOpacity
          style={{
            height: 50, zIndex: 9999, alignItems: 'center', width: 50, justifyContent: 'center', flex: 0, top: -70, left: -10, position: 'absolute'
          }}
          onPress={() => this.props.closeProfile ? this.props.closeProfile() : this.props.navigator.pop()}
        >
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{ height: 12, width: 12, marginTop: 10, opacity: 0.2 }}
            source={require('./assets/close@3x.png')}
          />
        </TouchableOpacity>}
        <View

          style={{
            width: cardWidth,
            height: profileVisible ? 0 : 100,
            opacity: profileVisible ? 0 : 1,
            alignSelf: 'flex-end',
            zIndex: 10999,
            backgroundColor: colors.white,
            borderBottomLeftRadius: 11,
            borderBottomRightRadius: 11,
            position: 'absolute',
            overflow:'visible',
            top: profileVisible ? 60 : DeviceHeight - 160,
          }}
        >
          <TouchableNativeFeedback

            useForeground
            background={TouchableNativeFeedback.Ripple(colors.shuttleGray)}
            onPress={this.openProfile.bind(this)}
          >
            <View

              style={{
                borderBottomLeftRadius: 9,
                borderBottomRightRadius: 9,
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
          </TouchableNativeFeedback>
        </View>
        {isTopCard ? <DenyIcon pan={this.props.pan}/> : null}
        {isTopCard ? <ApproveIcon pan={this.props.pan}/> : null}


      </View>
    )
  }
}

export default NewCard;
