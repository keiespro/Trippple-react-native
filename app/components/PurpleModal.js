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
  Modal
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'


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

  render(){
  var rowData = this.props.match
    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> rowData.users[id])
    var matchName = them.map( (user,i) => user.firstname.trim() ).join(' & ');
    var modalVisible = this.state.isVisible
    var self = this
    var matchImage = them.couple && them.couple.thumb_url || them[0].thumb_url || them[1].thumb_url

    return (
    <View>

    <View style={{margin:50}}>

        <Image style={styles.modalcontainer} source={require('image!GradientBG')}>
          <View style={[styles.col]}>
            <View style={styles.insidemodalwrapper}>

          <Image style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20}]}
                source={{uri:matchImage}}
                defaultSource={require('image!placeholderUserWhite')} />

            <View style={styles.rowtextwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:22,marginVertical:10
            }]}>
                {`UNMATCH ${matchName}`}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontSize:22,marginVertical:10,color: colors.lavender,marginHorizontal:20
            }]}>ARE YOU SURE?</Text>
            </View>
                      <View style={{marginHorizontal:20}} >

                     <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton} onPress={this.unMatch.bind(this)}>
                      <View style={{height:60,flex:1,alignSelf:'stretch'}} >
                        <Text style={[styles.modalButtonText,{marginTop:15}]}>UNMATCH</Text>
                      </View>
                     </TouchableHighlight>
                     </View>

                  <View style={{marginHorizontal:20}} >

                      <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton}
                        onPress={this.props.goBack}>
                      <View style={{height:60,flex:1,alignSelf:'stretch'}} >

                        <Text style={styles.modalButtonText}>CANCEL</Text>
                      </View>
                     </TouchableHighlight>
                      </View>

                      </View>

             </View>
          </Image>
      </View>
             </View>

      )
  }
}

export default PurpleModal


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
    borderRadius:10,
    paddingHorizontal:20
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
    alignItems:'stretch',
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
