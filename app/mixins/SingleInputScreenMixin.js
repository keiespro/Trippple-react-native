var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  Image,
  LayoutAnimation,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  SegmentedControlIOS
} = React;

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var colors = require('../utils/colors')


module.exports =  {

  getInitialState() {
    return {
      inputFieldFocused: true,
      inputFieldValue: '',
      inputFieldError: null,
      canContinue: false
    };
  },
  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  },

  componentDidUpdate(){

    if( !this.state.canContinue && this.shouldShow(this.state.inputFieldValue)){
      this.showContinueButton();
    }else if( this.state.canContinue && this.shouldHide(this.state.inputFieldValue)){
      this.hideContinueButton();
    }
  },

  handleInputFocused(){
    this.setState({
      inputFieldFocused: true
    })
  },

  handleInputBlurred(){
    this.setState({
      inputFieldFocused: false
    })
  },

  handleContinue(){
    if(!this.state.canContinue){
      return false;
    }

    this.setState({
      inputFieldError: null
    })
    this._submit && this._submit(this.state.inputFieldValue)
  },

  showContinueButton(){
    this.setState({
      canContinue: true
    })
  },

  hideContinueButton(){
    this.setState({
      canContinue: false
    })
  },

  renderContinueButton(){

    return(
      <View style={[styles.continueButtonWrap,
          {
            bottom: this.state.canContinue ? 0 : -80,
            backgroundColor: this.state.canContinue ? colors.mediumPurple : 'transparent'
          }]}>
        <TouchableHighlight
           style={[styles.continueButton]}
           onPress={this.handleContinue}
           underlayColor={colors.outerSpace}>

           <Text style={styles.continueButtonText}>CONTINUE</Text>
         </TouchableHighlight>
      </View>
    )
  }


};


var animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};



var styles = StyleSheet.create({

    container: {
      flex: 1,
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'stretch',
      width: DeviceWidth,
      margin:0,
      padding:0,
      height: DeviceHeight,
      backgroundColor: 'transparent',
    },
    wrap: {
      flex: 1,
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'stretch',
      width: DeviceWidth,
      margin:0,
      height: DeviceHeight,
      backgroundColor: 'transparent',
      padding:20

    },
    pinInputWrap: {
      borderBottomWidth: 2,
      borderBottomColor: colors.rollingStone,
      height: 60,
      alignSelf: 'stretch'
    },
    pinInputWrapSelected:{
      borderBottomColor: colors.mediumPurple,
    },
    pinInputWrapError:{
      borderBottomColor: colors.mandy,
    },
    pinInput: {
      height: 60,
      padding: 8,
      fontSize: 30,
      fontFamily:'Montserrat',
      color: colors.white
    },
    middleTextWrap: {
      alignItems:'center',
      justifyContent:'center',
      height: 60
    },
    middleText: {
      color: colors.rollingStone,
      fontSize: 21,
      fontFamily:'Montserrat',
    },

    imagebg:{
      flex: 1,
      alignSelf:'stretch',
      width: DeviceWidth,
      height: DeviceHeight,
    },
    button: {
      height: 45,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 2,
      borderRadius: 8,
      marginBottom: 10,
      marginTop: 10,
      alignSelf: 'stretch',
      justifyContent: 'center'
    },
    underPinInput: {
      marginTop: 10,
      height: 30,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'space-between',
      // alignItems: '',
      alignSelf: 'stretch'
    },
    goBackButton:{
      padding:10,
      paddingLeft:0,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      justifyContent:'center'
    },
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
    bottomErrorTextWrap:{

    },
    bottomErrorText:{
      marginTop: 0,
      color: colors.mandy,
      fontSize: 16,
      fontFamily:'Omnes-Regular',

    },

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
      fontSize: 30,
      fontFamily:'Montserrat',
      color: colors.white,
      textAlign:'center'
    }
  });