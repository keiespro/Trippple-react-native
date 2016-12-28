import {StyleSheet, AppState, Text, Image, Linking, Platform, View, Dimensions, TouchableOpacity} from 'react-native';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import colors from '../../../utils/colors'
import BlurModal from '../BlurModal'
import styles from '../purpleModalStyles'
import BoxyButton from '../../controls/boxyButton'
import ActionMan from '../../../actions'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import Button from '../../Btn'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


class PermissionsModal extends Component{

  static propTypes = {
    permissionKey: PropTypes.string.isRequired,
    permissionLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    buttonText: PropTypes.string,
    // imageSource: PropTypes.string,
    renderImage: PropTypes.func,
    isPersistant: PropTypes.bool,
    onSuccess: PropTypes.func
  };

  static defaultProps = {
    buttonText: 'YES',
    isPersistant: false,
    imageSource: require('../assets/iconModalDenied@3x.png'),
   };

  componentDidMount(){
    this.checkPermission()
    if(this.props.permission == 'denied'){
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }
  }

  componentWillUnmount(){
    if(this.props.permission == 'denied'){
      AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }
  }

  componentWillReceiveProps(nProps){
    if(nProps.hasPermission && !this.props.isPersistant){
      this.success()

    }
  }

  _handleAppStateChange(st){
    if(st == 'active'){
      this.checkPermission()
    }
  }

  requestPermission(){
    this.props.dispatch(ActionMan[`request${this.props.permissionLabel}Permission`](),{});
  }

  checkPermission(){
    this.props.dispatch(ActionMan[`check${this.props.permissionLabel}Permission`](),{});
  }

  openSettings(){
    Linking.openURL('app-settings://').catch(err => console.error('An error occurred', err));
  }

  handleTap(){
    if(this.props.hasPermission == 'denied'){
      this.openSettings()
    }else if(!this.props.hasPermission){
      this.requestPermission()
    }else{
      this.success()
    }
  }
  success(){
    this.props.onSuccess && this.props.onSuccess()
    this.finish()
  }
  finish(){
    this.props.isModal && this.props.closeModal()

  }
  cancel(){
    if(this.props.permissionKey == 'location'){
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
    }
    if(this.props.permissionKey == 'contacts'){
      this.props.dispatch({type: 'CHECK_CONTACTS_PERMISSION_FULFILLED', payload: false})
    }

    this.finish()
  }
  renderFailed(){
    return (
      <View style={{flexGrow:1}}>
        <View style={{alignItems: 'center',flexGrow:1}}>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={[{
              width: 150,
              height: MagicNumbers.is4s ? 100 : 150,
              marginBottom: MagicNumbers.is4s ? 15 : 30,
              marginTop: MagicNumbers.is4s ? 10 : 20
            }]}
            source={require('../assets/iconModalDenied@3x.png')}
          />
        </View>
        <Text
          style={[styles.rowtext, styles.bigtext, {
            fontFamily: 'montserrat', fontWeight: '800', fontSize: 20, marginVertical: 0
          }]}
        >CAN'T ACCESS {this.props.permissionLabel.toUpperCase()}</Text>

        <Text
          style={[styles.rowtext, styles.bigtext, {
            fontSize: 18, marginVertical: 10, color: colors.shuttleGray, marginHorizontal: 10
          }]}
        >
          Go to the Settings app and enable {this.props.permissionLabel} for Trippple.
        </Text>

        <View style={{marginTop: 20}}>

          <View style={{overflow: 'hidden', marginTop: 20}}>
            <Button btnText="GO TO SETTINGS" onTap={this.openSettings.bind(this)}/>

          </View>
        </View>
      </View>
    )
  }

  renderButton(){
    const buttonText = this.props.buttonText;
    const {hasPermission} = this.props

    return this.props.isPersistant ? (
      <BoxyButton
        text={buttonText}
        buttonText={buttonStyles.buttonText}
        underlayColor={colors.darkGreenBlue}
        innerWrapStyles={[buttonStyles.innerWrapStyles, {overflow: 'hidden'}]}
        stopLoading={hasPermission}
        leftBoxStyles={buttonStyles.grayIconbuttonLeftBox}
        _onPress={this.handleTap.bind(this)}
        outerButtonStyle={{flexGrow:1,backgroundColor:'transparent',width:DeviceWidth-60,maxHeight:80}}
      >
        {hasPermission ?
          <Image
            source={require('../assets/checkmarkWhiteSmall@3x.png')}
            resizeMode={Image.resizeMode.cover}
            style={{height: 21, width: 30}}
          /> :
            <View
              style={{
                backgroundColor: colors.darkGreenBlue40, height: 20, width: 20, borderRadius: 10, alignSelf: 'center'
              }}
            />
        }
      </BoxyButton>
    ) : (
      <ModalButton
        btnText={buttonText}
        onTap={this.handleTap.bind(this)}
        loading={this.props.loading}
      />
    );
  }

