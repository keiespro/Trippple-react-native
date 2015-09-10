/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  AlertIOS,
  TextInput,
  ListView,
  TouchableHighlight,
  Dimensions
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import Modal from 'react-native-modal'
import UserActions from '../flux/actions/UserActions'
import CoupleImage from './registration/CoupleImage'
import { AddressBook } from 'NativeModules'
import colors from '../utils/colors'
import _ from 'underscore'
import Facebook from './registration/facebook'

class ContactList extends Component{

  constructor(props) {
    super(props);
    this.state = {}

  }
  onPress(sectionID,rowID,rowData){
    console.log('contact list onPress',sectionID,rowID,rowData);
    // this.setState({
    //   highlightedRow: {sectionID,rowID}
    //})
    // this.refs[`${ID}contact`].setNativeProps({
    //   backgroundColor: colors.mediumPurple20,
    //   borderColor: colors.mediumPurple,
    //   borderWidth: 1
    // })


    this.props.onPress( { sectionID, rowID, rowData } );

  }


  _renderRow(rowData, sectionID: number, rowID: number, highlightRow) {
    var phoneNumber = rowData.phoneNumbers && rowData.phoneNumbers[0] ? rowData.phoneNumbers[0].number : '';
    // console.log(sectionID, rowID)

    if(this.props.highlightedRow && this.props.highlightedRow.rowID === rowID){
      console.log('HIGHLIGHT')
    }

    return (
        <TouchableHighlight
          underlayColor={colors.mediumPurple20}
          onPress={()=>{
            this.onPress(sectionID,rowID,rowData);
            highlightRow(sectionID,rowID)
          }}
          key={`rowID${rowData.id}`}>
          <View style={[styles.fullwidth,styles.row,
            (this.props.highlightedRow && this.props.highlightedRow.sectionID === sectionID && this.props.highlightedRow.rowID === rowID ? styles.rowSelected : null)]}>

            <Image style={styles.contactthumb} source={rowData.thumbnailPath !== '' ? {uri: rowData.thumbnailPath} : require('image!placeholderUser')} />

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


    );
  }

  render(){

    return (
        <ListView
          removeClippedSubviews={true}
          initialListSize={100}
          ref={'thelist'}
          scrollRenderAheadDistance={1000}
          contentContainerStyle={styles.fullwidth}
          dataSource={this.props.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>{
                    return(<View style={styles.separator} />)
                  }}
        />
    );
  }
}



