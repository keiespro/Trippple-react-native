'use strict';
var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
} = React;


var colors = require('../../utils/colors')
var UserActions = require('../../flux/actions/UserActions')
var BoxyButton = require('../../controls/boxyButton')
var NameScreen = require('./name');
var Contacts = require('../contacts');

var InvitePartner = React.createClass({





  onPress(){


    this.props.navigator.push({
             component: Contacts,
             title: 'Contacts',
             id:'contacts'
           })
  },


  goBack(){
    this.props.navigator.pop()
  },



  render() {
    return (
      <View style={styles.container}>

        <View style={[styles.middleTextWrap,styles.pushDown]}>
          <Text style={styles.middleText}>Invite Your Partner </Text>
          <Text style={[styles.middleText,styles.middleTextSmall]}>Select your Partner in your address book to invite them to Trippple</Text>
        </View>

        <BoxyButton
            text={"INVITE YOUR PARTNER"}
            leftBoxStyles={styles.iconButtonLeftBoxCouples}
            innerWrapStyles={styles.iconButtonCouples}
            _onPress={this.onPress}>

            <Image source={require('image!oval2')}
                      resizeMode={Image.resizeMode.cover}
                          style={{height:30,width:30,right:-5}} />

            <Image source={require('image!oval2')}
                      resizeMode={Image.resizeMode.cover}
                          style={{height:30,width:30,left:-5,top:0}}/>
        </BoxyButton>

        <View style={[styles.middleTextWrap,styles.underPinInput]}>
          <TouchableHighlight
            onPress={this.goBack}>
            <View style={styles.goBackButton}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon]}>◀︎ </Text>
              <Text textAlign={'left'} style={[styles.bottomText]}>Go back</Text>
            </View>
          </TouchableHighlight>


        </View>









      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    padding:20
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    textAlign:'center',
    fontFamily:'Montserrat',
  },
  middleTextSmall:{
    fontSize: 17
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  goBackButton:{
    padding:10,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
  underPinInput: {
    marginTop: 10,
    height: 30,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
  },
  pushDown:{
    marginBottom:20
  }
});

module.exports = InvitePartner;
