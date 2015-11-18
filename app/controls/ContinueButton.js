/**
 * @flow
 */

var React = require('react-native');
var {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicatorIOS,
  Component
} = React;
import {MagicNumbers} from '../DeviceConfig'

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var colors = require('../utils/colors');



class ContinueButton extends Component{

  constructor(props){
    super();

    this.state = {
      submitting: false
    }

  }


  handleContinue(){
    // if(this.state.submitting) { return false }
    this.setState({submitting:true})
    this.props.handlePress()
  }
  nothing(){}
  render(){
    return (
      <View style={[styles.continueButtonWrap,
          {
            bottom: this.props.canContinue ? 0 : -80,
            backgroundColor: this.props.canContinue ? colors.mediumPurple : 'transparent'
          },{position:this.props.absoluteContinue ? 'absolute' : null}]}>
        <TouchableHighlight
           style={[styles.continueButton]}
           onPress={ this.handleContinue.bind(this)}
           underlayColor={colors.darkPurple}>
           <View>
          <Text style={styles.continueButtonText}>CONTINUE</Text>

        {/*this.state.submitting ? <ActivityIndicatorIOS style={{alignSelf:'center',alignItems:'center',flex:1,height:60,width:60,justifyContent:'center'}} animating={true} size={'large'}/> : <Text style={styles.continueButtonText}>CONTINUE</Text>*/}
          </View>
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
    height: MagicNumbers.continueButtonHeight,
    backgroundColor: colors.mediumPurple,
    width:DeviceWidth
  },
  continueButton: {
    height: MagicNumbers.continueButtonHeight,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButtonText: {
    padding: 4,
    fontSize: MagicNumbers.size18+8,
    fontFamily:'Montserrat',
    color: colors.white,
    textAlign:'center'
  }
});


module.exports = ContinueButton;
