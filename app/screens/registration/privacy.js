var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  LayoutAnimation,
} = React;

var UserActions = require('../../flux/actions/UserActions');
var colors = require('../../utils/colors')
var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;



class Limbo extends React.Component{

  render(){
    return <Text>LIMBO</Text>
  }
}

class PrivacyScreen extends React.Component{

  constructor(props){

    super(props);

    this.state = {
      selection: null
    }
  }

  _selectPublic(){
    console.log(this.state.selection)

    this.setState({
      selection: this.state.selection == 'public' ? null : 'public'
    })
  }

  _selectPrivate(){
    console.log(this.state.selection)

    this.setState({
      selection: this.state.selection == 'private' ? null : 'private'
    })

  }
  _continue(){
    console.log(this.state.selection)
    UserActions.updateUserStub({privacy: this.state.selection,status:'onboarded'});

    this.props.navigator.push({
            component: Limbo,
            id: 'limbo'

          })

  }
  render() {

    return (
      <View style={[styles.container]}>
        <View style={styles.topWrap}>
          <Text style={styles.labelText}>{"Your Privacy"} </Text>

          <Text style={styles.labelText}>{"Select your perfered privacy setting"}</Text>
          <TouchableHighlight
            style={{marginTop:50}}
              onPress={this._selectPublic.bind(this)}>
              <View style={[styles.privacyWrap,
                  (this.state.selection == 'public' ? styles.selectedbutton : null)]}>

                <Text style={styles.boxTitle}>Public</Text>
                <Text style={styles.boxP}>Your profile is visible to all Trippple members</Text>

                <Image source={this.state.selection == 'private' ? require('image!ovalSelected') : require('image!ovalSelected')}
                          resizeMode={Image.resizeMode.contain}
                              style={{height:10,width:10}}/>
              </View>


          </TouchableHighlight>

          <TouchableHighlight
            style={{marginTop:50}}
            onPress={this._selectPrivate.bind(this)}>
            <View style={[styles.privacyWrap,
                (this.state.selection == 'private' ? styles.selectedbutton : null)]}>

              <Text style={styles.boxTitle}>Private</Text>
              <Text style={styles.boxP}>Your profile is hidden from your facebook friends and phone contacts.</Text>

              <Image source={this.state.selection == 'private' ? require('image!ovalSelected') : require('image!ovalSelected')}
                        resizeMode={Image.resizeMode.contain}
                            style={{height:50,width:50,position:'absolute',top:0,right:0}}/>
            </View>

          </TouchableHighlight>

        </View>

        <View style={[styles.continueButtonWrap,
            {
              bottom: this.state.selection ? 0 : -80,
              backgroundColor: this.state.selection ? colors.mediumPurple : 'transparent'
            }]}>
          <TouchableHighlight
             style={[styles.continueButton]}
             onPress={this._continue.bind(this)}
             underlayColor="black">

             <Text style={styles.continueButtonText}>CONTINUE</Text>
           </TouchableHighlight>
        </View>
      </View>
    );
  }


}


var styles = StyleSheet.create({

  container: {
    flex: 1,
    height: DeviceHeight,
    width: DeviceWidth,
    padding:0,
    flexDirection:'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace
  },
  topWrap:{
    justifyContent: 'center',
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    alignSelf:'stretch',

  },
  privacyWrap:{
    justifyContent: 'center',
    flex: 1,
    flexDirection:'column',
    alignItems: 'flex-start',
    alignSelf:'stretch',
    width: DeviceWidth-40,
    padding:10,
    borderWidth:2,
    borderColor:colors.shuttleGray,
    height:90
  },

  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'left',

  },


selectedbutton:{
  backgroundColor:colors.mediumPurple20,
  borderWidth:2,
  borderColor:colors.mediumPurple
},



  boxTitle:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 18,
    textAlign: 'left'
  },


    boxP:{
      color: colors.white,
      fontFamily: 'Omnes',
      fontSize: 14,
      textAlign: 'left'
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


module.exports = PrivacyScreen;
