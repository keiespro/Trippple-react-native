/* @flow */


var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ScrollView,
  Image,
  PickerIOS
} = React;

var PickerItemIOS = PickerIOS.Item;
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var DistanceSlider = require('../controls/distanceSlider');
var ToggleSwitch = require('../controls/switches');

var ImageUpload = require('./imageUpload');
var Privacy = require('./privacy');
var Modal = require('react-native-modal');

var FeedbackButton = require('./sections/feedbackButton');
var Contacts = require('./sections/contacts');


var bodyTypes = [
  'Athletic',
  'Average',
  'Curvy',
  'Heavy set',
  'Slender',
  'Stocky',
  'Rather not say'
];

var EditSettings = React.createClass({
  getInitialState(){
    return{
      firstname: this.props.user.firstname  || '',
      bio: this.props.user.bio || '',
      email: this.props.user.email  || '',
      body_type: null,
    }
  },

  _pressNewImage(){
    console.log('change image');
    this.props.openModal('imageupload');

  },
  _updateAttr(updatedAttribute){
    this.setState(()=>{return updatedAttribute});
  },
  render(){
    return(
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
          onChangeText={(text) => this._updateAttr({firstname: text})}
        />
      </View>
      <View style={styles.formRow}>
        <TextInput
          style={styles.textfield}
          value={this.state.email}
          onChangeText={(text) => this._updateAttr({email: text})}
        />
      </View>
      <View style={styles.formRow}>
        <TextInput
          style={[styles.textfield]}
          value={this.state.bio}
          onChangeText={(text) => this._updateAttr({bio: text})}
        />
      </View>
      <View style={[styles.tallFormRow]}>
        <Text style={styles.formLabel}>Body Type</Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.body_type}
          key={'bodytypepick'}
          onValueChange={(body_type) => this._updateAttr({body_type: body_type})}>

          {bodyTypes.map( (bodyType, index) => (
              <PickerItemIOS
                key={'bodyType-' + index}
                value={index}
                label={bodyType}
              />
          ))}
        </PickerIOS>
      </View>
    </View>)
  }
})

var ViewSettings = React.createClass({


  render(){
    return(
    <View style={styles.card}>
      <View style={styles.userimageContainer}>
        <Image
          style={styles.userimage}
          source={{uri: this.props.user.image_url}}
          defaultSource={require('image!defaultuser')}
          resizeMode={Image.resizeMode.cover}/>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.textfield} >{this.props.user.firstname}</Text>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.textfield} >{this.props.user.email || ''}</Text>
      </View>
      <View style={styles.formRow}>
        <Text style={[styles.textfield]} >{this.props.user.bio || ''}</Text>
      </View>
      <View style={[styles.tallFormRow]}>
        <Text style={styles.formLabel}>Body Type</Text>
        <Text style={styles.textfield}>{this.props.user.body_type || ''}</Text>
      </View>
    </View>
    )
  }
})