  render(){
    return (
      <BlurModal>
        <View style={[styles.col, {height: DeviceHeight, width: DeviceWidth, padding: 20, justifyContent: 'space-between' }]}>

          {this.props.hasPermission == 'denied' ? this.renderFailed() :
            <View>
              <View style={{alignItems: 'center'}}>
                {this.props.renderImage ? this.props.renderImage() :
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={[{
                      width: 150,
                      height: MagicNumbers.is4s ? 100 : 150,
                      marginBottom: MagicNumbers.is4s ? 15 : 30,
                      marginTop: MagicNumbers.is4s ? 10 : 20
                    }]}
                    source={this.props.imageSource}
                  />
                }
              </View>
              <Text
                style={[styles.rowtext, styles.bigtext, {
                  fontFamily: 'montserrat',
                  fontWeight: '800',
                  fontSize: 20,
                  marginVertical: 0
                }]}
              >{this.props.title}</Text>

              <Text
                style={[styles.rowtext, styles.bigtext, {
                  fontSize: 18,
                  marginVertical: 10,
                  color: colors.white,
                  marginHorizontal: 10
                }]}
              >{this.props.subtitle}</Text>

              <View style={{marginTop: 20}}>
                {this.renderButton()}
              </View>

            </View>

          }
          <View style={{ }} >

            { this.props.hasPermission ? (
              <TouchableOpacity
                style={{
                  width: undefined,
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignSelf: 'stretch',
                  flexGrow: 1,
                  alignItems: 'stretch'
                }}
                onPress={this.finish.bind(this)}
              >
                <View
                  style={[styles.cancelButton, {
                    backgroundColor: 'transparent',
                    flexGrow:1,
                    alignItems: 'stretch',
                    alignSelf: 'stretch',
                    flexDirection: 'row'
                  }]}
                >
                  <Text
                    style={[{
                      color: colors.white,
                      textAlign: 'center',
                      padding: 10,
                      paddingVertical: MagicNumbers.is4s ? 0 : 20,
                      alignSelf: 'stretch'
                    }, styles.nothankstext
                    ]}
                  >Continue</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  alignSelf: 'stretch',
                  flexGrow: 1,
                  alignItems: 'stretch'
                }}
                onPress={this.cancel.bind(this)}
              >
                <View style={[styles.cancelButton, {backgroundColor: 'transparent', flexGrow: 1, alignItems: 'stretch', alignSelf: 'stretch'}]} >
                  <Text
                    style={[{
                      color: colors.white,
                      textAlign: 'center',
                      padding: MagicNumbers.is4s ? 0 : 10,
                      alignSelf: 'stretch'
                    }, styles.nothankstext]}
                  >no thanks</Text>
                </View>
              </TouchableOpacity>
            )}

          </View>
        </View>


      </BlurModal>
    )
  }
}

PermissionsModal.displayName = 'PermissionsModal'

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  permissions: state.permissions,
  hasPermission: state.permissions[ownProps.permissionKey] && state.permissions[ownProps.permissionKey] != 'undetermined'
})


const mapDispatchToProps = (dispatch) => ({
  dispatch,
  closeModal: () => { dispatch({ type: 'KILL_MODAL', payload: {}}) }
})

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsModal);


const ModalButton = ({btnText, onTap, loading}) => (
  <View>
    <Button
      onPress={onTap}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        flexGrow: 1,
        alignSelf: 'stretch',
        paddingVertical: 15,
        borderColor: colors.white,
      }}
      color={colors.dark}
    >
      <View>
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontFamily: 'montserrat',
            fontWeight: '800'
          }}
        >{btnText}</Text>
      </View>
    </Button>

  </View>
);

const buttonStyles = StyleSheet.create({

  privacyStyle: {
    height: 60,
  },
  innerWrapStyles: {
    borderColor: colors.darkGreenBlue,
    borderWidth: 1,
    overflow: 'hidden',

    backgroundColor: colors.transparent
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
