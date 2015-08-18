//TODO: try out facebook's ssquare image cropper component
//      https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ImageEditingExample.js


import React from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from 'react-native';

import colors from '../../utils/colors';
import SelfImage from './SelfImage';
import PrivacyScreen from './privacy';
import UserActions from '../../flux/actions/UserActions';

import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class ImageEditor extends React.Component{
  constructor(props){
    super()
  }
  componentWillMount(){
    console.log('will mount editor')
  }

  accept(){
    UserActions.uploadImage(this.props.image)
    this.props.navigator.push({
      component: PrivacyScreen,
      id:'priv'

    })

  }
  render() {

    return (
      <View style={styles.container}>
        <Image
          style={styles.cameraBox}
          source={{uri: this.props.image}}
        />
      <View style={styles.bottom}>
        <TouchableHighlight onPress={this.retake} style={styles.bigbutton}>
          <View/>
        </TouchableHighlight>
          <TouchableHighlight onPress={this.accept.bind(this)} style={[styles.bigbutton,{backgroundColor:colors.sushi}]}>
            <View/>
          </TouchableHighlight>
      </View>

      </View>
    );
  }
  retake() {
    this.props.navigator.pop();
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: '#000',
    width: DeviceWidth,

  },
  bottom:{
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-around',
    height:100,
    padding:10
  },
  cameraBox:{
    flex:1,
    alignSelf:'stretch',
    width:DeviceWidth,
    height:300
  },
  textS:{
    color:'#ffffff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
  leftbutton:{
    width:50,
    backgroundColor:'#fff',
    height:50,
    borderRadius:25
  },
  bigbutton:{
    width:80,
    height:80,
    backgroundColor:'red',
    borderRadius:40
  }
});


export default ImageEditor;
