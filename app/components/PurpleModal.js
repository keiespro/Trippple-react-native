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
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

class PurpleModal extends Component{

  constructor(props) {
    super(props);
    this.state = {}

  }
  _continue(){}
  render(){
    return (
    <View>
      <Modal

        isVisible={this.props.visible || this.props.isVisible}
        animated={true}
        transparent={false}
        onDismiss
        onClose={() => this.closeModal.bind(this)}
        >


        <Image style={styles.modalcontainer} source={require('image!GradientBG')}>
          <View style={[styles.col]}>
            <View style={styles.insidemodalwrapper}>

          <Image style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20}]}
                defaultSource={require('image!placeholderUserWhite')} />

            <View style={styles.rowtextwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:22,marginVertical:10
            }]}>
                {`INVITE`}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                  fontSize:22,marginVertical:10,color: colors.lavender,marginHorizontal:20
            }]}>222
                </Text>
                      <View style={{width:DeviceWidth-80}} >

                     <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton} onPress={this._continue.bind(this)}>
                      <View style={{height:60}} >
                        <Text style={[styles.modalButtonText,{marginTop:15}]}>{'22'}</Text>
                      </View>
                     </TouchableHighlight>
                     </View>

                  <View style={{height:100,width:DeviceWidth-80}} >

                      <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton} onPress={this._continue.bind(this)}>
                      <View >
                        <Text style={styles.modalButtonText}>YES</Text>
                      </View>
                     </TouchableHighlight>
                      </View>

                      </View>
                      </View>

             </View>
          </Image>
      </Modal>
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
