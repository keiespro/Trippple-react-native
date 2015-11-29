import React from 'react-native'
import {
  StyleSheet,
  Text,
  Component,
  Image,
  View,
  TouchableHighlight,
  Modal,
} from 'react-native'


const DeviceHeight = require('Dimensions').get('window').height
const DeviceWidth = require('Dimensions').get('window').width
import {MagicNumbers} from '../../DeviceConfig'
import OnboardingActions from '../../flux/actions/OnboardingActions'



import FBPhotoAlbums from '../../components/fb.login'
import FacebookButton from '../../buttons/FacebookButton'
import BoxyButton from '../../controls/boxyButton'
import colors from '../../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import BackButton from '../../components/BackButton'
import EditImage from '../../screens/registration/EditImage'
import EditImageThumb from '../../screens/registration/EditImageThumb'
import CameraControl from '../../controls/cameraControl'
import CameraRollView from '../../controls/CameraRollView'
 import CameraRollPermissionsModal from '../../modals/CameraRollPermissions'
import CameraPermissionsModal from '../../modals/CameraPermissions'

class SelfImage extends Component{
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
      ...this.props,
      image_type:'profile',
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
      ...this.props,
      image_type:'profile',
      nextRoute: CameraControl

    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)

  }

  closeModal(){
   this.setState({
      modalOpen:false,
      modalView: ''
    })
  }
  gotImage =(imageFile)=>{
    this.closeModal()

    OnboardingActions.proceedToNextScreen({image:imageFile,image_type:'profile'});


  }
  onPressFacebook(fbUser){

    var nextRoute = {}
    nextRoute.component = FBPhotoAlbums
    nextRoute.passProps = {
      image_type: 'profile',
      nextRoute: EditImage,
      afterNextRoute: EditImageThumb,
      fbUser
    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)

  }



  render(){
    return (
      <View style={styles.container}>
 <View style={{width:100,left:0,alignSelf:'flex-start',top:-10}}>
        <BackButton navigator={this.props.navigator}/>
      </View>

        <Text style={styles.textTop}>{this.props.couplePicTitle || 'Your Profile Picture' || 'Now upload or snap a pic of just you. This is the picture your matches will see during your chats.'}</Text>
        {/*<Text style={[styles.textTop,{marginTop:0}]}>{this.props.couplePicText || ` `}</Text>*/}
        <View style={styles.imageHolder}>

          <Image source={require('../../../newimg/iconSinglePic.png')}
                    resizeMode={Image.resizeMode.cover}
                        style={styles.imageInside} />
        </View>
<View>
        <View style={styles.fbButton}>
          <FacebookButton buttonType={'upload'} _onPress={this.onPressFacebook.bind(this)} key={'notthesamelement'} buttonText="UPLOAD FROM FB" />
        </View>

        <View style={styles.twoButtons}>
          <TouchableHighlight style={[styles.plainButton,{marginRight:MagicNumbers.screenPadding/4}]} onPress={this.getCameraRollPermission.bind(this)} underlayColor={colors.shuttleGray20}>
            <Text style={styles.plainButtonText}>FROM ALBUM</Text>
          </TouchableHighlight>


          <TouchableHighlight style={[styles.plainButton,{marginLeft:MagicNumbers.screenPadding/4}]} onPress={this.getCameraPermission.bind(this)} underlayColor={colors.shuttleGray20}>
            <Text style={[styles.plainButtonText]}>TAKE A SELFIE</Text>
          </TouchableHighlight>

          </View>
</View>

      </View>
    )
  }
}



var styles = StyleSheet.create({
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
    margin: 20,
    fontSize: 20,
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
    marginBottom:40
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


export default SelfImage
