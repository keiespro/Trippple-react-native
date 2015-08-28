import React from 'react-native'
import {
  StyleSheet,
  Text,
  Image,
  View,
  Component,
  Modal,
  TouchableHighlight,
  Dimensions
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import BoxyButton from '../../controls/boxyButton'
import colors from '../../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'

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
    this.setState({
      modalOpen:true,
      modalView: 'CameraRoll'
    })
  }
  _getCamera =()=> {
    this.setState({
      modalOpen:true,
      modalView: 'CameraControl'
    })
  }
  closeModal(){
   this.setState({
      modalOpen:false,
      modalView: ''
    })
  }
  gotImage =(imageFile)=>{
    this.closeModal()
    this.props.navigator.push({
      component: this.props.nextRoute,
      passProps: {
        image: imageFile,
        imagetype:'couple_profile',
      },
      sceneConfig: NavigatorSceneConfigs.FloatFromBottom
    });
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
           <Modal
            animated={true}
            transparent={true}
            visible={this.state.modalOpen}
          >
            {this.state.modalOpen && this.state.modalView === 'CameraControl' &&
              <CameraControl getImage={this.gotImage} imagetype={'profile'} />
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

