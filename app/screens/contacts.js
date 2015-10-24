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
  Modal,
  TouchableHighlight,
  Dimensions,
 TouchableWithoutFeedback,
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
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import Api from '../utils/api'
import base64 from 'base-64'

function cleanNumber(p){
  return p.replace(/[\. ,():+-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');
}

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

            <Image style={styles.contactthumb} source={(rowData.thumbnailPath == '' ?  require('image!placeholderUser') : {uri: rowData.thumbnailPath} )} />

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


@reactMixin.decorate(TimerMixin)
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
      highlightedRow: null,
      modalBG: 'transparent'
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
    this.setTimeout(()=>{
      this.getContacts();
    },1500);
  }

  storeContacts(){
    AddressBook.getContacts((err, contacts) => {
      if(err){
        console.log(err);
        return false;
      }
      //
      // var start = new Date()
      // console.log('START',start)

      var allNumbers = _.pluck(_.flatten(_.pluck(contacts,'phoneNumbers')),'number').map(cleanNumber)

      // console.log(allNumbers.length+' numbers grabbed')

      Api.sendContactsToBlock(base64.encode(JSON.stringify(allNumbers)))
          // .then((n)=>{
          //   var end = new Date()
          //   console.log('END',end,n.length)
          //   console.log(' took: '+(end - start)+' ms')
          // })

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
            {text: 'Try Again', onPress: () => this.askPermissions()},
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
  _continue(partnerSelection){
    this.closeModal();

    var partner_phone = partnerSelection.number || this.state.partnerSelection.phoneNumbers[0].number;

    UserActions.selectPartner({phone: partner_phone,name: partnerSelection.name})
    var lastindex = this.props.navigator.getCurrentRoutes().length;

    var nextRoute = this.props.stack[lastindex];

   nextRoute.passProps = {
        ...this.props,
        partner:this.state.partnerSelection,

    }
    this.props.navigator.push(nextRoute)



  }
  _cancel(){
    this.setState({
      modalVisible: false,
      partnerSelection: {},
      highlightedRow: null

    });

  }
  render(){
  var invitedName = this.state.partnerSelection && this.state.partnerSelection.firstName && this.state.partnerSelection.firstName.toUpperCase() || ''
var manyPhones = this.state.partnerSelection &&
                  this.state.partnerSelection.phoneNumbers &&
                  this.state.partnerSelection.phoneNumbers.length &&
                  this.state.partnerSelection.phoneNumbers.length > 1;
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


    {this.state.partnerSelection ?  <Modal
          height={DeviceHeight}
    modalStyle={{ backgroundColor: this.state.modalBG}}

    visible={this.state.modalVisible}
    swipeableAreaStyle={{ position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: DeviceHeight,
    backgroundColor: 'transparent'
    }}
    onPressBackdrop={this._cancel.bind(this)}
    onDidShow={()=>{
      console.log('shown');
      this.setTimeout(()=>{
        this.setState({modalBG: 'rgba(0,0,0,0.5)'});
        console.log('endtimeout')
      },500);
    }}


  onWillHide={()=>{this.setState({modalVisible:false,modalBG: 'rgba(0,0,0,0.5)'})}}

        onClose={() => this.closeModal.bind(this)}
        >


        <Image style={styles.modalcontainer} source={require('image!GradientBG')}>
          <View style={[styles.col]}>
            <View style={styles.insidemodalwrapper}>

          <Image style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20}]}
                source={this.state.partnerSelection.thumbnailPath !== '' ? {uri: this.state.partnerSelection.thumbnailPath} : require('image!placeholderUserWhite')} />

            <View style={styles.rowtextwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:22,marginVertical:10
            }]}>
                {`INVITE ${invitedName}`}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontSize:22,marginVertical:10,color: colors.lavender,marginHorizontal:20
            }]}>{this.state.partnerSelection.phoneNumbers && this.state.partnerSelection.phoneNumbers.length > 1 ?
              `What number should we use to invite ${this.state.partnerSelection.firstName}` :
              `Invite ${this.state.partnerSelection.firstName} as your partner?`
                }
                </Text>

                </View>
                { this.state.partnerSelection &&
                  this.state.partnerSelection.phoneNumbers &&
                  this.state.partnerSelection.phoneNumbers.length &&
                  this.state.partnerSelection.phoneNumbers.length > 1 &&
                  this.state.partnerSelection.phoneNumbers.map( (number, i) => {
                    return (
                      <View style={{width:DeviceWidth-80}} >

                     <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton} onPress={()=>{this._continue({number: number.number, name: this.state.partnerSelection.firstName })}}>
                      <View style={{height:60}} >
                        <Text style={[styles.modalButtonText,{marginTop:15}]}>{number.number}</Text>
                      </View>
                     </TouchableHighlight>
                     </View>

                  )
                })}
              { this.state.partnerSelection &&
                  this.state.partnerSelection.phoneNumbers &&
                  this.state.partnerSelection.phoneNumbers.length &&
                  this.state.partnerSelection.phoneNumbers.length == 1 &&
                      <View style={{height:100,width:DeviceWidth-80}} >

                      <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton} onPress={this._continue.bind(this)}>
                      <View >
                        <Text style={styles.modalButtonText}>YES</Text>
                      </View>
                     </TouchableHighlight>
                      </View>

              }


                      <View style={{height: manyPhones ?  80  : 100,width:DeviceWidth-80,marginBottom:50}} >

              <TouchableHighlight style={[styles.modalButton,{backgroundColor:'transparent',borderColor:colors.lavender}]} underlayColor={colors.white}  onPress={this._cancel.bind(this)}>
                <View >
                <Text style={[styles.modalButtonText,{color:colors.lavender}]}>{
                  manyPhones ? 'CANCEL' : 'NO'}</Text>
                </View>
                </TouchableHighlight>
                </View>


                </View>
          </View>
          </Image>
      </Modal> : null}
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
    margin: 10,
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
