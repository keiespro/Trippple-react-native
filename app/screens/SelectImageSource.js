import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, View, TouchableHighlight, Modal, Dimensions} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


import {MagicNumbers} from '../DeviceConfig'
import OnboardingActions from '../flux/actions/OnboardingActions'
import FBPhotoAlbums from '../components/fb.login'
import FacebookButton from '../buttons/FacebookButton'
import BoxyButton from '../controls/boxyButton'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import BackButton from '../components/BackButton'
import OnboardingBackButton from './registration/BackButton'
import EditImage from './registration/EditImage'
import EditImageThumb from './registration/EditImageThumb'
import CameraControl from '../controls/cameraControl'
import CameraRollView from '../controls/CameraRollView'
import CameraRollPermissionsModal from '../modals/CameraRollPermissions'
import CameraPermissionsModal from '../modals/CameraPermissions'

class SelectImageSource extends Component{

  static propTypes = {
    imageType: PropTypes.oneOf(['profile','couple_profile','avatar']),

  };

  static defaultProps = {
    imageType: 'profile'
  };

  constructor(props){
    super();
    this.state = {

    }

  }


  getCameraRollPermission(){

     var nextRoute =  {
      component:  (this.props.AppState.OSPermissions && parseInt(this.props.AppState.OSPermissions.cameraRoll) > 2 ? CameraRollView : CameraRollPermissionsModal)
    };

    nextRoute.passProps = {
      image_type: this.props.image_type || this.props.imageType,

    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)



  }
  getCameraPermission(){
    var lastindex = this.props.navigator.getCurrentRoutes().length;
    var nextRoute = {
      component: CameraPermissionsModal
    }

    nextRoute.passProps = {
      image_type: this.props.image_type || this.props.imageType,

      nextRoute: CameraControl

    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)

  }

  // gotImage(imageFile){

  //   OnboardingActions.proceedToNextScreen({
  //     image:imageFile,
  //     image_type: this.props.image_type || this.props.imageType,

  //   })

  // }

  onPressFacebook(fbUser){

    var nextRoute = {}
    nextRoute.component = FBPhotoAlbums
    nextRoute.passProps = {
      ...this.props,
      image_type: this.props.image_type || this.props.imageType,
      nextRoute: EditImage,
      afterNextRoute: EditImageThumb,
      fbUser
    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)

  }



  render(){

    const isCoupleImage = this.props.image_type == 'couple_profile' || this.props.imageType == 'couple_profile',
    isOnboarding = this.props.navigator.getCurrentRoutes()[0].id != 'potentials';

    const copy = {
        coupleTitle: `You and your Partner`,
        singleTitle: `Just You`,
        coupleSubtitle: ()=>{
          return (
            <Text style={[styles.textTop,{marginTop:0}]}>
              <Text>Upload or snap a pic of </Text>
              <Text style={{color:colors.sushi}}>you and your partner {MagicNumbers.is4s ? null : 'together'}</Text>
              <Text>.</Text>
            </Text>
          )
        },
        singleSubtitle: () => {
          return (
            <Text style={[styles.textTop,{marginTop:0}]}>
              <Text>Now upload or snap </Text>
              <Text style={{color:colors.sushi}}>a pic of just you</Text>
              {MagicNumbers.is4s ? null : <Text>. This is the picture your matches will see during your chats.</Text>}
            </Text>
          )
        }

    }

    return (
      <View style={styles.container}>

        <View style={{width:100,left:0,alignSelf:'flex-start',top:-10}}>
          {
            isOnboarding ? <OnboardingBackButton/> : <BackButton navigator={this.props.navigator}/>
          }
        </View>

        <Text style={styles.textTop}>{ isCoupleImage ? copy.coupleTitle : copy.singleTitle }</Text>

        {isCoupleImage ? copy.coupleSubtitle() : copy.singleSubtitle()}


        <View style={styles.imageHolder}>
          <Image
            source={
              isCoupleImage ?
               {uri: 'assets/iconCouplePic@3x.png'} :
                {uri: 'assets/iconSinglePic@3x.png'} 
              }
            resizeMode={Image.resizeMode.contain}
            style={styles.imageInside}
          />
        </View>

        <View>

          <View style={styles.fbButton}>
            <FacebookButton
              buttonType={'upload'}
              _onPress={this.onPressFacebook.bind(this)}
              key={'notthesamelement'}
              buttonText="UPLOAD FROM FB"
            />
          </View>

          <View style={styles.twoButtons}>

            <TouchableHighlight
              style={[styles.plainButton,{marginRight:MagicNumbers.screenPadding/4}]}
              onPress={this.getCameraRollPermission.bind(this)}
              underlayColor={colors.shuttleGray20}
            >
              <Text style={styles.plainButtonText}>FROM ALBUM</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.plainButton,{marginLeft:MagicNumbers.screenPadding/4}]}
              onPress={this.getCameraPermission.bind(this)}
              underlayColor={colors.shuttleGray20}
            >
              <Text style={[styles.plainButtonText]}>TAKE A SELFIE</Text>
            </TouchableHighlight>

          </View>
        </View>
      </View>
    )
  }
}


export default SelectImageSource


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    backgroundColor: colors.outerSpace,
    // padding:0,
    height: DeviceHeight,
    padding:MagicNumbers.screenPadding/2
  },
  twoButtons:{
    flexDirection:'row',
    height:70,
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-between',
    // padding:20,
    marginTop:MagicNumbers.isSmallDevice ? 0 : 0,
    marginBottom:0,
    width:MagicNumbers.screenWidth

  },

  plainButton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    height:70,
    alignSelf:'stretch',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  plainButtonText:{
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'Montserrat',
    textAlign:'center',
  },
  textTop:{
    marginBottom: 0,
    fontSize: MagicNumbers.is4s ? 18 : 20,
    color: colors.rollingStone,
    fontFamily:'omnes',
    textAlign:'center'
  },
  imageHolder:{
    width:MagicNumbers.is4s ? DeviceWidth/2 - 10 : DeviceWidth/2 + 20,
    height:MagicNumbers.is4s ? DeviceWidth/2 - 30 : DeviceWidth/2 ,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:MagicNumbers.is4s ? 20 : 40
  },
  imageInside:{
    width:MagicNumbers.is4s ? DeviceWidth/2 - 10 : DeviceWidth/2 + 20,
    height:MagicNumbers.is4s ? DeviceWidth/2 - 30 : DeviceWidth/2 ,
  },
  fbButton:{
    alignItems:'stretch',
    alignSelf:'stretch',
    // marginHorizontal:20,
    width:MagicNumbers.screenWidth
  },

  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },

});
