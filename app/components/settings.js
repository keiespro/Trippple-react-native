/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput,
 ScrollView,
 Image,
 Navigator
} = React;

var DistanceSlider = require('../controls/distanceSlider');
var ToggleSwitch = require('../controls/switches');

var ImageUpload = require('./imageUpload');

var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: '#ffffff',
   padding: 0,
   alignItems: 'stretch',
   overflow:'hidden'
 },
 card: {
   backgroundColor: '#aaa',
   padding: 0,
   borderRadius: 5,
   overflow: 'hidden',
   margin: 20,
   flex:1,
   alignItems: 'stretch',
 },
 userimageContainer: {
   padding: 0,
   margin: 0,
   alignItems: 'stretch'

 },
 userimage: {
   padding:0,
   height: 400,
   alignItems: 'stretch',

 },
 changeImage: {
   position:'absolute'
 },
 formRow: {
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'space-around',
   padding: 5
 },
 formLabel: {
   flex: 8,
   fontSize: 18,
   fontFamily:'omnes'
 }
});

class SingleLookingFor extends React.Component{
  render(){
    return (
      <View style={styles.card}>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Male + Male</Text>
          <ToggleSwitch/>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Male + Female</Text>
          <ToggleSwitch/>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Female + Female</Text>
          <ToggleSwitch/>
        </View>
      </View>
    )
  }
}

class CoupleLookingFor extends React.Component{
  render(){
    return (
      <View style={styles.card}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Male</Text>
          <ToggleSwitch/>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Female</Text>
          <ToggleSwitch/>
        </View>
      </View>
    )
  }
}
class Settings extends React.Component{

  constructor(props){
    super(props);
    this.state = {
    }
  }

_pressNewImage(){
  this.props.navigator.push({
      component: ImageUpload,
      id:'photo',
      index: 4,
      title: 'photo',
      passProps:{
        index: 4,
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
    })
}
render(){
  console.log(this.props);
  return (
    <View style={styles.container}>
      <ScrollView
        contentInset={{top: 50}}
        pointerEvents={'box-none'}
        >
      <Text>Settings</Text>

      <View style={styles.card}>

        <View style={styles.userimageContainer}>
          <Image
            style={styles.userimage}
            source={{uri: this.props.user.image_url}}
            defaultSource={require('image!defaultuser')}
            resizeMode={Image.resizeMode.cover}
          />
          <TouchableHighlight style={styles.changeImage}>
            <Text>Change Image</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          onPress={this._pressNewImage.bind(this)}
          >
          <Text>Change Image</Text>

        </TouchableHighlight>

      </View>

      <Text>Looking For</Text>
      {this.props.user.relationship_status == 'couple' ?
        <CoupleLookingFor/> :
        <SingleLookingFor/>
      }

       <View style={styles.card} pointerEvents={'box-none'}>
         <DistanceSlider/>
       </View>

     </ScrollView>

     </View>
   );
 }
}

module.exports = Settings;
