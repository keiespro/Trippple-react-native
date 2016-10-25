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
        toValue: nProps.profileVisible ? 0 : 100,
        useNativeDriver: true
      }).start()
    }

    // if (!this.props.profileVisible && nProps.profileVisible) {
    //   BackAndroid.addEventListener('hardwareBackPress', e => this.handleBackFromOpenProfile(e))
    // }
  }

  componentWillUnmount(){
    // this.dontHandleBackFromOpenProfile()
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
        pointerEvents={'box-none'}

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
            style={aniblurstyle}
          />


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
