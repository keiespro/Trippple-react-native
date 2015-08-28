
import React from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Component
} from  'react-native';


class CloseButton extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <View style={[styles.navBarLeftButton]}>
        <TouchableOpacity onPress={() => this.props.navigator.pop() }>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{width:20,height:20,marginTop:15,alignItems:'flex-start'}}
            source={require('image!close')}
          />
        </TouchableOpacity>
     </View>

    )
  }
}



export default CloseButton

var styles = StyleSheet.create({
  navBarLeftButton:{
    position:'absolute',
    top:50,
    width:50,
    height:50,
    backgroundColor:'transparent',
    left:10
  }
})