class Contacts extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      contacts: [],
      partnerSelection:{},
      dataSource: ds.cloneWithRows([]),
      searchText: '',
      modalVisible: false,
      highlightedRow: null
    }
  }
  _pressRow(contact){

    console.debug(contact);

    this.setState({
      partnerSelection: contact.rowData,
      highlightedRow: contact,
      modalVisible: true
    })
  }

  closeModal(){
    this.setState({modalVisible: false});
  }

  componentDidMount(){
    this.getContacts();
  }
  _requestPermission(){
    AddressBook.requestPermission((err, permission) => {
      if(err){
          //TODO:  handle err;
      }
      this.storeContacts()
    })
  }
  storeContacts(){
    AddressBook.getContacts((err, contacts) => {
      console.log(err);

      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      // InteractionManager.runAfterInteractions(() => {

        this.setState({
          contacts: contacts,
          dataSource: ds.cloneWithRows(contacts)
        });
      // });
    })
  }
  componentWillUnmount(){
    console.debug('UNmount contacts')
  }
  getContacts(){
     AddressBook.checkPermission((err, permission) => {
       if(err){
         console.log(err)
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
            {text: 'Try Again', onPress: () => console.log('GO TO SETTINGS TO ALLOW CONTACTS?!')},
            {text: 'Nevermind I\'m single.', onPress: () => this.props.navigator.popToTop()},
          ]
        )
      }
    })
  }
  askPermissions(){
    AddressBook.requestPermission((err, permission) => {
      if(err){
      //TODO:  handle err;
      }
      this.getContacts()
    })
  }
  _searchChange(text){
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    const shouldScrollToTop = text.length === 1 && this.state.searchText.length === 0

    const listref = this.refs.contactlist.refs.thelist
    console.log(text,shouldScrollToTop)

    shouldScrollToTop ? listref.setNativeProps({ contentOffset: { y: 0 }}) : null

    this.setState({
      searchText: text,
      dataSource: ds.cloneWithRows(_.filter(this.state.contacts, (contact)=>{
        var name = `${contact.firstName || ''} ${contact.lastName || ''}`;
        return name.toLowerCase().indexOf(text.toLowerCase()) >= 0
      }))
    });

  }
  _continue(){
    this.closeModal();
    this.props.navigator.push({
      component: Facebook,
      passProps: {
        partner: this.state.partnerSelection
      }
    })
    UserActions.selectPartner(this.state.partnerSelection)

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
        <View style={styles.searchwrap}>
          <Image source={require('image!search')} style={styles.searchicon}/>
          <TextInput
            ref="searchinput"
            style={styles.searchfield}
            textAlign="center"
            placeholder="SEARCH"
            clearButtonMode="always"
            placeholderTextColor={colors.white}
            onChangeText={this._searchChange.bind(this)}
          />
        </View>

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


      <Modal
        visible={this.state.modalVisible}
        onPressBackdrop={this._cancel.bind(this)}
        onClose={() => this.closeModal.bind(this)}
      >
        <Image style={styles.modalcontainer} source={require('image!GradientBG')}>
          <View style={[styles.col]}>

          <Image style={[styles.contactthumb,{width:100,height:100,borderRadius:50}]}
                source={this.state.partnerSelection.thumbnailPath !== '' ? {uri: this.state.partnerSelection.thumbnailPath} : require('image!placeholderUser')} />

            <View style={styles.rowtextwrapper}>

              <Text style={[styles.rowtext,styles.bigtext]}>
                {`Invite ${this.state.partnerSelection.firstName || ''} ${this.state.partnerSelection.lastName || ''}`}
              </Text>
              <Text style={styles.text}>
                { this.state.partnerSelection
                    && this.state.partnerSelection.phoneNumbers
                    && this.state.partnerSelection.phoneNumbers.length
                    && this.state.partnerSelection.phoneNumbers[0].number  || '' }

              </Text>

            </View>
            <View style={styles.rowtextwrapper}>

              <TouchableHighlight style={styles.plainButton} onPress={this._continue.bind(this)}>
                <View >
                 <Text style={styles.plainButtonText}>INVITE</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.plainButton} onPress={this._cancel.bind(this)}>
                <View >
                <Text style={styles.plainButtonText}>CANCEL</Text>
                </View>
              </TouchableHighlight>
            </View>

          </View>
        </Image>
      </Modal>
    </View>

    );
  }

}

export default Contacts;

var styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.outerSpace,
    alignSelf:'stretch',
    flexDirection: 'column',

  },
  modalcontainer:{
    backgroundColor: colors.mediumPurple20,
    flex:1,
    width: DeviceWidth-50,
    height: DeviceHeight-100,
    top:50,
    left:25,
    right:25,
    bottom:50
  },
  fullwidth:{
    width: DeviceWidth
  },
  row: {
    flexDirection: 'row',
    padding: 0,
    alignSelf:'stretch',
    height:70,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  col: {
    flexDirection: 'column',
    padding: 0,
    alignSelf:'stretch',
    flex: 1,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center'
  },
  text:{
    color: colors.shuttleGray,
    fontFamily:'omnes'
  },
  rowtext:{
    color: colors.white,
    fontSize:18,
    fontFamily:'omnes'
  },
  bigtext: {
    textAlign:'center',
    color: colors.white,
    fontSize:18,
    fontFamily:'Montserrat'
  },
  separator: {
    height: 1,
    backgroundColor: colors.outerSpace,
  },
  rowtextwrapper:{
    flexDirection:'column',
    justifyContent:'space-around'
  },
  rowSelected:{
    backgroundColor: colors.mediumPurple20,
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  searchwrap:{
    flexDirection: 'row',
    justifyContent: 'center',
    height:60,
    alignSelf:'stretch',
    alignItems:'center',
    borderBottomWidth: 2,
    marginHorizontal:10,
    borderBottomColor: colors.mediumPurple
  },
  searchfield:{
    color:colors.white,
    fontSize:20,
    alignItems: 'stretch',
    flex:1,
    paddingHorizontal:10,
    fontFamily:'omnes',
    height:60,
    backgroundColor: 'transparent',

  },
  wrapper:{
    backgroundColor: colors.outerSpace,

  },
  contactthumb:{
    borderRadius: 25,
    width:50,
    height:50,
    marginHorizontal:10
  },
  searchicon:{
    top:20,
    left:10,
    position:'absolute',
    width:20,
    height:20
  },
  plainButton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    height:70,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center',
  },
  plainButtonText:{
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'Montserrat',
    textAlign:'center',
  },
})
