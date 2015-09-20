import React from 'react-native'
import {
  Component,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import Camera from 'react-native-camera';
import colors from '../utils/colors'
import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class Gobackbutton extends Component{
  constructor(props){
    super()
  }
  _goBack =()=>{
    this.props.navigator.pop()
  }
  render(){
    return (
      <TouchableOpacity onPress={this._goBack} style={styles.leftbutton}>
        <View>
          <Text style={{color:colors.shuttleGray}}>Go Back</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

var styles = StyleSheet.create({
  leftbutton:{
    width:80,
    alignSelf: 'flex-start',
    height:50,
    paddingVertical:10
  },

})
export default Gobackbutton