class Settings extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false,
      editMode: false
    }
  }

  openModal(page: string) {
    this.setState({isModalOpen: page});
  }

  closeModal() {
    this.setState({isModalOpen: false});
  }

  showModalTransition(transition) {
    transition('opacity', {duration: 200, begin: 0, end: 1});
    transition('height', {duration: 200, begin: DeviceHeight * 2, end: DeviceHeight});
  }

  hideModalTransition(transition) {
    transition('height', {duration: 200, begin: DeviceHeight, end: DeviceHeight * 2, reset: true});
    transition('opacity', {duration: 200, begin: 1, end: 0});
  }


  _openEditMode(){
    this.setState({
      editMode: true
    })
  }

  _closeEditMode(){
    this.setState({
      editMode: false
    })
  }

  _saveSettings(){

    //SAVE
    this._closeEditMode();
  }

  _renderPrivacy(){
    this.openModal('privacy')
  }


  _renderInviteFriends(){
    this.openModal('invite')
  }
  _handleBackdropPress(){

  }

  render(){
    var modalWindow = ()=>{
      if(!this.state.isModalOpen) return false;
      switch (this.state.isModalOpen){
        case 'privacy':
        return (<Privacy key={"modalw"}  user={this.props.user}/>);
        case 'imageupload':
          return (<ImageUpload key={"modalw"} user={this.props.user}/>);
        case 'invite':
          return (<Contacts key={"modalw"} user={this.props.user}/>);
        case 'default':
          return null;
      }
    }
    var ContentWrapper;
    var wrapperProps = {};
    if(this.state.isModalOpen){
      ContentWrapper = View;

    }else{
      ContentWrapper = ScrollView;
      wrapperProps = {
        automaticallyAdjustContentInsets:true,
        canCancelContentTouches:true,
        directionalLockEnabled:true,
        pointerEvents:'box-none',
        alwaysBounceVertical:true,
        decelerationRate:.9,
        showsVerticalScrollIndicator:false,
        contentInset:{top: 80},
      }
    }

    return (
      <View style={styles.container}>
        <ContentWrapper
          style={styles.inner}
          {...wrapperProps} >


            <TouchableHighlight onPress={this._openEditMode.bind(this)}>
              <Text style={styles.header}>Edit</Text>
            </TouchableHighlight>

            {this.state.editMode === true ?
              <EditSettings openModal={this.openModal} user={this.props.user}/> :
              <ViewSettings user={this.props.user}/>
            }

            <Text style={styles.header}>Privacy</Text>
            <View style={[styles.card]}>
              <TouchableHighlight onPress={this._renderPrivacy.bind(this)}>
                <Text style={[styles.header,styles.privacy]}>{this.props.user.privacy}</Text>
              </TouchableHighlight>
            </View>

            <TouchableHighlight onPress={this._renderInviteFriends.bind(this)}>
              <Text style={[styles.header,styles.privacy]}>Invite Friends</Text>
            </TouchableHighlight>

            <FeedbackButton />

         </ContentWrapper>

         <Modal
           isVisible={this.state.isModalOpen != false}
           onPressBackdrop={this._handleBackdropPress.bind(this)}
           backdropType={'blur'}
           hideCloseButton={false}
           backdropBlur={'light'}
           forceToFront={true}
           customShowHandler={this.showModalTransition}
           customHideHandler={this.hideModalTransition}
           style={styles.modalwrap}
           onClose={() => this.closeModal.bind(this)}
           customCloseButton={<TouchableHighlight onPress={() => this.closeModal.bind(this)} style={styles.closebox}><Text>X</Text></TouchableHighlight>}
           >
            <View
              style={styles.modal}>
              {modalWindow()}
           </View>
         </Modal>

       </View>
     );
  }
}

module.exports = Settings;

var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: '#ffffff',
   alignItems: 'stretch',
   overflow:'hidden'
 },
 inner:{
   padding: 0,

 },
 card: {
   backgroundColor: '#eee',
   padding: 0,
   borderRadius: 5,
   borderColor:'#ccc',
   borderWidth:0,
   marginBottom:15,
   overflow: 'hidden',
   margin: 0,
   flex:1,
   flexDirection:'column',
   alignItems: 'stretch',
 },
 red: {
   backgroundColor: 'red',
   height:300,
   width:300
 },

 userimageContainer: {
   padding: 0,
   margin: 0,
   alignItems: 'stretch'

 },
 closebox:{
   height:40,
   width:40,
   backgroundColor:'blue'
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
   justifyContent: 'center',
   paddingLeft: 15,
   paddingRight:15,
   backgroundColor:'#fff',
   height:60,
 },
 tallFormRow: {
   width: 250,
   left:0,
   height:220,
   alignSelf:'stretch',
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'center'
 },
 sliderFormRow:{
   height:160,
   paddingLeft: 30,
   paddingRight:30
 },
 picker:{
   height:200,
   alignItems: 'stretch',
   flexDirection: 'column',
   alignSelf:'flex-end',
   justifyContent:'center',
 },
 halfcell:{
   width:DeviceWidth/2,
   alignItems: 'center',
   alignSelf:'center',
   justifyContent:'space-around'


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
 },
 modal:{
   padding:0,
   height:DeviceHeight-100,
   flex:1,
   alignItems: 'stretch',
   alignSelf: 'stretch',

 },
 modalwrap:{
   padding:0,
   paddingLeft:0,
   paddingRight:0,
   paddingTop:0,
   margin:0,
   paddingBottom:0,
   backgroundColor:'red'
 }
});
