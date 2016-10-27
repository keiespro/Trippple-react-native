import {StyleSheet, AppState, Text, Image, Linking, Platform, View, Dimensions, TouchableOpacity} from 'react-native';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'

import colors from '../../../utils/colors'

import BlurModal from '../BlurModal'
import styles from '../purpleModalStyles'
import BoxyButton from '../../controls/boxyButton'
import ActionMan from '../../../actions'
import {MagicNumbers} from '../../../utils/DeviceConfig'


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
    successCallback: PropTypes.func
  };

  static defaultProps = {
    buttonText: 'YES',
    isPersistant: false,
    imageSource: require('../assets/iconModalDenied.png'),

  };

  componentDidMount(){
    this.checkPermission()
    if(this.props.permission == 'denied'){
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }
  }

  componentWillUnmount() {
    if(this.props.permission == 'denied'){
      AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }
  }

  componentWillReceiveProps(nProps){
    if(this.props.hasPermission != 'true' && nProps.hasPermission == 'true'){
      // successfully got permission
      if(!this.props.isPersistant){
        this.closeModal()
      }
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
      this.finish()
    }
  }

  finish(){
    this.props.closeModal()
  }

  renderFailed(){
    const {hasPermission} = this.props

    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={[{
              width: 150,
              height: MagicNumbers.is4s ? 100 : 150,
              marginBottom: MagicNumbers.is4s ? 15 : 30,
              marginTop: MagicNumbers.is4s ? 10 : 20
            }]}
            source={require('../assets/iconModalDenied.png')}
          />
        </View>
        <Text style={[styles.rowtext, styles.bigtext, {
          fontFamily: 'montserrat', fontWeight: '800', fontSize: 20, marginVertical: 0
        }]}
        >CAN'T ACCESS {this.props.permissionLabel.toUpperCase()}</Text>

        <Text style={[styles.rowtext, styles.bigtext, {
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
      >
        {hasPermission ?
          <Image
            source={require('../assets/checkmarkWhiteSmall.png')}
            resizeMode={Image.resizeMode.cover}
            style={{height: 21, width: 30}}
          /> :
            <View
              style={{backgroundColor: colors.darkGreenBlue40, height: 20, width: 20, borderRadius: 10, alignSelf: 'center'}}
            />
        }
      </BoxyButton>
    ) : (
      <Button
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
                  color: colors.shuttleGray,
                  marginHorizontal: 10
                }]}
              >{this.props.subtitle}</Text>

              <View style={{marginTop: 20}}>
                <View style={{overflow: 'hidden', marginTop: 20}}>
                  {this.renderButton()}
                </View>
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
                  flex: 1,
                  alignItems: 'stretch'
                }}
                onPress={this.finish.bind(this)}
              >
                <View style={[styles.cancelButton, {backgroundColor: 'transparent', alignItems: 'stretch', alignSelf: 'stretch', flexDirection: 'row'}]} >
                  <Text style={[{color: colors.shuttleGray, textAlign: 'center',
                  padding: 10,
                  paddingVertical: MagicNumbers.is4s ? 0 : 20,
                  alignSelf: 'stretch'}, styles.nothankstext]}
                  >Continue</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{paddingHorizontal: 10, marginVertical: 10, alignSelf: 'stretch', flex: 1, alignItems: 'stretch'}}
                onPress={this.finish.bind(this)}
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


      </BlurModal>
    )
  }
}

PermissionsModal.displayName = 'PermissionsModal'

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  permissions: state.permissions,
  hasPermission: state.permissions[ownProps.permissionKey]
})


const mapDispatchToProps = (dispatch) => ({
  dispatch,
  closeModal: () => { dispatch({ type: 'KILL_MODAL', payload: {}}) }
})

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsModal);


const Button = ({btnText, onTap, loading}) => (
  <View
    style={{
      alignSelf: 'stretch',
      marginTop: 30,
      flex: 10,
      marginBottom: 20,

    }}
  >
    <TouchableOpacity
      onPress={onTap}
      style={{
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        alignSelf: 'stretch',
        paddingVertical: 15,
        borderColor: colors.white,
      }}
    >
      <View>
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontFamily: 'montserrat',
            fontWeight: '800'
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
