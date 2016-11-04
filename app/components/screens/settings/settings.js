import React from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  NativeModules,
  Platform,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import Analytics from '../../../utils/Analytics';
import LogoutButton from '../../buttons/LogoutButton';
import XButton from '../../buttons/XButton';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import profileOptions from '../../../data/get_client_user_profile_options'
import ParallaxView from '../../controls/ParallaxScrollView'
import ActionMan from '../../../actions/'
import RNHotline from 'react-native-hotline'
import config from '../../../../config'
import {SlideVerticalNoGesturesIOS} from '../../../ExNavigationStylesCustom'
import SettingsRow from './SettingsRow'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {FBAppInviteDialog} = NativeModules;
const {INVITE_FRIENDS_APP_LINK} = config


@withNavigation
class Settings extends React.Component{
  static route = {
    styles: SlideVerticalNoGesturesIOS,
    navigationBar: {
      visible: false,
      translucent: true,
      backgroundColor: colors.transparent,

    },

    statusBar: {
      translucent: false,
      backgroundColor: colors.dark70,

    },
  };

  constructor(props){
    super();
    this.state = {
      index: 0,
      settingOptions: profileOptions,
    }
  }

  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }
  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  disableAccount(){
    Analytics.event('Interaction', {
      name: 'Disable Account',
      type: 'tap',
    })

    Alert.alert(
      'Delete Your Account?',
      'Are you sure you want to delete your account? You will no longer be visible to any trippple users.',
      [
        {
          text: 'Yes',
          onPress: () => {
            Analytics.event('Support', {
              name: 'Disabled Account',
              type: this.props.user.id,
              user: this.props.user
            })

            this.props.dispatch(ActionMan.disableAccount())
            this.props.dispatch(ActionMan.logOut())
          }
        },
        {
          text: 'No',
          onPress: () => false
        },
      ]
    )
  }

  _openProfile(){
        // Analytics.event('Interaction',{type:'tap', name: 'Preview self profile' });
    const thisYear = new Date().getFullYear()
    const {bday_year} = this.props.user
    const age = (thisYear - bday_year)
    const selfAsPotential = {
      user: { ...this.props.user, age },
    }
    let potential;
    if(this.props.user.relationship_status == 'couple'){
            // delete selfAsPotential.coupleImage;
            // delete selfAsPotential.partner;
      potential = {
        couple: this.props.user.couple,
        user: selfAsPotential.user,
        partner: {
          ...this.props.user.partner,
          age: (thisYear - this.props.user.partner.bday_year)
        },
      };
    }else{
      potential = selfAsPotential
    }

    this.props.navigator.push(this.props.navigation.router.getRoute('UserProfile', {
      potential,
      user: this.props.user
    }));
  }

  _pressNewImage(){
    this.props.navigator.push(this.props.navigation.router.getRoute('FBPhotoAlbums', {}));
  }

  _updateAttr(updatedAttribute){
    this.setState(() => updatedAttribute);
  }
  render(){
    const wh = DeviceHeight / 2;
    return (

      <View style={{backgroundColor: colors.outerSpace, paddingTop: 0, flex: 10}} pointerActions={'box-none'}>

        <ParallaxView
          showsVerticalScrollIndicator={false}
          key={this.props.user.id}
          windowHeight={wh}
          navigator={this.props.navigator}
          automaticallyAdjustContentInsets
          scrollsToTop
          backgroundSource={{uri: this.props.user.image_url || 'assets/defaultuser@3x.png'}}
          style={{backgroundColor: colors.outerSpace, flex: 1, height: DeviceHeight}}
          header={(
            <View
              style={[styles.userimageContainer, {
                justifyContent: 'center',
                height: wh,
                zIndex: 100,
                flexDirection: 'column',
                alignSelf: 'center',
                alignItems: 'center',
                width: DeviceWidth / 2
              }]}
            >
              <TouchableOpacity
                onPress={this._pressNewImage.bind(this)}
                style={{marginTop: 0, }}
              >
                <View>
                  <Image
                    style={[styles.userimage, { }]}
                    key={`${this.props.user.id}thumb`}
                    defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                    resizeMode={Image.resizeMode.cover}
                    source={this.props.user.thumb_url ? {uri: this.props.user.thumb_url} : require('./assets/placeholderUser@3x.png')}
                  />
                  <View style={styles.circle}>
                    <Image
                      style={{width: 18, height: 18}}
                      source={require('./assets/cog@3x.png')}
                      resizeMode={Image.resizeMode.contain}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this._openProfile.bind(this)} style={{alignSelf: 'stretch', }} >
                <View style={{alignSelf: 'stretch', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}>
                  <Text
                    style={{textAlign: 'center', alignSelf: 'stretch', color: colors.white, fontSize: 18, marginTop: 20, fontFamily: 'montserrat', fontWeight: '800'
                    }}
                  >{this.props.user.firstname && this.props.user.firstname.toUpperCase()}</Text>
                </View>

                <View
                  style={{
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      alignSelf: 'stretch', textAlign: 'center', color: colors.white, fontSize: 16, marginTop: 0, fontFamily: 'omnes'
                    }}
                  >View Profile</Text>
                </View>
              </TouchableOpacity>


            </View>
            )}
        >

          <View
            style={{
              backgroundColor: colors.outerSpace,
              width: iOS ? DeviceWidth : DeviceWidth * 0.91,
              marginBottom: 10
            }}
          >

            <SettingsRow
              title={'PROFILE'}
              subtitle={'Edit your information'}
              pushScreen={() => {
                this.props.navigator.push(this.props.navigation.router.getRoute('SettingsBasic', {
                  style: styles.container,
                  settingOptions: profileOptions,
                  startPage: 0,
                }));
              }}
            />

            {this.props.user.relationship_status == 'couple' || !this.props.user.relationship_status ?

              <SettingsRow
                title={'COUPLE'}
                subtitle={`You and your partner, ${this.props.user.partner ? this.props.user.partner.firstname : ''}`}
                pushScreen={(f) => {
                  this.props.navigator.push(this.props.navigation.router.getRoute('SettingsCouple', {
                    style: styles.container,
                    settingOptions: this.state.settingOptions,
                    user: this.props.user,
                  }));
                }}
              />
             : null }

            { this.props.user.relationship_status == 'single' || (this.props.user.relationship_status == 'couple' && this.props.user.partner && this.props.user.partner.id && this.props.user.partner.is_fake_partner) ?

              <SettingsRow
                title={this.props.user.relationship_status == 'single' ? 'JOIN COUPLE' : 'JOIN PARTNER'}
                subtitle={'Connect with your partner'}
                pushScreen={(f) => {
                  this.props.navigator.push(this.props.navigation.router.getRoute('JoinCouple'));
                }}
              /> : null
            }

            <SettingsRow
              title={'PREFERENCES'}
              subtitle={'What you\'re looking for'}
              pushScreen={(f) => {
                this.props.navigator.push(this.props.navigation.router.getRoute('SettingsPreferences', {
                  style: styles.container,
                  settingOptions: this.state.settingOptions,
                  user: this.props.user,
                }));
              }}
            />

            <SettingsRow
              title={'SETTINGS'}
              subtitle={'Privacy and more'}
              pushScreen={(f) => {
                this.props.navigator.push(this.props.navigation.router.getRoute('SettingsSettings', {
                  style: styles.container,
                  settingOptions: this.state.settingOptions,
                }));
              }}
            />

            <SettingsRow
              title={'INVITE FRIENDS'}
              subtitle={'Spread the word'}
              pushScreen={(f) => {
                FBAppInviteDialog.show({applinkUrl: INVITE_FRIENDS_APP_LINK})
              }}
            />

            <SettingsRow
              title={'FAQS'}
              subtitle={'Answers to frequently asked questions'}
              pushScreen={(f) => {this.props.dispatch(ActionMan.showFaqs()) }}
            />

            <SettingsRow
              title={'HELP & FEEDBACK'}
              subtitle={'Chat with us'}
              pushScreen={(f) => {
                this.props.dispatch(ActionMan.showConvos())
              }}
            />

            { __DEV__ &&

              <SettingsRow
                title={'DEBUG'}
                subtitle={'not working'}
                pushScreen={(f) => {
                  this.props.navigator.push(this.props.navigation.router.getRoute('SettingsDebug', {
                    style: styles.container,
                    settingOptions: this.state.settingOptions,
                  }))
                }}
              />

            }

            <View style={styles.paddedSpace}>

              <LogoutButton dispatch={this.props.dispatch}/>

              <TouchableOpacity
                style={{
                  alignItems: iOS ? 'center' : 'flex-start',
                  marginVertical: 10
                }}
                onPress={this.disableAccount.bind(this)}
              >
                <Text
                  style={{
                    color: colors.mandy,
                    fontFamily: 'omnes',
                    textAlign: iOS ? 'center' : 'left',
                  }}
                >Delete My Account</Text>
              </TouchableOpacity>

            </View>


            <View style={[styles.paddedSpace, {marginTop: 20, paddingVertical: 20}]}>

              <Text
                style={{
                  color: colors.shuttleGray,
                  textAlign: iOS ? 'center' : 'left',
                  fontSize: 15,
                  fontFamily: 'omnes'
                }}
              >V {ReactNative.NativeModules.RNDeviceInfo.buildNumber}</Text>
              {__DEV__ &&
              <Text
                style={{
                  color: colors.white,
                  textAlign: iOS ? 'center' : 'left',
                  fontSize: 15,
                  fontFamily: 'omnes'
                }}
              >Build {ReactNative.NativeModules.RNDeviceInfo.appVersion}</Text>
              }
            </View>

          </View>

          <XButton navigator={this.props.navigator}/>

        </ParallaxView>
      </View>
    )
  }
}

