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

import FBPhotoAlbums from '../../components/fb.login'
import FacebookButton from '../../buttons/FacebookButton'
import BoxyButton from '../../controls/boxyButton'
import colors from '../../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import BackButton from '../../components/BackButton'
import EditImage from './EditImage'
import EditImageThumb from './EditImageThumb'
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
    var lastindex = this.props.navigator.getCurrentRoutes().length;
    console.log(lastindex);
    var nextRoute = this.props.stack[lastindex];
    nextRoute.component = CameraRollView
    nextRoute.passProps = {
      ...this.props,
      imagetype:'profile',
      stack:this.props.stack,

    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)


  }
  _getCamera =()=> {
    var lastindex = this.props.navigator.getCurrentRoutes().length;
    console.log(lastindex);
    var nextRoute = this.props.stack[lastindex];

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

    var lastindex = this.props.navigator.getCurrentRoutes().length;
  console.log(lastindex);
  var nextRoute = this.props.stack[lastindex];

   nextRoute.passProps = {
        ...this.props,
        image: imageFile,
        imagetype:'profile',

            }

    this.props.navigator.push(nextRoute)

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
 <View style={{width:100,height:50,left:20,alignSelf:'flex-start',top:-30}}>
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
          <FacebookButton buttonType={'imageUpload'} _onPress={this.onPressFacebook.bind(this)} key={'notthesamelement'} buttonText="UPLOAD FROM FB" />
        </View>

        <View style={styles.twoButtons}>
          <TouchableHighlight style={[styles.plainButton,{marginRight:10}]} onPress={this._getCameraRoll} underlayColor={colors.shuttleGray20}>
            <Text style={styles.plainButtonText}>FROM ALBUM</Text>
          </TouchableHighlight>


          <TouchableHighlight style={[styles.plainButton,{marginLeft:10}]} onPress={this._getCamera} underlayColor={colors.shuttleGray20}>
            <Text style={[styles.plainButtonText]}>TAKE A SELFIE</Text>
          </TouchableHighlight>

          </View>

          <Modal
            animated={true}
            transparent={true}
            visible={this.state.modalOpen}
          >
            {this.state.modalOpen && this.state.modalView === 'CameraControl' &&
              <CameraControl getImage={this.gotImage} imagetype={'profile'} navigator={this.props.navigator}/>
            }
            {this.state.modalOpen && this.state.modalView === 'CameraRoll' &&
              <CameraRollView getImage={this.gotImage} imagetype={'profile'} goBack={this.closeModal.bind(this)} navigator={this.props.navigator}/>
            }
          </Modal>
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
  fbButton:{
    alignItems:'stretch',
    alignSelf:'stretch',
    marginHorizontal:20,
    width:DeviceWidth-38
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
