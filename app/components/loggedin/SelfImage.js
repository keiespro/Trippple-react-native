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


const DeviceHeight = require('Dimensions').get('window').height;
const DeviceWidth = require('Dimensions').get('window').width;
import FBPhotoAlbums from '../fb.login'
import FacebookButton from '../../buttons/FacebookButton'
import BoxyButton from '../../controls/boxyButton'
import colors from '../../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import BackButton from '../BackButton'
import EditImage from '../../screens/registration/EditImage'
import EditImageThumb from '../../screens/registration/EditImageThumb'
import CameraControl from '../../controls/cameraControl'
import CameraRollView from '../../controls/CameraRollView'

class SelfImage extends Component{
  constructor(props){
    super();
    this.state = {
      modalOpen:false,
      modalView: ''
    }
  }

  _getCameraRoll =()=> {
      // this.setState({modalOpen:true, modalView: 'CameraRoll'})

          var nextRoute = {}
          nextRoute.component = CameraRollView
          nextRoute.passProps = {
            ...this.props,
            imagetype:'profile',
            nextRoute:EditImage
          }
          nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
          this.props.navigator.push(nextRoute)

  }
  _getCamera =()=> {
    // this.setState({modalOpen:true, modalView: 'CameraControl'})

    var nextRoute = {}
    nextRoute.component = CameraControl
    nextRoute.passProps = {
      ...this.props,
      imagetype:'profile',

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


  }
  onPressFacebook(fbUser){

    var nextRoute = {}
    nextRoute.component = FBPhotoAlbums
    nextRoute.passProps = {
      ...this.props,
      imagetype: 'profile',
      nextRoute: EditImage,
      afterNextRoute: EditImageThumb,
      fbUser
    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)

  }
  componentDidUpdate(prevProps,prevState){
    console.log(prevProps,prevState);
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={{width:100,height:50,left:20,alignSelf:'flex-start',top:0}}>
          <BackButton navigator={this.props.navigator}/>
        </View>

        <Text style={styles.textTop}>{this.props.couplePicTitle || 'Your Profile Picture' || 'Now upload or snap a pic of just you. This is the picture your matches will see during your chats.'}</Text>
        {/*<Text style={[styles.textTop,{marginTop:0}]}>{this.props.couplePicText || ` `}</Text>*/}
        <View style={styles.imageHolder}>

          <Image source={require('image!iconSinglePic')}
                    resizeMode={Image.resizeMode.contain}
                        style={styles.imageInside} />
        </View>
        <View style={styles.fbButton}>
          <FacebookButton buttonType={'imageUpload'} _onPress={this.onPressFacebook.bind(this)} key={'notthesamelement'} buttonTextStyle={{fontFamily:'Montserrat-Bold'}} buttonText="UPLOAD FROM FB" />
        </View>
        <View style={styles.twoButtons}>
          <TouchableHighlight style={[styles.plainButton,{marginRight:10}]} onPress={this._getCameraRoll} underlayColor={colors.shuttleGray20}>
            <Text style={styles.plainButtonText}>FROM ALBUM</Text>
          </TouchableHighlight>


          <TouchableHighlight style={[styles.plainButton,{marginLeft:10}]} onPress={this._getCamera} underlayColor={colors.shuttleGray20}>
            <Text style={[styles.plainButtonText]}>TAKE A SELFIE</Text>
          </TouchableHighlight>

          </View>

      </View>
    )
  }
}



var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    backgroundColor: colors.outerSpace,
    padding:0,
    height: DeviceHeight
  },
  twoButtons:{
    flexDirection:'row',
    height:60,
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-between',
    // padding:20,
    margin:20,
    width:DeviceWidth-38

  },
  fbButton:{
    alignItems:'stretch',
    alignSelf:'stretch',
    marginHorizontal:20,
    width:DeviceWidth-38
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
    width:310,
    height:310,
    alignItems:'center',
    justifyContent:'center',
    marginTop:40,
    marginBottom:60
  },
  imageInside:{
    height:310,
    width:310,
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
