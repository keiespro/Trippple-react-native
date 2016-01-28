
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
        <TouchableOpacity onPress={() => this.props.navigator.jumpForward() }>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{width:20,height:20,marginTop:15,alignItems:'flex-start'}}
            source={{uri:'assets/close.png'}}
          />
        </TouchableOpacity>
     </View>

    )
  }
}



export default CloseButton

const styles = StyleSheet.create({
  navBarLeftButton:{
    position:'absolute',
    top:50,
    width:50,
    height:50,
    backgroundColor:'transparent',
    left:10
  }
})
