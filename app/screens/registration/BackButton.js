import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import colors from '../../utils/colors'
import OnboardingActions from '../../flux/actions/OnboardingActions'


class BackButton extends Component{
  constuctor(props){
    super(props);
    this.state = {}

  }


  goBack(){

    OnboardingActions.proceedToPrevScreen()
  }

  render(){
      return (
          <TouchableOpacity
              onPress={this.goBack.bind(this)}>
              <View style={styles.goBackButton}>
                <Text textAlign={'left'} style={[styles.bottomTextIcon]}>◀︎ </Text>
                <Text textAlign={'left'} style={[styles.bottomText]}>Go back</Text>
              </View>
            </TouchableOpacity>
        )

  }
}


export default BackButton;


var styles = StyleSheet.create({
 bottomTextIcon:{
    fontSize: 14,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    color: colors.rollingStone,
    marginTop:0
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'Omnes-Regular',
  },
  goBackButton:{
    padding:20,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
});
