var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  LayoutAnimation,
} = React;

var UserActions = require('../../flux/actions/UserActions');
var colors = require('../../utils/colors')
var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
import BackButton from '../../components/BackButton'

import ContinueButton from '../../controls/ContinueButton'


class PrivacyScreen extends Component{

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
   var lastindex = this.props.navigator.getCurrentRoutes().length;
  console.log(lastindex);
  var nextRoute = this.props.stack[lastindex];

   nextRoute.passProps = {
        ...this.props,
        privacy: this.state.selection


    }
    this.props.navigator.push(nextRoute)


  }
  render() {

    return (
      <View style={[styles.container]}>
 <View style={{width:100,height:50,left:20,alignSelf:'flex-start'}}>
        <BackButton navigator={this.props.navigator}/>
      </View>

        <View style={styles.topWrap}>
          <Text style={[styles.labelText,{fontSize:20}]}>{"Your Privacy"} </Text>

          <Text style={[styles.labelText,{fontSize:20,marginBottom:20}]}>{"Select your perfered privacy setting"}</Text>




          <TouchableOpacity
            style={{margin:20}}
              onPress={this._selectPublic.bind(this)}>
              <View style={[styles.privacyWrap,
                  (this.state.selection == 'public' ? styles.selectedbutton : null)]}>
        <Image source={this.state.selection == 'public' ? require('image!ovalSelected') : require('image!ovalDashed')}
                          resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>

              <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'space-around',flex:1,width:100}}>
                <Text style={styles.boxTitle}>Public</Text>
                <Text style={styles.boxP}>Your profile is visible to all Trippple members</Text>
              </View>

            </View>


          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop:20}}
            onPress={this._selectPrivate.bind(this)}>
            <View style={[styles.privacyWrap,
                (this.state.selection == 'private' ? styles.selectedbutton : null)]}>

              <Image source={this.state.selection == 'private' ? require('image!ovalSelected') : require('image!ovalDashed')}
                        resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>
              <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'space-around',flex:1,width:100}}>
                <Text style={styles.boxTitle}>Private</Text>
                <Text style={styles.boxP}>Your profile is hidden from your facebook friends and phone contacts.</Text>
              </View>


            </View>

          </TouchableOpacity>


        </View>

        <ContinueButton canContinue={this.state.selection ? true : false} handlePress={this._continue.bind(this)} />

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
  // topWrap:{
  //   justifyContent: 'center',
  //   flex: 1,
  //   flexDirection:'column',
  //   alignItems: 'center',
  //   alignSelf:'stretch',

  // },
  // privacyWrap:{
  //   justifyContent: 'center',
  //   flex: 1,
  //   flexDirection:'column',
  //   alignItems: 'flex-start',
  //   alignSelf:'stretch',
  //   width: DeviceWidth-40,
  //   padding:10,
  //   borderWidth:2,
  //   borderColor:colors.shuttleGray,
  //   height:90
  // },

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



//   cornerDot: {
//     height:30,
//     width:30,
//     position:'absolute',
//     top:-15,
//     right:-15
//   },


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





  cornerDot: {
    height:30,
    width:30,
    marginLeft:10,
    marginRight:20
  },
  topWrap:{
    justifyContent: 'center',
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    alignSelf:'stretch',

  },
  privacyWrap:{
    justifyContent: 'flex-start',
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    alignSelf:'stretch',
    width: DeviceWidth-80,
    padding:10,
    borderWidth:2,
    borderColor:colors.shuttleGray,
    height:90,
    marginHorizontal:40
  },

  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'left',

  },


 });


module.exports = PrivacyScreen;





/*
 *     {/*
            <TouchableOpacity
            style={{marginTop:50}}
              onPress={this._selectPublic.bind(this)}>
              <View style={[styles.privacyWrap,
                  (this.state.selection == 'public' ? styles.selectedbutton : null)]}>

                <Text style={styles.boxTitle}>Public</Text>
                <Text style={styles.boxP}>Your profile is visible to all Trippple members</Text>

                <Image source={this.state.selection == 'public' ? require('image!ovalSelected') : require('image!ovalDashed')}
                          resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>

              </View>


          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop:50}}
            onPress={this._selectPrivate.bind(this)}>
            <View style={[styles.privacyWrap,
                (this.state.selection == 'private' ? styles.selectedbutton : null)]}>

              <Text style={styles.boxTitle}>Private</Text>
              <Text style={styles.boxP}>Your profile is hidden from your facebook friends and phone contacts.</Text>

              <Image source={this.state.selection == 'private' ? require('image!ovalSelected') : require('image!ovalDashed')}
                        resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>
            </View>

            </TouchableOpacity>

            */

