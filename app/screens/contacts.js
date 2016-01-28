/* @flow */

import React from 'react-native'
import {
  StyleSheet,
  Text,
  Image,
  View,
  AlertIOS,
  TextInput,
  ListView,
  TouchableHighlight,
  Animated,
  Easing,
  Dimensions,
  Navigator,
  ActivityIndicatorIOS
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import UserActions from '../flux/actions/UserActions'
import CoupleImage from './registration/CoupleImage'
import { AddressBook } from 'NativeModules'
import colors from '../utils/colors'
import _ from 'underscore'
import Facebook from './registration/facebook'
import BackButton from './registration/BackButton'
import Api from '../utils/api'
import ConfirmPartner from './registration/ConfirmPartner'
import OnboardingActions from '../flux/actions/OnboardingActions'
import styles from './registration/contactStyles'

class ContactRow extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      uri: null
    }
  }
  // shouldComponentUpdate(nProps,nState){
  //   return nState.uri != this.state.uri
  // }
componentDidMount(){
  //
  if(this.props.imagePath && this.props.imagePath.length && this.props.imagePath.length != ''){
    React.NativeModules.RNFSManager.readFile(this.props.imagePath, (err,uri)=>{
      if(!uri || uri == ''){
      }else{
      this.setState({
        uri: 'data:image/gif;base64,'+uri
      })
    }
    })
  }
}
  // componentWillReceiveProps(nProps){
  //   if(nProps.execute){
  //     this.props.loadImage(
  //       (imageUri)=>{
  //
  //       this.setState({
  //         imageUri
  //       })
  //     })
  //   }
  // }
  render(){
    const {sectionID,rowID,rowData,imagePath,execute} = this.props
    var phoneNumber = rowData.phoneNumbers && rowData.phoneNumbers[0] ? rowData.phoneNumbers[0].number : '';

    if(this.props.highlightedRow && this.props.highlightedRow.rowID === rowID){
    }

  const hasPhone = rowData.phoneNumbers && rowData.phoneNumbers.length && rowData.phoneNumbers.length > 0 && rowData.phoneNumbers[0].number;
    return (
      <TouchableHighlight key={'contactrow'+rowID}
          underlayColor={colors.mediumPurple20}
          onPress={()=>{
            if(!hasPhone){
              AlertIOS.alert('No phone number','Unfortunately, this contact doesn\'t have a phone number we can recognize. Please selet another contact.');
            }else{
              this.props.onPress(sectionID,rowID,rowData,this.state.uri);
              this.props.highlightRow(sectionID,rowID)
            }
          }}>
          <View style={[styles.fullwidth,styles.row,
            (this.props.highlightedRow && this.props.highlightedRow.sectionID === sectionID && this.props.highlightedRow.rowID === rowID ? styles.rowSelected : null)]}>

            <Image style={[styles.contactthumb,{backgroundColor:colors.shuttleGray20}]} resizeMode={Image.resizeMode.cover}
               source={ (!this.state.uri || this.state.uri == null || this.state.uri == '' ? require('../../assets/placeholderUser.png'): {uri: (this.state.uri)})}/>

            <View style={styles.rowtextwrapper}>

              <Text style={styles.rowtext}>
                {`${rowData.firstName || ''} ${rowData.lastName || ''}`}
              </Text>
              <Text style={styles.text}>
                {`${phoneNumber || ''}`}
              </Text>

            </View>
          </View>
        </TouchableHighlight>
    )
  }

}


class ContactList extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: new Animated.Value(0),
      followIndex: new Animated.Value(0)
    }

  }
  onPress(sectionID,rowID,rowData,image){
    // this.setState({
    //   highlightedRow: {sectionID,rowID}
    //})
    // this.refs[`${ID}contact`].setNativeProps({
    //   backgroundColor: colors.mediumPurple20,
    //   borderColor: colors.mediumPurple,
    //   borderWidth: 1
    // })


    this.props.onPress( { sectionID, rowID, rowData, image } );

  }

  componentDidMount(){
    }
  _renderRow(rowData, sectionID: number, rowID: number, highlightRow) {
    return (

        <ContactRow rowData={rowData} rowID={rowID} sectionID={sectionID} highlightRow={highlightRow}
          highlightedRow={this.props.highlightedRow}
          imagePath={rowData.thumbnailPath}
          onPress={this.props.onPress}
          key={'contactrowel'+rowID+rowData.firstName}
          execute={true
             //this.state.currentValue == rowID
          }


          />

    );
  }

  render(){

    return (
        <ListView
          removeClippedSubviews={true}
          initialListSize={100}
          ref={'thelist'}
          pageSize={50}
          scrollRenderAheadDistance={2500}
          contentContainerStyle={styles.fullwidth}
          dataSource={this.props.dataSource}
          renderRow={this._renderRow.bind(this)}
          keyboardDismissMode={'on-drag'}
          renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>{
                    return(<View style={styles.separator} />)
                  }}
        />
    );
  }
}



