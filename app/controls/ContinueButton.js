/**
 * @flow
 */
 ;

var React = require('react-native');
var {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
  Component
} = React;

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var colors = require('../utils/colors');



class ContinueButton extends Component{

  constructor(props){
    super(props);


  }


  handleContinue(){
    this.props.handlePress()
  }
  render(){
    return (
      <View style={[styles.continueButtonWrap,
          {
            bottom: this.props.canContinue ? 0 : -80,
            backgroundColor: this.props.canContinue ? colors.mediumPurple : 'transparent'
          }]}>
        <TouchableHighlight
           style={[styles.continueButton]}
           onPress={this.handleContinue.bind(this)}
           underlayColor={colors.darkPurple}>

           <Text style={styles.continueButtonText}>CONTINUE</Text>
         </TouchableHighlight>
      </View>
    )
  }
}



var styles = StyleSheet.create({
  continueButtonWrap:{
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 80,
    backgroundColor: colors.mediumPurple,
    width:DeviceWidth
  },
  continueButton: {
    height: 80,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButtonText: {
    padding: 4,
    fontSize: 26,
    fontFamily:'Montserrat',
    color: colors.white,
    textAlign:'center'
  }
});


module.exports = ContinueButton;
