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
  PixelRatio,
  Modal
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import { BlurView,VibrancyView} from 'react-native-blur'


class PurpleModal extends Component{

  constructor(props) {
    super(props);
    this.state = {}

  }
  unMatch(){
    MatchActions.unMatch(this.props.match.id)
    this.props.goBack();
  }
  report(){
    // MatchActions.reportUser(this.props.match.id)
  }

  cancel(){
    this.props.goBack();
  }
  renderUnmatch(){
    var rowData = this.props.match
    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> rowData.users[id])
    var matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & ');
    var modalVisible = this.state.isVisible
    var self = this
    var matchImage = them.couple && them.couple.thumb_url || them[0].thumb_url || them[1].thumb_url
    return (
      <View style={[styles.col,{paddingVertical:10}]}>

        <Image
          style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginVertical:20}]}
          source={{uri:matchImage}}
          defaultSource={require('image!placeholderUserWhite')} />

        <View style={styles.insidemodalwrapper}>


            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>
              {`UNMATCH ${matchName}`}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
              }]}>
              Are you sure?
            </Text>
            <View >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.unMatch.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>UNMATCH</Text>
                </View>
              </TouchableHighlight>
            </View>

          <View >
            <TouchableHighlight
              underlayColor={colors.mediumPurple}
              style={styles.modalButtonWrap}
              onPress={this.props.goBack}>
              <View style={[styles.modalButton,styles.cancelButton]} >
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </View>
            </TouchableHighlight>
          </View>

        </View>

      </View>
    )

  }
  renderReport(){
    var rowData = this.props.match
    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> rowData.users[id])
    var matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & ');

    return (
      <View style={[styles.col,{paddingVertical:10}]}>

        <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>


          <Text style={[styles.rowtext,styles.bigtext,{
              fontFamily:'Montserrat',fontSize:20,marginVertical:10
            }]}>
            {`REPORT ${matchName}`}
          </Text>

          <Text style={[styles.rowtext,styles.bigtext,{
              fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:10
            }]}>
            Is this person bothering you?
            Tell us what they did.
          </Text>

            <View style={{marginTop:30}}>
              <TouchableHighlight
                style={styles.modalButtonWrap}
                underlayColor={colors.mediumPurple}
                onPress={this.unMatch.bind(this)}>
                <View style={styles.modalButton} >
                  <Text style={styles.modalButtonText}>OFFENSIVE BEHAVIOR</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View  >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.unMatch.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>FAKE USER</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.props.goBack}>
                <View style={[styles.modalButton,styles.cancelButton]} >
                  <Text style={styles.modalButtonText}>CANCEL</Text>
                </View>
              </TouchableHighlight>
            </View>

        </View>

      </View>

    )
  }
  render(){

    var renderInnards = ()=>{

      switch (this.props.action) {
        case 'unmatch':
          return this.renderUnmatch()
        case 'report':
          return this.renderReport()

        default:

      }
    }
    return (
      <View style={[{height:DeviceHeight,width:DeviceWidth,padding:0,backgroundColor: 'transparent',flex:1}]}>

        <View style={[styles.col,{justifyContent:'center',alignSelf:'center',backgroundColor: 'transparent',margin:50}]}>

          <Image
            style={[styles.modalcontainer,{flex:0}]}
            source={require('image!GradientBG')}>
            {renderInnards()}
          </Image>
        </View>
      </View>

    )
  }
}

export default PurpleModal


var styles = StyleSheet.create({
  modalButtonWrap:{
    borderRadius:8,
    justifyContent:'center',
    flex:1,
    margin: 5,
    borderRadius:8,
    alignSelf:'stretch',
},

modalButton:{
  alignSelf:'stretch',
  height:60,
  backgroundColor:colors.sapphire50,
  alignItems:'center',
  margin: 0,
  borderRadius:8,
  borderWidth:2 / PixelRatio.get(),
  borderColor:colors.purple,

  justifyContent:'center',
  flex:1,
},
modalButtonText:{
  color:colors.white,
  fontFamily:'Montserrat',
  fontSize:18,

textAlign:'center'
},
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf:'stretch',
    flexDirection: 'column',
    backgroundColor: 'transparent',

  },
  modalcontainer:{
    flex:1,
    borderRadius:10,
    paddingHorizontal:20,
    alignSelf:'center',
    backgroundColor: 'transparent',

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
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor: 'transparent',

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
    alignItems:'stretch',
    flex:1,
    marginTop:20,
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
  cancelButton:{
    backgroundColor: colors.white20,

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
  blurcontainer:{
    position:'absolute',
    top:0,
    width:DeviceWidth,
    height:DeviceHeight,backgroundColor: 'transparent'
  }
})
