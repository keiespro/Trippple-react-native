/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  LayoutAnimation,
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
    super();

    this.state = {
      modalBG: 'transparent'
    }
  }


  componentDidMount(){
  }
  componentWillUnmount(){
    console.log('UNmount actionmodal')
  }
  _continue(){
    this.toggleModal();

  }
  toggleModal(){
    this.props.toggleModal()
  }
  render(){
  if(!this.props.currentMatch) return false;
    var {isVisible} = this.props
    console.log(this.props)
    var img_url = this.props.currentMatch.users.them.users[1].image_url
    var matchName = 'MatchName'
    console.log( img_url)
    return (


      <Modal
        height={isVisible ? 420 : 0}
        modalStyle={[styles.actionmodal,{overflow:isVisible ? 'visible':'hidden'}]}
        isVisible={isVisible}
        animation={{
          show: {
            duration: 300,
            update: {
              type: LayoutAnimation.Types.spring,
              springDamping: 0.7
            }
          },
          hide: {
            duration: 200,
            update: {
              type: LayoutAnimation.Types.spring
            }
          }
        }}
        contentWrapStyle={{height: isVisible ? 420 : 0,bottom: 0}}

        swipeableAreaStyle={{
          position: 'absolute',
          flex: 1,
          left: 0,
          right: 0,
          top: isVisible ? -300 : 0,
          height: isVisible ? 300 : 0,
          backgroundColor: colors.mediumPurple20
        }}
        onDidHide={()=>{
          this.props.toggleModal();
        }}
        onDidShow={()=>{
          console.log('props in AM',this.props.currentMatch.users.them);
        }}>


        <View>
          <View  style={[styles.userimageContainer,styles.blur]}>
            <TouchableOpacity onPress={()=>false}>
              <Image
                style={styles.userimage}
                key={this.props.id}
                source={{uri: img_url }}

                defaultSource={require('image!defaultuser')}
                resizeMode={Image.resizeMode.cover}/>

            </TouchableOpacity>

            <Text style={{color:colors.white}}>{`${matchName}\'s`} </Text>

          </View>

          <View>

            <View style={{flexDirection:'row',justifyContent:'space-around'}}>

              <TouchableHighlight
                style={[styles.clearButton,styles.inlineButtons]}
                underlayColor={colors.shuttleGray20}
                onPress={()=>UserActions.unMatch()}>
                <View >
                  <Text style={[styles.clearButtonText]}>
                    UNMATCH
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.clearButton,styles.inlineButtons]}
                underlayColor={colors.shuttleGray20}
                onPress={()=>true}>
                <View >
                  <Text style={[styles.clearButtonText]}>
                    REPORT
                  </Text>
                </View>
              </TouchableHighlight>

            </View>

            <TouchableHighlight
              style={[styles.clearButton,styles.modalButton]}
              underlayColor={colors.mediumPurple}
              onPress={()=>true}>
              <View >
                <Text style={[styles.clearButtonText,styles.modalButtonText]}>
                  FAVORITE {this.props.matchName}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.clearButton,styles.modalButton]}
              underlayColor={colors.mediumPurple}
              onPress={()=>{}}>
              <View >
                <Text style={[styles.clearButtonText,styles.modalButtonText]}>
                  VIEW PROFILE
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableOpacity onPress={this.toggleModal.bind(this)}>
              <View style={{flex:1,paddingVertical:10}}>
                <Text style={{textAlign:'center',fontSize:18,color:'white'}}>Close</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    );
  }

}

export default ActionModal;

var styles = StyleSheet.create({
  actionmodal:{
    width:DeviceWidth,
    backgroundColor: colors.outerSpace,
    justifyContent:'flex-start',
    margin:0,
    padding:10,
    // shadowColor:colors.darkShadow,
    //       shadowRadius:5,
    //       shadowOpacity:50,
    //       shadowOffset: {
    //           width:0,
    //           height: -5
    //       }


  },
  clearButton:{
    backgroundColor:'transparent',
    borderColor:colors.rollingStone,
    alignItems:'center',
    margin: 10,
    borderRadius:0,
    justifyContent:'center',
    height:50,
    borderWidth:1

  },
  modalButton:{
    alignSelf:'stretch',
    alignItems:'center',
    margin: 10,
    borderRadius:0,
    justifyContent:'center',
    height:50,
    borderWidth:1
},
profileButton:{
  backgroundColor:colors.mediumPurple20,
  borderColor:colors.mediumPurple,

},
inlineButtons:{
  flex:1
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
   col: {
    flexDirection: 'column',
    padding: 0,
  },


   userimageContainer: {
     padding: 0,
     alignItems: 'center'

   },
   blur:{
     flex:1,
     alignSelf:'stretch',
     alignItems:'center',
     paddingTop: 0,
     paddingBottom: 0,

   },

   userimage: {
     padding:0,
     height: 180,
     width:180,
     alignItems: 'stretch',
     position:'relative',
     borderRadius:90,
     overflow:'hidden'
   },
})
