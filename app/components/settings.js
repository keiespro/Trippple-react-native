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
var Privacy = require('./privacy');



var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: '#ffffff',
   alignItems: 'stretch',
   overflow:'hidden'
 },
 inner:{
   padding: 20,

 },
 card: {
   backgroundColor: '#eee',
   padding: 0,
   borderRadius: 5,
   borderColor:'#ccc',
   borderWidth:1,
   marginBottom:15,
   overflow: 'hidden',
   margin: 0,
   flex:1,
   flexDirection:'column',
   alignItems: 'stretch',
   justifyContent:'center'
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
   position:'relative'
 },
 changeImage: {
   position:'absolute',
   color:'#fff',
   fontSize:22,
   top:370,
   right:0,
   fontFamily:'omnes',
   alignItems:'flex-end'
 },
 formRow: {
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'space-around',
   paddingLeft: 15,
   paddingRight:15,
   backgroundColor:'#fff',
   height:60
 },
 privacy:{
   height:100,
   alignItems: 'center',
   flexDirection: 'column',
   paddingVertical: 30,
   paddingHorizontal:20
 },
 formLabel: {
   flex: 8,
   fontSize: 18,
   fontFamily:'omnes'
 },
 header:{
   fontSize:24,
   fontFamily:'omnes'

 },
 textfield:{
   color:'#111',
   backgroundColor:'#fff',
   fontSize:18,
   alignItems: 'stretch',
   flex:1,
   fontFamily:'omnes',
   height:60
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
    console.log(props)
    this.state = {
      firstname: props.user.firstname
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

_renderPrivacy(){
  console.log(this.props.navigator)
  this.props.navigator.push({
      component: Privacy,
      id:'privacy',
      title: 'privacy',
      passProps:{
        privacy: this.props.user.privacy,
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
    })
}

render(){
  console.log(this.state);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.inner}
        automaticallyAdjustContentInsets={true}
        canCancelContentTouches={true}
        directionalLockEnabled={true}
        pointerEvents={'box-none'}
        alwaysBounceVertical={true}
        decelerationRate={.9}
        showsVerticalScrollIndicator={false}
        contentInset={{top: 80}}
        >
      <Text>Settings</Text>

      <View style={styles.card}>
        <View style={styles.userimageContainer}>
          <Image
            style={styles.userimage}
            source={{uri: this.props.user.image_url}}
            defaultSource={require('image!defaultuser')}
            resizeMode={Image.resizeMode.cover}>
            <TouchableHighlight onPress={this._pressNewImage.bind(this)}>
              <Text style={styles.changeImage}>Change Image</Text>
            </TouchableHighlight>
          </Image>
        </View>
        <View style={styles.formRow}>
          <TextInput
            style={styles.textfield}
            value={this.state.firstname}
            onChangeText={(text) => this.setState({firstname: text})}
          />
        </View>
      </View>

      <Text style={styles.header}>Privacy</Text>
      <View style={[styles.card]}>
        <TouchableHighlight onPress={this._renderPrivacy.bind(this)}>
          <Text style={[styles.header,styles.privacy]}>{this.props.user.privacy}</Text>
        </TouchableHighlight>

      </View>

      <Text style={styles.header}>Looking For</Text>
      {this.props.user.relationship_status == 'couple' ?
        <CoupleLookingFor/> :
        <SingleLookingFor/>
      }

      <Text style={styles.header}>Looking For</Text>
       <View style={styles.card} pointerEvents={'box-none'}>
         <DistanceSlider/>
       </View>

     </ScrollView>

     </View>
   );
 }
}

module.exports = Settings;
