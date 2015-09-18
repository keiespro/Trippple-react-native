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
  Dimensions,
  Modal,TouchableWithoutFeedback,
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
import BackButton from '../components/BackButton'

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

    console.log(contact);
    this.refs.searchinput.blur();
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
    console.log('UNmount contacts')
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
        var name = `${contact.firstName || ''}`;
        var lastName = `${contact.lastName || ''}`;

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
 <View style={{width:100,height:50,left:20}}>
        <BackButton navigator={this.props.navigator}/>
      </View>

        <View style={styles.searchwrap}>
          <Image source={require('image!search')} style={styles.searchicon}/>
          <TextInput
            ref="searchinput"
            style={styles.searchfield}
            textAlign="center"
            placeholder="SEARCH"
            clearButtonMode="always"
            placeholderTextColor={colors.shuttleGray}
            onChangeText={this._searchChange.bind(this)}
          />
        </View>
        {!this.state.contacts.length ? <View style={{width:DeviceWidth,height:DeviceHeight-60,flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicatorIOS
            animating={true}
            color={colors.white}
            style={{}} /></View> :
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


      <Modal
      visible={this.state.modalVisible}
      transparent={true}
      animated={true}
      onPressBackdrop={this._cancel.bind(this)}

        onClose={() => this.closeModal.bind(this)}
        >
         <TouchableWithoutFeedback onPressIn={this._cancel.bind(this)} style={{position:'absolute',height:DeviceHeight,width:DeviceWidth}}>
            <View/>
          </TouchableWithoutFeedback>


        <Image style={styles.modalcontainer} source={require('image!GradientBG')}>
          <View style={[styles.col]}>
            <View style={styles.insidemodalwrapper}>

          <Image style={[styles.contactthumb,{width:150,height:150,borderRadius:75}]}
                source={this.state.partnerSelection.thumbnailPath !== '' ? {uri: this.state.partnerSelection.thumbnailPath} : require('image!placeholderUser')} />

            <View style={styles.rowtextwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:22,marginVertical:10
            }]}>
                {`INVITE ${this.state.partnerSelection.firstName || ''}`}
                </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:22,marginVertical:10
            }]}>{this.state.partnerSelection.phoneNumbers && this.state.partnerSelection.phoneNumbers.length > 1 ?
              `What number should we use to invite ${this.state.partnerSelection.firstName}` :
              `Tap the number below to invite ${this.state.partnerSelection.firstName} as your partner.`
                }
                </Text>

                </View>
                { this.state.partnerSelection && this.state.partnerSelection.phoneNumbers && this.state.partnerSelection.phoneNumbers.length && this.state.partnerSelection.phoneNumbers.map( (number, i) => {
                    return (
                     <TouchableHighlight style={styles.modalButton} onPress={this._continue.bind(this)}>
                      <View style={{height:40}} >
                        <Text style={styles.modalButtonText}>{number}</Text>
                      </View>
                     </TouchableHighlight>

                  )
                })}
              <TouchableHighlight style={styles.modalButton} onPress={this._cancel.bind(this)}>
                <View >
                <Text style={styles.modalButtonText}>CANCEL</Text>
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
  modalButton:{
    alignSelf:'stretch',
    backgroundColor:colors.sapphire50,
    borderColor:colors.purple,
    alignItems:'center',
    margin: 20,
    borderRadius:8,
    justifyContent:'center',
    flex:1,
    borderWidth:1
},
modalButtonText:{
  color:colors.white,
  fontFamily:'Montserrat',
  fontSize:20,

textAlign:'center'
},
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
    borderRadius:10,
    margin:25
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
insidemodalwrapper:{
    flexDirection:'column',
    justifyContent:'space-around',
    alignItems:'center',
    flex:1,
    marginTop:50,
    alignSelf:'stretch',
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
    fontSize:22,
    alignItems: 'stretch',
    flex:1,
    paddingHorizontal:10,
    fontFamily:'Montserrat',
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
