var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  Image,
  ScrollView,
  TouchableHighlight,
  LayoutAnimation,
} = React;

var UserActions = require('../../flux/actions/UserActions');
var Birthday = require('../../controls/birthday');
var ImageUpload = require('../../components/imageUpload');
var Privacy = require('../../components/privacy');
var colors = require('../../utils/colors')

var DistanceSlider = require('../../controls/distanceSlider');
var ToggleSwitch = require('../../controls/switches');
var NameScreen = require('./name');

var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;


class SelectRelationshipStatus extends React.Component{

  constructor(props){

    super(props);

    this.state = {
      selection: null
    }
  }

  _selectSingle(){
    this.setState({
      selection: 'single'
    })
    this._continue();
  }
  _selectCouple(){
    this.setState({
      selection: 'couple'
    })
    this._continue();
  }
  _continue(){
    this.props.choose(this.state.selection);
  }
  render() {

    return (
      <View style={styles.container}>
          <Text style={styles.labelText}>{"We’re a Couple\nLooking to meet singles"} </Text>

          <BoxyButton
              text={"TRIPPPLE FOR COUPLES"}
              leftBoxStyles={styles.iconButtonLeftBoxCouples}
              innerWrapStyles={styles.iconButtonCouples}
              _onPress={this._selectCouple.bind(this)}>

            <Image source={require('image!oval2')}
                      resizeMode={Image.resizeMode.cover}
                          style={{height:30,width:30,right:-5}} />

            <Image source={require('image!oval2')}
                      resizeMode={Image.resizeMode.cover}
                          style={{height:30,width:30,left:-5,top:0}}/>
          </BoxyButton>

          <View style={styles.dividerLine}/>
          <Text style={styles.dividerText}>OR</Text>

          <Text  style={styles.labelText}>{"I’m a Single\nLooking to meet couples"}</Text>

          <BoxyButton
              text={"TRIPPPLE FOR SINGLES"}
              leftBoxStyles={styles.iconButtonLeftBoxSingles}
              innerWrapStyles={styles.iconButtonSingles}
              _onPress={this._selectSingle.bind(this)}>

              <Image source={require('image!oval2')}
                        resizeMode={Image.resizeMode.cover}
                            style={{height:30,width:30}}/>

          </BoxyButton>



      </View>
    );
  }


}


var styles = StyleSheet.create({
  dividerLine:{
    height:27,
    position:'absolute',
    width:DeviceWidth-50,
    alignSelf:'stretch',
    marginHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor:colors.rollingStone,
  },
  dividerText:{
    color:colors.rollingStone,
    fontSize:25,
    padding:10,
    backgroundColor: colors.outerSpace,
    fontFamily:'Montserrat'
  },
  container: {
    flex: 1,
    height:undefined,
    width:undefined,
    padding:0,
    flexDirection:'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace
  },


  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'center',

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
  }
});


module.exports = SelectRelationshipStatus;
