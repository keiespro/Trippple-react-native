import {
  Text,
  Image,
  NativeModules,
  ScrollView,
  View,
  AppState,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  Linking
} from 'react-native';
import React, { PropTypes } from 'react';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {OSPermissions} = NativeModules
import colors from '../../utils/colors'
import _ from 'underscore'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import {MagicNumbers} from '../../utils/DeviceConfig'
import Analytics from '../../utils/Analytics'
import { BlurView,VibrancyView} from 'react-native-blur'
import { connect } from 'react-redux';
import ActionMan from '../../actions'


class LocationPermission extends React.Component{

  static propTypes = {
    nextRoute:PropTypes.object,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    buttonText: PropTypes.string,
    headerImageSource: PropTypes.string,
    renderMethod: PropTypes.oneOf(['push', 'replace','show']),
    renderNextMethod: PropTypes.oneOf(['pop', 'push', 'replace','suppress']),
    renderPrevMethod: PropTypes.oneOf(['pop', 'replace','suppress']),
    successCallback: PropTypes.func
  };

  static defaultProps = {
    buttonText: 'YES'
  };

  constructor(props) {
    super();
    this.state = {
      hasPermission: OSPermissions.location && parseInt(OSPermissions.location) && parseInt(OSPermissions.location) > 2

    }
  }

  // componentWillMount(){
  //  // if(OSPermissions[this.props.permissionKey]  && parseInt(OSPermissions[this.props.permissionKey]) > 2){
  //  //   this.props.failCallback ? this.props.failCallback(true) : this.props.navigator[this.props.renderNextMethod]( this.props.nextRoute )
  //
  //  // }
  //
  // }


  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }
  _handleAppStateChange(st){
    if(st == "active"){
      this.getLocation()
    }
  }
  componentDidUpdate(prevProps,prevState){
    if(!prevState.hasPermission && this.state.hasPermission ){
     // this.props.failCallback && this.props.failCallback()
    }
  }

  requestPermission(){
    this.getLocation()
  }
  getLocation(){
    navigator.geolocation.getCurrentPosition( (geo) => {
      this.handleSuccess(geo)

    },
     (error) => {
       Analytics.log(error)
       __DEV__ && console.warn('err',error);
       this.setState({hasPermission: false,failedState: error.code == 1})

     },
     {enableHighAccuracy: false, maximumAge: 1} )
  }

  cancel(val){
    this.setState({hasPermission: false})

    this.close()
  }
  openSettings(){
    Linking.openURL('app-settings://').catch(err => console.error('An error occurred', err));
  }

  handleTapYes(){
    // if(this.state.hasTapped){
    //   this.close()
    //   return
    // }
    this.requestPermission()
    this.setState({hasTapped: true})

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

  handleFail(){
    this.setState({hasPermission: false})
    this.props.failCallback && this.props.failCallback(0)
    this.close()
  }

  handleSuccess(geo){
    const { latitude, longitude } = geo.coords
    this.props.dispatch(ActionMan.updateUser({lat:latitude,lon:longitude}))
    this.props.successCallback && this.props.successCallback(geo.coords)
    this.close()
  //  this.props.navigator.pop()
  }

  handleContinue(){
    this.props.nextRoute ? this.props.navigator.replace(this.props.nextRoute) : this.props.continue()
  }

  render(){
    return this.renderModal()
  }


  renderButton(){
    return (
     <View>
     <TouchableHighlight
       style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:10,marginTop:20,marginBottom:15}}
       onPress={this.state.failedState ? this.openSettings.bind(this) : this.handleTapYes.bind(this)}>
       <View style={{paddingVertical:20}} >
         <Text style={[styles.modalButtonText,{fontFamily:'Montserrat-Bold'}]}>
           {
            this.state.failedState ? `GO TO SETTINGS` : `YES PLEASE`
           }
         </Text>
       </View>
     </TouchableHighlight>
     </View>
   )
  }

  renderModal(){
    return (

      <BlurView
         blurType="dark"
         style={[{position:'absolute',top:0,width:DeviceWidth,height:DeviceHeight,justifyContent:'center',alignItems:'center',flexDirection:'column'}]}
       >
       <ScrollView
         style={[{padding:0,width:DeviceWidth,height:DeviceHeight,backgroundColor: 'transparent',paddingTop:20,position:'relative',paddingHorizontal:MagicNumbers.screenPadding/2}]}
         contentContainerStyle={{flexDirection:'column',justifyContent:'center',alignItems:'center',}}
       >
         <View style={{width:200,height:200,marginVertical:10,position:'relative',alignItems:'center',justifyContent:'center'}}>
          <Image
            style={[{width:100,height:100,borderRadius:50,top:0,left:0,margin:50,position:'absolute'}]}
            source={ {uri: (this.state.failedState ? 'assets/iconModalDenied@3x.png' : this.props.user.image_url) }}
          />
          <Image
           style={{width:200,height:200,marginVertical:0,top:0,left:0,padding:50,padding:0,position:'absolute'}}
           resizeMode="cover"
           source={ {uri: 'assets/localIcon@3x.png' }}
           />
         </View>
         <View style={[styles.insidemodalwrapper,{justifyContent:'center'}]}>

           <Text style={[styles.rowtext,styles.bigtext,{
             fontFamily:'Montserrat-Bold',fontSize:22,marginVertical:10,color: colors.white
           }]}>
             {this.state.failedState ? this.props.failedTitle.toUpperCase() : this.props.title.toUpperCase()}
           </Text>

           <Text style={[styles.rowtext,styles.bigtext,{
             fontSize:18,color: colors.white,marginHorizontal:MagicNumbers.screenPadding,
             marginBottom: MagicNumbers.is5orless ? 10 : 20
           }]}>{this.state.failedState ? `Go to the Settings app and enable Location for Trippple` : `We’ve found some matches we think you might like.`}</Text>
          {this.state.failedState ? null :   <Text style={[styles.rowtext,styles.bigtext,{
               fontSize:18,color: colors.white,marginHorizontal:MagicNumbers.screenPadding/2,
               marginBottom: MagicNumbers.is5orless ? 10 : 20
             }]}>Should we prioritize the matches nearest to you?</Text>}

           {this.renderButton()}
         </View>

         <View style={{marginTop:MagicNumbers.is5orless ? 0 : 10}}>
           <TouchableOpacity style={{padding:10}}
           onPress={()=>this.cancel(false)}>
             <View style={[styles.cancelButton,{ backgroundColor:'transparent'}]} >
               <Text style={[styles.nothankstext,{color:colors.warmGreyTwo,fontFamily:'Omnes-Light', backgroundColor:'transparent'}]}>No Thanks</Text>
             </View>
           </TouchableOpacity>
         </View>
       </ScrollView>
       </BlurView>

   )
  }


}

LocationPermission.displayName = "LocationPermission"
export default LocationPermission
