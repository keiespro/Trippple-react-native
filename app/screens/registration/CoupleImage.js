import React from 'react-native'
import {
  StyleSheet,
  Text,
  Image,
  View,
  Component,
  TouchableHighlight,
  Dimensions
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import BoxyButton from '../../controls/boxyButton'
import colors from '../../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import Modal from 'react-native-modal'
import CameraControl from '../../controls/cameraControl'

import CameraRollView from '../../controls/CameraRollView'

import EditImage from './EditImage'

class CoupleImage extends Component{

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
        imagetype:'couple_profile',


    }
    this.props.navigator.push(nextRoute)
  }
  componentDidUpdate(prevProps,prevState){
    console.log(prevProps,prevState);
  }
  onPressFacebook(){
    console.log('fb')

  }
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.textTop}>You and your Partner</Text>
        <Text style={styles.textTop}>Upload or snap a pic of you and your partner together</Text>

        <View style={styles.imageHolder}>

          <Image source={require('image!usersCouple')}
                    resizeMode={Image.resizeMode.contain}
                        style={styles.imageInside} />
        </View>

        <BoxyButton
            text={"UPLOAD FROM FACEBOOK"}
            leftBoxStyles={styles.iconButtonLeftBoxCouples}
            innerWrapStyles={styles.iconButtonCouples}
            _onPress={this.onPressFacebook}>

          <Image source={require('image!fBlogo')}
                    resizeMode={Image.resizeMode.cover}
                        style={{height:40,width:20}} />
        </BoxyButton>

        <View style={styles.twoButtons}>
          <TouchableHighlight style={[styles.plainButton,{marginRight:10}]} onPress={this._getCameraRoll}>
            <Text style={styles.plainButtonText}>FROM ALBUM</Text>
          </TouchableHighlight>


          <TouchableHighlight style={[styles.plainButton,{marginLeft:10}]} onPress={this._getCamera}>
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
    padding:0,
    height: DeviceHeight
  },
  twoButtons:{
    flexDirection:'row',
    height:60,
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-between',
    padding:20,
    margin:20,
    marginTop:0

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
    width:250,
    height:250,
    borderRadius: 125,
    borderColor: colors.mediumPurple,
    borderWidth: 2,
    alignItems:'center',
    justifyContent:'center',
    marginTop:40,
    marginBottom:60
  },
  imageInside:{
    height:100,
    width:100,
    marginVertical:150
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


export default CoupleImage;

