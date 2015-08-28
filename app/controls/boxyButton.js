var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  LayoutAnimation,
} = React;

var colors = require('../utils/colors')







class BoxyButton extends Component{

  constructor(props){
    super(props);
  }

  _onPress(){
    this.props._onPress();
  }

  render() {

    return (

      <TouchableHighlight onPress={this._onPress.bind(this)} style={this.props.outerButtonStyle}>
        <View style={[styles.iconButton, this.props.innerWrapStyles]}>
          <View style={[styles.iconButtonLeftBox,this.props.leftBoxStyles]}>
            {this.props.children}
          </View>
          <View style={styles.iconButtonRightBox}>
            <Text style={[styles.textplain,styles.iconButtonText,this.props.buttonText]}>{this.props.text}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = BoxyButton;


var styles = StyleSheet.create({

  iconButton:{
    height:70,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignSelf:'stretch',
    flex: 1,
    width: undefined
    // marginVertical:10
  },
  iconButtonLeftBox: {
    width: 80,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:10,
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  iconButtonLeftBoxSingles: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1

  },
  iconButtonRightBox: {
    width: undefined,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:20,
    flex: 1
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonSingles:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1
  },
  iconButtonSelected:{
    // backgroundColor:,
  },
  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  },
});
