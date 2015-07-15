/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TextInput,
 ListView,
 AlertIOS,
 InteractionManager,
 TouchableHighlight
} = React;
var Logger = require("../utils/logger");

var AddressBook = require('NativeModules').AddressBook;
var colors = require('../utils/colors');
var _ = require('underscore');

class ContactList extends React.Component{

  constructor(props) {
    super(props);

  }


  _renderRow(rowData, sectionID: number, rowID: number) {


    return (
      <TouchableHighlight style={styles.row} onPress={() => this._pressRow(rowID)} key={rowID+'contact'}>
        <View>

          <Text style={styles.text}>
            {`${rowData.firstName || ''} ${rowData.lastName || ''}`}
          </Text>


          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
  _pressRow(e) {

    Logger.debug(e);
  }
  render(){

    return (
        <ListView
        contentContainerStyle={styles.fullwidth}
          dataSource={this.props.dataSource}
          renderRow={this._renderRow.bind(this)}
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
      dataSource: ds.cloneWithRows([])
    }
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
        <View style={styles.textwrap}>
          <TextInput
            style={styles.textfield}
            onChangeText={this._searchChange.bind(this)}
          />
        </View>

          <ContactList
            user={this.props.user}
            dataSource={this.state.dataSource}
            contacts={this.state.contacts}
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
    backgroundColor: 'transparent',

  },
  fullWidth:{
    flex: 1
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    alignSelf:'stretch',
    height:64,
    width:undefined,
    flex: 1,
    backgroundColor: 'transparent',
  },
  text:{
    color: colors.shuttleGray,

  },
  separator: {
    height: 1,
    backgroundColor: colors.mediumPurple,
  },
  textwrap:{
    flexDirection: 'column',
    justifyContent: 'center',
    height:70,
    alignSelf:'stretch',
    flex: 1,
    width:undefined,
  },
  textfield:{
    color:colors.white,
    backgroundColor:colors.outerSpace,
    fontSize:18,
    alignItems: 'stretch',
    flex:1,
    paddingHorizontal:10,
    fontFamily:'omnes',
    height:60
  },
  wrapper:{
    backgroundColor: colors.outerSpace,

  }
})
