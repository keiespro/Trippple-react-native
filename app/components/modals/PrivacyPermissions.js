import React, {Component} from 'react';
import {StyleSheet, AppState, Text, Image, Linking, NativeModules, CameraRoll, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from 'react-native';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import OSPermissions from '../../../lib/OSPermissions/ospermissions'
import ContactGetter from 'react-native-contacts'

import colors from '../../utils/colors'
import _ from 'underscore'

import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import ActionMan from '../../actions'
import {MagicNumbers} from '../../utils/DeviceConfig'

class PrivacyPermissionsModal extends Component{

  constructor(props) {
    super();
    this.state = {
      failedStateContacts: OSPermissions.contacts && parseInt(OSPermissions.contacts) && OSPermissions.contacts < 3,
      hasContactsPermissions: OSPermissions.contacts && parseInt(OSPermissions.contacts) && OSPermissions.contacts > 2
    }
  }

  componentDidMount(){
    this.checkPermission()
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }
  _handleAppStateChange(st){
    if (st == 'active'){
      this.checkPermission()
    }
  }
  checkPermission(){
    ContactGetter.checkPermission((err, permission) => {
      if (err){
        __DEV__ && console.warn(err, 'err');
      }
      __DEV__ && console.warn(permission)

      if (permission === ContactGetter.PERMISSION_AUTHORIZED){
        this.setState({ hasContactsPermissions: true, failedStateContacts: false })
      } else if (permission === ContactGetter.PERMISSION_DENIED){
        this.setState({ hasContactsPermissions: false, failedStateContacts: true })
      } else {
        this.setState({ hasContactsPermissions: false, failedStateContacts: false })
      }
    })
  }
  componentDidUpdate(pProps, pState){
    if (this.state.hasContactsPermissions && !pState.hasContactsPermissions){
      this.props.dispatch(ActionMan.updateUser({privacy: 'private'}))
      this.props.success && this.props.success()
      // this.props.navigator && this.props.navigator.pop()
      //
      // this.props.dispatch(ActionMan.killModal())
    }
  }

  handleTapContacts(){
    if (this.state.hasContactsPermissions) {
      this.getContacts();
    } else {
      ContactGetter.requestPermission((err, permission) => {
        if (err){
         // TODO:  handle err;
          __DEV__ && console.warn(err)
          this.setState({hasContactsPermissions: false, failedStateContacts: true})
        }

       // ContactGetter.PERMISSION_AUTHORIZED || ContactGetter.PERMISSION_UNDEFINED || ContactGetter.PERMISSION_DENIED
        if (permission === ContactGetter.PERMISSION_UNDEFINED){

        }
        if (permission === ContactGetter.PERMISSION_AUTHORIZED){
          this.getContacts()
          this.setState({hasContactsPermissions: true, failedStateContacts: false})
        }
        if (permission === ContactGetter.PERMISSION_DENIED){
          this.setState({failedStateContacts: true, hasContactsPermissions: false})
        }
      })
    }
  }

  getContacts(){
    ContactGetter.requestPermission((err, permission) => {
    // ContactGetter.getContacts((err, contacts) => {
      __DEV__ && console.log(err, permission)
      if (!err) {
      //   UserActions.handleContacts.defer(contacts)
        if (permission === ContactGetter.PERMISSION_UNDEFINED){

        }
        if (permission === ContactGetter.PERMISSION_AUTHORIZED){
          this.setState({hasContactsPermissions: true})
        }
        if (permission === ContactGetter.PERMISSION_DENIED){
          this.setState({
            failedStateContacts: true,
            hasContactsPermissions: false
          })
        }

      //
      } else {
      //
        this.setState({hasContactsPermissions: false})
      //
      }
    })
  }
  openSettings(){
    Linking.openURL('app-settings://').catch(err => console.error('An error occurred', err));
  }
  renderFailed(){
    const {hasContactsPermissions} = this.state

    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={[{width: 150,
              height: MagicNumbers.is4s ? 100 : 150,
              marginBottom: MagicNumbers.is4s ? 15 : 30,
              marginTop: MagicNumbers.is4s ? 10 : 20}]}
            source={require('./assets/iconModalDenied.png')}
          />
        </View>
        <Text style={[styles.rowtext, styles.bigtext, {
          fontFamily: 'montserrat', fontWeight: '800', fontSize: 20, marginVertical: 0
        }]}
        >CAN'T ACCESS CONTACTS</Text>

        <Text style={[styles.rowtext, styles.bigtext, {
          fontSize: 18, marginVertical: 10, color: colors.shuttleGray, marginHorizontal: 10
        }]}
        >
          Go to the Settings app and enable Contacts for Trippple.
        </Text>

        <View style={{marginTop: 20}}>

          <View style={{overflow: 'hidden', borderRadius: 4, marginTop: 20}}>
            <Button btnText="GO TO SETTINGS" onTap={this.openSettings.bind(this)}/>

          </View>
        </View>
      </View>
    )
  }
  render(){
    const {hasContactsPermissions} = this.state

    return (
      <PurpleModal>
        <View style={[styles.col, {justifyContent: 'space-between', padding: 0}]}>

          {this.state.failedStateContacts ? this.renderFailed() : <View>
            <View style={{alignItems: 'center'}}>
              <Image
                resizeMode={Image.resizeMode.contain}
                style={[{width: 150,
                  height: MagicNumbers.is4s ? 100 : 150,
                  marginBottom: MagicNumbers.is4s ? 15 : 30,
                  marginTop: MagicNumbers.is4s ? 10 : 20}]}
                source={require('./assets/iconModalPrivacy.png')}
              />
            </View>
            <Text style={[styles.rowtext, styles.bigtext, {
              fontFamily: 'montserrat', fontWeight: '800', fontSize: 20, marginVertical: 0
            }]}
            >PROTECT YOUR PRIVACY</Text>

            <Text style={[styles.rowtext, styles.bigtext, {
              fontSize: 18, marginVertical: 10, color: colors.shuttleGray, marginHorizontal: 10
            }]}
            >
              Hide from your Facebook Friends and Phone Contacts
            </Text>

            <View style={{marginTop: 20}}>

              <View style={{overflow: 'hidden', borderRadius: 4, marginTop: 20}}>
                <BoxyButton
                  text={'BLOCK CONTACTS'}
                  buttonText={buttonStyles.buttonText}
                  underlayColor={colors.darkGreenBlue}
                  innerWrapStyles={[buttonStyles.innerWrapStyles, {overflow: 'hidden', borderRadius: 4}]}
                  stopLoading={hasContactsPermissions}
                  leftBoxStyles={buttonStyles.grayIconbuttonLeftBox}
                  _onPress={this.handleTapContacts.bind(this)}
                >

                  {hasContactsPermissions ?
                    <Image source={{uri: 'assets/checkmarkWhiteSmall@3x.png'}}
                      resizeMode={Image.resizeMode.cover}
                      style={{height: 21, width: 30}}
                    /> : <View style={{backgroundColor: colors.darkGreenBlue, height: 20, width: 20, borderRadius: 10, alignSelf: 'center'}} /> }
                </BoxyButton>
              </View>
            </View>

          </View>

}
          <View
            style={{
            }}
          >
            { this.state.hasContactsPermissions ? (
              <TouchableOpacity
                style={{width: undefined, paddingHorizontal: 10, marginVertical: 10, flexDirection: 'row', alignSelf: 'stretch', flex: 1, alignItems: 'stretch'}}
                onPress={() => { this.props.success && this.props.success(); this.props.cancel && this.props.cancel(); }}
              >
                <View style={[styles.cancelButton, {backgroundColor: 'transparent', alignItems: 'stretch', alignSelf: 'stretch', flexDirection: 'row'}]} >
                  <Text style={[{color: colors.shuttleGray, textAlign: 'center',
                  padding: 10,
                  paddingVertical: MagicNumbers.is4s ? 0 : 20,
                  alignSelf: 'stretch'}, styles.nothankstext]}
                  >Continue</Text>
                </View>
              </TouchableOpacity>) : (
                <TouchableOpacity
                  style={{paddingHorizontal: 10, marginVertical: 10, alignSelf: 'stretch', flex: 1, alignItems: 'stretch'}}
                  onPress={this.props.cancel}
                >
                  <View style={[styles.cancelButton, {backgroundColor: 'transparent', flex: 1, alignItems: 'stretch', alignSelf: 'stretch'}]} >
                    <Text style={[{color: colors.shuttleGray, textAlign: 'center',
                  padding: MagicNumbers.is4s ? 0 : 10,
                  alignSelf: 'stretch'}, styles.nothankstext]}
                    >no thanks</Text>
                  </View>
                </TouchableOpacity>)}

          </View>
        </View>


      </PurpleModal>
    )
  }
}