class Contacts extends React.Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      contacts: [],
      partnerSelection:{},
      contactsLoaded: false,
      dataSource: ds.cloneWithRows([]),
      searchText: '',
      modalVisible: false,
      highlightedRow: null,
      modalBG: 'transparent'
    }
  }
  _pressRow(sectionID,contactID,contact,image){
    this.refs.searchinput.blur();
    // this.setState({
    //   highlightedRow: contact,
    // })

    this.props.navigator.push({
      component: ConfirmPartner,
      passProps: {
        partner: {...contact, image},
        _continue: this._continue.bind(this)
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,

    })
  }

  componentDidMount(){
    this.getContacts();
  }

  storeContacts(){

    AddressBook.getContacts((err, contacts) => {
      if(err){ return false; }
      this.setState({
        contacts: contacts,
        contactsLoaded: true,
        dataSource: this.state.dataSource.cloneWithRows(contacts)
      });
      // UserActions.handleContacts(contacts);

    })

  }

  nevermind(){
    this.props.navigator.popToTop()
    OnboardingActions.updateRoute(0)
  }


  getContacts(){
     AddressBook.checkPermission((err, permission) => {
       if(err){
        //TODO:  handle err;
      }

      // AddressBook.PERMISSION_AUTHORIZED || AddressBook.PERMISSION_UNDEFINED || AddressBook.PERMISSION_DENIED
      if(permission === AddressBook.PERMISSION_UNDEFINED){
        this.askPermissions();
      }
      if(permission === AddressBook.PERMISSION_AUTHORIZED){
        this.storeContacts()
      }
      if(permission === AddressBook.PERMISSION_DENIED){
        //handle permission denied

        //TODO: test this!
        AlertIOS.alert(
          '',
          'We need access to your contacts so you can select your partner.',
          [
            {text: 'Try Again', onPress: () => this.askPermissions()},
            {text: 'Nevermind I\'m single.', onPress: () => this.nevermind()},
          ]
        )
      }
    })
  }
  askPermissions(){
    AddressBook.requestPermission((err, permission) => {
      if(err){
        return
      //TODO:  handle err;
      }
      this.getContacts()
    })
  }
  _searchChange(text){
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    const shouldScrollToTop = text.length === 1 && this.state.searchText.length === 0

    const listref = this.refs.contactlist.refs.thelist

    shouldScrollToTop ? listref.setNativeProps({ contentOffset: { y: 0 }}) : null

    this.setState({
      searchText: text,
      dataSource: ds.cloneWithRows(_.filter(this.state.contacts, (contact)=>{
        const name = `${contact.firstName || ''}` +' '+ `${contact.lastName || ''}`;

        return name.toLowerCase().indexOf(text.toLowerCase()) >= 0
      }))
    });

  }
  _continue(){


    OnboardingActions.proceedToNextScreen()



  }
  _cancel(){
    this.setState({
      modalVisible: false,
      partnerSelection: {},
      highlightedRow: null

    });

  }
  render(){
    return (

      <View style={styles.container} noScroll={true}>
        <View style={{width:100,height:50,left:20}}>
          <BackButton />
        </View>

        <View style={styles.searchwrap}>
          <Image source={require('../../assets/search.png')} style={styles.searchicon}/>
          <TextInput
            ref="searchinput"
            style={styles.searchfield}
            textAlign="center"
            editable={this.state.contactsLoaded}
            placeholder="SEARCH"
            autoCorrect={false}
            clearButtonMode="always"
            placeholderTextColor={colors.shuttleGray}
            onChangeText={this._searchChange.bind(this)}
          />
        </View>
        {!this.state.contacts.length ? <View style={{width:DeviceWidth,height:DeviceHeight-60,flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicatorIOS
            animating={true}
            color={colors.white}
            size={'large'}
            style={{}} />

          <View style={{padding:20,marginTop:20}}>
            <Text style={[styles.rowtext]}>Loading your contacts...</Text>
          </View>
        </View> :
        <ContactList
          ref={'contactlist'}
          user={this.props.user}
          dataSource={this.state.dataSource}
          contacts={this.state.contacts}
          selection={this.state.selection}
          highlightedRow={this.state.highlightedRow}
          onPress={this._pressRow.bind(this)}
          id={"contactslist"}
          title={"contactlist"}
          />
      }

    </View>

    );
  }

}

export default Contacts;