Settings.displayName = 'Settings'

const mapStateToProps = ({user, ui}, ownProps) => {
  return {...ownProps, user, ui }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);


const styles = StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace
  //  overflow:'hidden'
  },
  inner: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.outerSpace,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },

  userimageContainer: {
    padding: 0,
    alignItems: 'center'

  },
  blur: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 20,

  },
  closebox: {
    height: 40,
    width: 40,
    backgroundColor: 'blue'
  },
  userimage: {
    padding: 0,
    width: DeviceWidth / 2 - 20,
    height: DeviceWidth / 2 - 20,
    alignItems: 'center',
    borderRadius: ((DeviceWidth / 2 - 20) / 2),
    overflow: 'hidden'
  },
  changeImage: {
  //  position:'absolute',
    color: colors.white,
    fontSize: 22,
  //  right:0,
    fontFamily: 'omnes',
    alignItems: 'flex-end'
  },
  formHeader: {
    marginTop: 40
  },
  formHeaderText: {
    color: colors.rollingStone,
    fontFamily: 'omnes'
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',

    alignSelf: 'stretch',
    paddingTop: 0,
    height: 50,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rollingStone

  },
  tallFormRow: {
    width: 250,
    left: 0,
    height: 220,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow: {
    height: 160,
    paddingLeft: 30,
    paddingRight: 30
  },
  picker: {
    height: 200,
    alignItems: 'stretch',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  halfcell: {
    width: DeviceWidth / 2,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around'


  },
  arrowStyle: {
    tintColor: colors.shuttleGray,
    opacity: 0.4,
    width: 12,
    height: 12
  },
  wrapfield: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.shuttleGray,
    height: 80,
  //  backgroundColor:colors.outerSpace,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: MagicNumbers.screenPadding / 2,
    marginLeft: MagicNumbers.screenPadding / 1.5
  },
  privacy: {
    height: 100,
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 30,
    paddingHorizontal: 20
  },
  formLabel: {
    flex: 8,
    fontSize: 18,
    fontFamily: 'omnes'
  },
  header: {
    fontSize: 24,
    fontFamily: 'omnes'

  },
  textfield: {
    color: colors.white,
    fontSize: 20,
    alignItems: 'stretch',
    flex: 1,
    textAlign: 'left',
    fontFamily: 'montserrat', fontWeight: '800',
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
    fontFamily: 'omnes'

  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#FE6650',
    borderColor: '#111',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  paddedSpace: {
    paddingHorizontal: MagicNumbers.screenPadding / 1.5
  },

  modal: {
    padding: 0,
    height: DeviceHeight - 100,
    flex: 1,
    alignItems: 'stretch',
    alignSelf: 'stretch',
  //  position:'absolute',
  //  top:0

  },
  modalwrap: {
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    margin: 0,
    paddingBottom: 0,
  },
  segmentTitles: {
    color: colors.white,
    fontFamily: 'montserrat', fontWeight: '800'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
    width: DeviceWidth / 3,

  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: -10,
    borderWidth: 1,
    flex: 1,
    backgroundColor: colors.dark,
    width: DeviceWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: colors.dark,
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.mediumPurple,
    position: 'absolute',
    top: 8,
    left: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }

});
