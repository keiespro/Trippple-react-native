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
  onPress(sectionID,rowID){
    console.log(sectionID,rowID);
    // this.setState({
    //     selection: ID
    //   })
    // this.refs[`${ID}contact`].setNativeProps({
    //   backgroundColor: colors.mediumPurple20,
    //   borderColor: colors.mediumPurple,
    //   borderWidth: 1
    // })
    this.props.onPress(sectionID,rowID);
    console.log(this.props.selection);

  }


  _renderRow(rowData, sectionID: number, rowID: number, highlightRow) {
    var phoneNumber = rowData.phoneNumbers && rowData.phoneNumbers[0] ? rowData.phoneNumbers[0].number : "";
    if( this.state.highlightedRow['rowID'] == rowID){
      highlightRow(rowID);
    }
    console.log(this.props.selection);
    return (
        <TouchableHighlight underlayColor={colors.mediumPurple20} onPress={()=>{this.onPress(sectionID,rowID); highlightRow(sectionID,rowID)}} ref={rowID+'contact'} key={rowID+'contact'}>
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
      selection:null,
      dataSource: ds.cloneWithRows([])
    }
  }
  _pressRow(highlightedRow) {

    Logger.debug(highlightedRow);

    this.setState({
      selection: highlightedRow
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
  render(){

    return (
      <View style={styles.container} noScroll={true}>
        <View style={styles.searchwrap}>
          <Image source={require('image!search')} style={styles.searchicon}/>
          <TextInput
            style={styles.searchfield}
            textAlign="center"
            placeholder="SEARCH"
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

    );
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
  text:{
    color: colors.shuttleGray,
    fontFamily:'omnes'
  },
  rowtext:{
    color: colors.white,
    fontSize:18,
    fontFamily:'omnes'
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
    height:70,
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
    width:30,
    height:30
  }
})
