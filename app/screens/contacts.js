/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 Image,
 View,
 TextInput,
 ListView,
 TouchableHighlight
} = React;
var Logger = require("../utils/logger");

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var Facebook = require('./registration/facebook');
var UserActions = require('../flux/actions/UserActions');

var AddressBook = require('NativeModules').AddressBook;
var colors = require('../utils/colors');
var _ = require('underscore');

class ContactList extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      highlightedRow: {}
    }

  }
  onPress(sectionID,rowID,rowData){
    console.log(sectionID,rowID,rowData);
    this.setState({
      highlightedRow: {sectionID,rowID}
    })
    // this.refs[`${ID}contact`].setNativeProps({
    //   backgroundColor: colors.mediumPurple20,
    //   borderColor: colors.mediumPurple,
    //   borderWidth: 1
    // })

    UserActions.updateUserStub({gender: this.state.selection});

    this.props.onPress(rowData);

  }


  _renderRow(rowData, sectionID: number, rowID: number, highlightRow) {
    var phoneNumber = rowData.phoneNumbers && rowData.phoneNumbers[0] ? rowData.phoneNumbers[0].number : "";
    console.log(sectionID, rowID)

    if( this.state.highlightedRow['rowID'] == rowID){
      console.log('HIGHLIGHT')
    }
    console.log(this.props.selection);
    return (
        <TouchableHighlight underlayColor={colors.mediumPurple20} onPress={()=>{

          highlightRow(rowID);
          this.onPress(sectionID,rowID,rowData); highlightRow(sectionID,rowID)
        }} ref={rowID+'contact'} key={rowID+'contact'}>
          <View style={[styles.fullwidth,styles.row,
            (this.state.highlightedRow.sectionID == sectionID && this.state.highlightedRow.rowID == rowID ? 'rowSelected' : null)]}>

            <Image style={styles.contactthumb} source={rowData.thumbnailPath != "" ? {uri: rowData.thumbnailPath} : require('image!placeholderUser')} />

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



class Contacts extends React.Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      contacts: [],
      partnerSelection:{},
      dataSource: ds.cloneWithRows([])
    }
  }
  _pressRow(contact) {

    Logger.debug(contact);

    this.setState({
      partnerSelection: contact
    })
  }
  componentDidMount(){


    AddressBook.checkPermission((err, permission) => {
      // AddressBook.PERMISSION_AUTHORIZED || AddressBook.PERMISSION_UNDEFINED || AddressBook.PERMISSION_DENIED
      if(permission === AddressBook.PERMISSION_UNDEFINED){
        AddressBook.requestPermission((err, permission) => {
          this.storeContacts()
        })
      }
      if(permission === AddressBook.PERMISSION_AUTHORIZED){
        this.storeContacts()
      }
      if(permission === AddressBook.PERMISSION_DENIED){
        //handle permission denied
      }
    })

  }

  storeContacts(){
    AddressBook.getContacts((err, contacts) => {
      Logger.log(err);

      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      // InteractionManager.runAfterInteractions(() => {

        this.setState({
          contacts: contacts,
          dataSource: ds.cloneWithRows(contacts)
        });
      // });
    })
  }
  componentWillUnmount() {
    Logger.debug('UNmount contacts')


  }
  _searchChange(text){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.setState({
      dataSource: ds.cloneWithRows(_.filter(this.state.contacts, (contact)=>{
        var name = `${contact.firstName || ''} ${contact.lastName || ''}`;
        return name.toLowerCase().indexOf(text.toLowerCase()) >= 0
      }))
    });
  }
  continue(){

      this.props.navigator.push({
        component: Facebook,
        id: 'fb',
        passProps: {
          partner: this.state.partnerSelection
        }
    })

  }
  cancel(){
    this.setState({
      partnerSelection: {}
    });

  }
  render(){

      if(this.state.partnerSelection && !this.state.partnerSelection.phoneNumbers){
        return (

      <View style={styles.container} noScroll={true}>
        <View style={styles.searchwrap}>
          <Image source={require('image!search')} style={styles.searchicon}/>
          <TextInput
            style={styles.searchfield}
            textAlign="center"
            placeholder="SEARCH"
            clearButtonMode="always"
            placeholderTextColor={colors.white}
            onChangeText={this._searchChange.bind(this)}
          />
        </View>

        <ContactList
          user={this.props.user}
          dataSource={this.state.dataSource}
          contacts={this.state.contacts}
          selection={this.state.selection}
          onPress={this._pressRow.bind(this)}
          id={"contactslist"}
          title={"contactlist"}
        />
      </View>
    )
  }else{
         return (
        <View style={styles.container}>
        <View style={[styles.fullwidth,styles.col]}>

          <Image style={[styles.contactthumb,{width:100,height:100,borderRadius:50}]} source={this.state.partnerSelection.thumbnailPath != "" ? {uri: this.state.partnerSelection.thumbnailPath} : require('image!placeholderUser')} />

          <View style={styles.rowtextwrapper}>

            <Text style={[styles.rowtext,styles.bigtext]}>
              {`${this.state.partnerSelection.firstName || ''} ${this.state.partnerSelection.lastName || ''}`}
            </Text>
            <Text style={styles.text}>
                {`${ 'xx' }`/* this.state.partnerSelection.phoneNumbers[0].number  || '' */}

            </Text>

          </View>

          <TouchableHighlight style={styles.plainButton} onPress={this.continue.bind(this)}>
            <Text style={styles.plainButtonText}>INVITE</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.plainButton} onPress={this.cancel.bind(this)}>
            <Text style={styles.plainButtonText}>CANCEL</Text>
          </TouchableHighlight>
        </View>
        </View>


    );
  }
  }
}
module.exports = Contacts;

var styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.outerSpace,
    alignSelf:'stretch',
    flexDirection: 'column',

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
  bigtext:{
    fontSize:30,
    textAlign:'center'
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
