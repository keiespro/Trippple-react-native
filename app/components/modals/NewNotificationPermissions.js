import {
  Text,
  Image,
  Settings,
  View,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  Linking,
  PushNotificationIOS,AppState,
  TouchableOpacity,
} from 'react-native';
import React, { PropTypes } from 'react';


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


import colors from '../../utils/colors'
import _ from 'underscore'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import {MagicNumbers} from '../../utils/DeviceConfig'
import { BlurView,VibrancyView} from 'react-native-blur'
import { connect } from 'react-redux';
import ActionMan from '../../actions'
import { HAS_SEEN_NOTIFICATION_REQUEST, LAST_ASKED_NOTIFICATION_PERMISSION, NOTIFICATION_SETTING, LEGACY_NOTIFICATION_SETTING } from '../../utils/SettingsConstants'


const failedTitle = `ALERTS DISABLED`,
    failedSubtitle = `Notification permissions have been disabled. You can enable them in Settings`,
    buttonText = `YES, ALERT ME`;

class NewNotificationPermissions extends React.Component{
    static propTypes = {
        relevantUser: PropTypes.object //user
    };

    static defaultProps = {
        buttonText: 'YES',
        relevantUser: {
        }
    };

    constructor(props){
        super()
        this.state = {
            failedState: false,
            permissions: null,
            hasPermission: false
        }
    }


