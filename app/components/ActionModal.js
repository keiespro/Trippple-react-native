/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
 TouchableWithoutFeedback,
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import UserActions from '../flux/actions/UserActions'
import colors from '../utils/colors'
import _ from 'underscore'
import BackButton from '../components/BackButton'
import Modal from 'react-native-swipeable-modal'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

@reactMixin.decorate(TimerMixin)
class ActionModal extends Component{

  constructor(props){
    super(props);

    this.state = {
      modalBG: 'transparent'
    }
  }

  closeModal(){
    this.props.toggleModal()

  }

  componentDidMount(){
  }
  componentWillUnmount(){
    console.log('UNmount actionmodal')
  }
  _continue(){
    this.closeModal();

  }
  toggleModal(){
    this.props.toggleModal()
  }
  render(){
    var isVisible = this.props.isVisible ;
    return (



      <Modal
        height={DeviceHeight}
        modalStyle={styles.actionmodal}
        isVisible={isVisible}
        swipeableAreaStyle={{ position: 'absolute',
          top: isVisible ? -60 : 0,
          left: 0,
          right: 0,
          height:isVisible ? 80 : 0,
          backgroundColor: 'transparent'
        }}
        onPressBackdrop={this.toggleModal.bind(this)}
        onDidShow={()=>{
          console.log('shown');
      }}
        onWillHide={this.toggleModal.bind(this)}
      >
      <TouchableHighlight onPress={()=>true}>
        <View style={styles.clearButton}>
          <Text style={[styles.clearButtonText]}>UNMATCH </Text>
        </View>
      </TouchableHighlight>
    <TouchableHighlight onPress={()=>true}>
        <View style={styles.clearButton}>
          <Text style={[styles.clearButtonText]}>REPORT </Text>
        </View>
      </TouchableHighlight>

    <TouchableHighlight onPress={()=>true}>
        <View style={[styles.clearButton,styles.modalButton]}>
          <Text style={[styles.clearButtonText,styles.modalButtonText]}>VIEW PROFILE</Text>
        </View>
      </TouchableHighlight>


      </Modal>

    );
  }

}

export default ActionModal;

var styles = StyleSheet.create({
  actionmodal:{
    width:DeviceWidth,
    backgroundColor: colors.outerSpace,
    justifyContent:'space-around',
    bottom:0
  },
  clearButton:{
    backgroundColor:'transparent',
    alignSelf:'stretch',
    borderColor:colors.rollingStone,
    alignItems:'center',
    margin: 10,
    borderRadius:8,
    justifyContent:'center',
    flex:1,
    height:50,
    borderWidth:1

  },
  modalButton:{
    alignSelf:'stretch',
    backgroundColor:colors.mediumPurple20,
    borderColor:colors.mediumPurple,
    alignItems:'center',
    margin: 10,
    borderRadius:8,
    justifyContent:'center',
    flex:1,
    height:50,
    borderWidth:1
},
modalButtonText:{
  color:colors.white,
  fontFamily:'Montserrat',
  fontSize:20,

  textAlign:'center'
},
clearButtonText:{
  color:colors.rollingStone,
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
  }})