PrivacyPermissionsModal.displayName = 'PrivacyPermissions'
export default PrivacyPermissionsModal


const Button = ({btnText, onTap, loading}) => (
  <View
    style={{
      alignSelf: 'stretch',
      marginTop: 30,
      marginHorizontal: 20,
      flex: 1
    }}
  >
    <TouchableOpacity
      onPress={onTap}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 15,
        borderColor: colors.white,
        marginTop: 15,
        marginBottom: 20,
        marginHorizontal: MagicNumbers.screenPadding
      }}
    >
      <View>
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontFamily: 'montserrat', fontWeight: '800'
          }}
        >
          {btnText}
        </Text>
      </View>
    </TouchableOpacity>

  </View>
);

const buttonStyles = StyleSheet.create({

  privacyStyle: {
    height: 60,
  },
  innerWrapStyles: {
    borderColor: colors.darkGreenBlue,
    borderWidth: 1,
    borderRadius: 8,
    width: MagicNumbers.screenWidth,
    overflow: 'hidden',

    backgroundColor: colors.sushi
  },

  iconButtonOuter: {
    marginTop: 20
  },
  grayIconbuttonLeftBox: {
    backgroundColor: colors.darkGreenBlue40,
    borderRightColor: colors.darkGreenBlue,
    borderRightWidth: 1,
  },


  iconButtonText: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 16,
    textAlign: 'center'
  },

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'montserrat', fontWeight: '800'
  },

})