    _handleAppStateChange(st){
      if(st == "active"){
        this.checkPermission()
      }
    }
    componentWillMount(){
        this.checkPermission()
    }
    componentDidMount(){
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));

        Settings.set({
        // [HAS_SEEN_NOTIFICATION_REQUEST]: true,
            [LAST_ASKED_NOTIFICATION_PERMISSION]: Date.now()
        })
      // AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    }

    componentWillUnmount() {
      // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
        PushNotificationIOS.removeEventListener('register', this.handleNotificationPermission.bind(this));
        AppState.removeEventListener('change', this._handleAppStateChange.bind(this));

    }
    checkPermission(){
        PushNotificationIOS.checkPermissions((permissions) => {
            const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
                acc = acc + permissions[el];
                return acc
            },0);

            if(!permResult){
              this.setState({permissions, hasPermission: permResult > 0,failedState: this.state.didtry})

            }else{

                this.close(false)
                this.props.successCallback && this.props.successCallback();
            }
        })
    }
    // componentDidUpdate(prevProps,prevState){
    //   if(!prevState.hasPermission && this.state.hasPermission ){
    //     // this.props.failCallback(true)
    //   }
    // }
    cancel(){
        this.close()
    }
    close(){
        if(this.props.navigator){
            this.props.navigator.pop()
        }
        if(this.props.hideModal){
            this.props.hideModal()
        }
        if(this.props.close){
            this.props.close()
        }
    }

    handleNotificationPermission(token){

        __DEV__ && console.log('APN -> ',token);



        this.props.dispatch(ActionMan.updateUser({push_token: token}));
      // this.setState({ hasPermission: true})

        Settings.set({
            [HAS_SEEN_NOTIFICATION_REQUEST]: true,
            [NOTIFICATION_SETTING]: true
        })

        this.props.successCallback && this.props.successCallback();
        this.close(false)

    }
    handleTapYes(){
        if(this.state.failedState){
            Linking.openURL('app-settings://').catch(err => console.error('An error occurred', err));

        }else{
            PushNotificationIOS.checkPermissions((permissions) => {
                const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
                    acc = acc + permissions[el];
                    return acc
                },0);

                if(permResult == 0){
                  if(!this.state.didtry){
                    PushNotificationIOS.addEventListener('register', this.handleNotificationPermission.bind(this))
                    PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})
                    this.setState({didtry:true,permissions, hasPermission:false})
                  }else{
                    this.setState({permissions, hasPermission: false,failedState: true})

                  }
                }else{

                    this.close(false)
                    this.props.successCallback && this.props.successCallback();
                }

            })

        }
    }
    handleFail(){

        this.setState({hasPermission: false})
    }
    handleSuccess(){
        this.setState({hasPermission: true})

    }


    render(){
        const {relevantUser} = this.props;
        const featuredUser = relevantUser && relevantUser.user ? relevantUser.user : relevantUser || {};
        const featuredPartner = featuredUser.relationship_status === 'couple' ? relevantUser.partner : {};
        const displayName = (`${featuredUser.firstname} ${featuredPartner.firstname || ''}`).trim();
        const featuredImage = (relevantUser && relevantUser.image_url) || (featuredUser && featuredUser.image_url) || null;

        return (
        <BlurView blurType="dark" style={{width:DeviceWidth,height:DeviceHeight,justifyContent:'center',alignItems:'center',}}>
          <ScrollView
              scrollEnabled={true}
              bounces={true}
              style={[{ }]}
              contentContainerStyle={{justifyContent:'center',alignItems:'center', width:DeviceWidth,height:DeviceHeight, }}
          >
            <View style={{width:160,height:160,marginVertical:30}}>
              <Image style={[{width:160,height:160,borderRadius:80}]} source={
                  this.state.failedState ? {uri: 'assets/iconModalDenied@3x.png'} :
                  featuredImage ? {uri: featuredImage} : {uri:'assets/placeholderUser@3x.png'}
                }
                  defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
              />
            {  this.state.failedState ? null :  <View style={{width:32,height:32,borderRadius:16,overflow:'hidden',backgroundColor:colors.mandy,position:'absolute',top:6,right:6,justifyContent:'center',alignItems:'center'}}>
                <Text style={[{
                    fontSize:20,
                    marginLeft:2,
                    marginTop:-2,
                    width:32,
                    fontFamily:'montserrat',fontWeight:'800',
                    textAlign:'center',
                    color:'#fff',
                }]}>1</Text>

              </View>}
            </View>
            <View style={[{width:DeviceWidth, paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

              <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'montserrat',fontWeight:'800',fontSize:22,color:'#fff',marginVertical:10 }]}>{
                    this.state.failedState ? failedTitle : `GET NOTIFIED`
                  }
              </Text>

              <View style={{flexDirection:'column' }} >
                {featuredImage &&
                <Text style={[styles.rowtext,styles.bigtext,{ fontSize:22, marginVertical:10, color:'#fff', }]}>Great! You’ve liked {displayName ? displayName : "them" }.</Text>
                    }
                    <Text style={[styles.rowtext,styles.bigtext,{
                        fontSize:22,
                        marginVertical:10,
                        color:'#fff',
                        marginBottom:15,
                        flexDirection:'column'
                    }]}>
                      {featuredImage ? `Would you like to be notified \nwhen they like you back?` : ` Would you like to be notified of new matches and messages?`}
                    </Text>
                  </View>
                </View>

                  <View>
                    <TouchableHighlight
                        underlayColor={colors.mediumPurple20}
                        style={{backgroundColor:'transparent',width:DeviceWidth-MagicNumbers.screenPadding*2,borderColor:colors.offwhite,borderWidth:1,borderRadius:5,marginHorizontal:0,marginTop:20,marginBottom:15}}
                        onPress={this.handleTapYes.bind(this)}
                    >
                      <View style={{paddingVertical:20,paddingHorizontal:10,alignSelf:'stretch'}} >
                        <Text style={[styles.modalButtonText,{fontFamily:'Montserrat-Bold'}]}>
                          {
                            this.state.failedState ? 'GO TO SETTINGS' : `YES, ALERT ME!`

                          }
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View style={{marginBottom:20}}>
                    <TouchableOpacity onPress={this.cancel.bind(this)}>
                      <View>
                        <Text style={[styles.nothankstext,{color:colors.warmGreyTwo,fontFamily:'omnes'}]}>
                          No thanks, ask me later
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
              </ScrollView>
            </BlurView>

          )
    }

}


const mapStateToProps = (state, ownProps) => {

    return {
        ui: state.ui,
        relevantUser: state.likes.relevantUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewNotificationPermissions);

NewNotificationPermissions.displayName = "NewNotificationPermissions"
