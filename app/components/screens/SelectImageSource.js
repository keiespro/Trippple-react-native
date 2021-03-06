import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, View, TouchableHighlight, Modal, Dimensions,NativeModules} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const {OSPermissions} = NativeModules

import {MagicNumbers} from '../../utils/DeviceConfig'
import OnboardingActions from '../flux/actions/OnboardingActions'
import FBPhotoAlbums from '../components/fb.login'
import FacebookButton from '../buttons/FacebookButton'
import BoxyButton from '../controls/boxyButton'
import colors from '../../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import BackButton from '../components/BackButton'
import EditImage from './EditImage'
import EditImageThumb from './EditImageThumb'
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

    OSPermissions.canUseCameraRoll( res => {
      const perm = (res > 2);

      const nextRoute =  {
        component:  perm ? CameraRollView : CameraRollPermissionsModal,
        name: perm ? 'CameraRollView' : 'CameraRollPermissionsModal'
      };

      nextRoute.passProps = {
        image_type: this.props.image_type || this.props.imageType,
      }
      nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
      this.props.navigator.push(nextRoute)

    })
  }
  getCameraPermission(){

      OSPermissions.canUseCamera( res => {
        const perm = (res > 2);

        const nextRoute =  {
          component:  perm ? CameraControl : CameraPermissionsModal,
          name: perm ? 'CameraControl' : 'CameraPermissionsModal'
        };

        nextRoute.passProps = {
          image_type: this.props.image_type || this.props.imageType,
        }
        nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
        this.props.navigator.push(nextRoute)

      })

  }

  // gotImage(imageFile){

  //   OnboardingActions.proceedToNextScreen({
  //     image:imageFile,
  //     image_type: this.props.image_type || this.props.imageType,

  //   })

  // }

  onPressFacebook(fbUser){

    var nextRoute = {name:'FBPhotoAlbums'}
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
          currentRoutes = this.props.navigator.getCurrentRoutes();

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

        <View style={{width:100,left:10,position:'absolute',alignSelf:'flex-start',top:-10}}>
          <BackButton navigator={this.props.navigator}/>
        </View>
        <View style={{justifyContent:'space-around',alignItems:'center',flex:1,marginTop:MagicNumbers.is5orless ? 30 : 50,marginBottom:MagicNumbers.is5orless ? 10 : 0}}>
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
      </View>
    )
  }
}

SelectImageSource.displayName = 'SelectImageSource'
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
    height:MagicNumbers.is5orless  ? 50 : 70,
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
    fontSize: MagicNumbers.is5orless ? 16 : 20,
    color: colors.rollingStone,
    fontFamily:'omnes',
    textAlign:'center'
  },
  imageHolder:{
    width:MagicNumbers.is5orless ? DeviceWidth/2 - 10 : DeviceWidth/2 + 20,
    height:MagicNumbers.is5orless ? DeviceWidth/2 - 30 : DeviceWidth/2 ,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:MagicNumbers.is5orless  ? 20 : 40
  },
  imageInside:{
    width:MagicNumbers.is5orless ? DeviceWidth/2 - 10 : DeviceWidth/2 + 20,
    height:MagicNumbers.is5orless ? DeviceWidth/2 - 30 : DeviceWidth/2 ,
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
