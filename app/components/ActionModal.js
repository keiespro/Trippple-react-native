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
import MatchActions from '../flux/actions/MatchActions'
import colors from '../utils/colors'
import _ from 'underscore'
import BackButton from '../components/BackButton'
import Modal from 'react-native-swipeable-modal'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import UserProfile from '../components/UserProfile'

@reactMixin.decorate(TimerMixin)
class ActionModal extends Component{

  constructor(props){
    super();

    this.state = {
      modalBG: 'transparent',
      favorited: props.currentMatch ? props.currentMatch.isFavourited : false
    }
  }


  componentDidMount(){
  }
  componentWillUnmount(){
    console.log('UNmount actionmodal')
  }
  componentWillReceiveProps(props){
    this.forceUpdate()
  }
  _continue(){
    this.toggleModal();

  }
  toggleModal(){
    this.props.toggleModal()
  }
  showProfile(match){
    this.props.navigator.push({
      component: UserProfile,
      passProps:{match, hideProfile: ()=> {
        this.props.navigator.pop()
      }}
    })
  }



  render(){
    if(!this.props.currentMatch) return false;
    var {isVisible} = this.props
    console.log(this.props)
    var theirIds = Object.keys(this.props.currentMatch.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> this.props.currentMatch.users[id])

    var img_url = them[0].image_url
    var matchName = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },"")

    return (


      <Modal
        height={isVisible ? 450 : 0}
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
            duration: 300,
            update: {
              type: LayoutAnimation.Types.spring
            }
          }
        }}
        contentWrapStyle={{
          height: isVisible ? 450 : 0,
          bottom: 0
        }}

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
          if(isVisible){
            this.props.toggleModal();

          }

        }}


        onDidShow={()=>{
          console.log('props in AM',this.props.currentMatch.users);
        }}>


        <View style={[styles.actionmodal]}>
          <View  style={[styles.userimageContainer,styles.blur]}>
              <Image
                style={styles.userimage}
                key={this.props.currentMatch.match_id}
                source={{uri: img_url }}

                defaultSource={require('image!placeholderUser')}
                resizeMode={Image.resizeMode.cover}/>


            <Text style={{color:colors.white}}>{`${matchName}\'s`} </Text>

          </View>

          <View>

            <View style={{flexDirection:'row',justifyContent:'space-around'}}>

              <TouchableHighlight
                style={[styles.clearButton,styles.inlineButtons]}
                underlayColor={colors.shuttleGray20}
                onPress={()=>{
                  MatchActions.unMatch(this.props.currentMatch.match_id)
                  this.toggleModal()
                }}>
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
              onPress={()=>{
              console.log(this.state.favorited)
                MatchActions.toggleFavorite(this.props.currentMatch.match_id.toString())
                  this.toggleModal()
              }}>
              <View >
                <Text style={[styles.clearButtonText,styles.modalButtonText]}>
                  {this.props.currentMatch.isFavourited ? 'UNFAVORITE' : 'FAVORITE'}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.clearButton,styles.modalButton]}
              underlayColor={colors.mediumPurple}
              onPress={()=>{
                  this.toggleModal()
                this.showProfile(this.props.currentMatch)
              }}>
              <View >
                <Text style={[styles.clearButtonText,styles.modalButtonText]}>
                  VIEW PROFILE
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableOpacity onPress={this.toggleModal.bind(this)}>
              <View style={{flex:1,paddingVertical:10}}>
                <Text style={{textAlign:'center',fontSize:18,color:'white'}}>CANCEL</Text>
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
    bottom:0,
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

    alignItems: 'center',
    flexDirection:'column',
    justifyContent:'center',
    flex:1,
    alignSelf:'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    width: DeviceWidth - 20,
    paddingHorizontal: 20,
   },

   blur:{

   },

   userimage: {
     padding:0,
     marginVertical:10,
     height: 140,
     width:140,
     position:'relative',
     borderRadius:70,
     overflow:'hidden'
   },
})
