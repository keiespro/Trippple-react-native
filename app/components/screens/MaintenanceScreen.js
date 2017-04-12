import React, {Component} from 'react';
import {View, Dimensions, Animated, ActivityIndicator, Text, TouchableOpacity} from 'react-native';

import {connect} from 'react-redux'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

import config from '../../../config'
import {logOut} from '../../actions/appActions'
import DeviceInfo from '../../utils/DeviceInfo'
import colors from '../../utils/colors'
import Analytics from '../../utils/Analytics'

const { SERVER_URL } = config;

const Device = DeviceInfo.get()

const MAX_ATTEMPS_BEFORE_LOGOUT = 10

const VERSION = Device.app_version;
const iOSversion = Device.version;

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class MaintenanceScreen extends Component{

  constructor(props){
    super();
    this.state = {
      buttonOpacity: new Animated.Value(0),
      attempts: 0,
      lastAttempt: null,
      mountedAt: Date.now()
    }
  }
  componentWillMount(){

  }
  componentDidMount() {
    __DEV__ && console.log(this.props);

    // Analytics.event('Maintenance Screen', { label: '', action: '', eventData: {} })

    Animated.timing(
      this.state.buttonOpacity,
      {
        toValue: 1.0,
        delay: 2000,
        duration: 1000
      }
      )
      .start(() => {

      })

  }

  async healthCheck(){
    return fetch(`${SERVER_URL}/user/info`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
        'Accept-Language': Device.locale
      },
      body: JSON.stringify({
        healthCheck: true,
        ...this.props.creds
      })
    })
    .then(res => {
      const resjson = res.json();
      __DEV__ && console.log(resjson);
      return resjson
    })
    .then(response => response)
  }
  tryAgain(){
    if(!this.state.attempting){
      if(this.state.attempts > MAX_ATTEMPS_BEFORE_LOGOUT || !this.props.auth || !this.props.auth.user_id || !this.props.auth.api_key){
        this.props.dispatch(logOut())
        this.props.kill()

        return
      }
      this.setState({
        attempting: true,
      })
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 0.0,
          delay: 0,
          duration: 1000
        }
      ).start(() => {
        if(!this.state.lastAttempt || this.state.lastAttempt + 30000 > Date.now()){

          this.healthCheck()
            .then(result => {
              __DEV__ && console.log(result);
              if(result){
                this.props.kill()
              }else{
                this.atteptFailed()
              }

            }).catch(err => {
              __DEV__ && console.log(err, 'failed');
              this.attemptFailed()
            })
        }
      })
    }

  }
  attemptFailed(){
    if(!this.props.auth || !this.props.auth.user_id || !this.props.auth.api_key){
      this.props.dispatch(logOut())
      this.props.kill()

      return
    }

    Animated.timing(
      this.state.buttonOpacity,
      {
        toValue: 0.0,
        delay: 3000,
        duration: 2000
      }
    ).start(() => {
    })
    this.setState({
      attempting: false,
      attempts: this.state.attempts + 1,
      lastAttempt: Date.now(),
    })
  }
  handleFeedback(){

  }

  render(){
    return (

      <View
        style={{
          width: DeviceWidth,
          height: DeviceHeight,
          alignItems: 'center',
          flexDirection: 'column',
          top: 0,
          left: 0,
          backgroundColor: colors.dusk,
          position: 'absolute',
          justifyContent: 'center',
          flex: 1
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            flex: 1,
            maxHeight: 200
          }}
        >
          <Text
            style={{
              fontSize: 100,
            }}
          >🔥</Text>

        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            fontFamily: 'montserrat',
            textAlign: 'center',
            marginTop: 20,
            color: colors.white, }}
        >SYSTEM MAINTENACE</Text>

        <Text
          style={{
            fontSize: 20,
            marginTop: 15,
            fontWeight: '400',

            fontFamily: 'omnes',
            textAlign: 'center',
            color: colors.white, }}
        >We're working on it. BRB!</Text>

        <View style={{position: 'relative', alignSelf: 'stretch', flexGrow: 1}}>
          <Animated.View
            style={{
              justifyContent: 'center',
              opacity: this.state.buttonOpacity,
              alignSelf: 'center',
              alignItems: 'center',
              height: 180,
              left: 0,
              right: 0,
              position: 'absolute',
              top: 0,

            }}
          >
            <TouchableOpacity
              onPress={this.tryAgain.bind(this)}
              style={{
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 5,
                width: 150,

                marginVertical: 30,
                paddingVertical: 13,
                alignSelf: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'montserrat',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: colors.white, }}
              >TRY AGAIN</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            pointerEvents={'none'}
            style={{
              position: 'absolute',
              top: 0,
              height: 180,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: this.state.buttonOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              alignSelf: 'center',
            }}
          >
            <ActivityIndicator
              size="large"
              color={colors.white}
              animating
              style={{}}
            />
          </Animated.View>
        </View>

        {/* <View style={{
            width:DeviceWidth,
            height:100,
            alignItems:'center',
            flexDirection:'row',
            bottom:0,
            left:0,
            position:'absolute',
            justifyContent:'center',
            flex:1
          }}>
            <Animated.View
              style={{
                justifyContent:'center',
                flex:1,
                flexDirection:'row',
                opacity:this.state.buttonOpacity,
            }}>
              <Text style={{
                fontSize:16,
                fontFamily:'omnes',
                backgroundColor:'transparent',
                textAlign:'left',
                color:colors.white,
              }}>Questions? Comments? </Text>
              <TouchableOpacity onPress={this.handleFeedback.bind(this)}>
                <Text style={{
                  fontSize:16,marginLeft:0.5,
                  backgroundColor:'transparent',
                  textAlign:'left',
                  fontFamily:'omnes',
                  color:colors.sushi,
                }}>Contact Us<Text style={{ color:colors.white }}>.</Text></Text>
              </TouchableOpacity>
            </Animated.View>
          </View> */}
      </View>
    )
  }
}

reactMixin(MaintenanceScreen.prototype, TimerMixin)
MaintenanceScreen.displayName = 'MaintenanceScreen'


const mapStateToProps = (state, p) => ({...p, auth: state.auth})
const mapDispatchToProps = (dispatch) => ({dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceScreen);
