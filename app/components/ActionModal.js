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
  Modal,
 TouchableWithoutFeedback,
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import UserActions from '../flux/actions/UserActions'
import MatchActions from '../flux/actions/MatchActions'
import colors from '../utils/colors'
import _ from 'underscore'
import BackButton from '../components/BackButton'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import UserProfile from '../components/UserProfile'
import PurpleModal from './PurpleModal'
@reactMixin.decorate(TimerMixin)
class ActionModal extends Component{

  constructor(props){
    super();

    this.state = {
      modalBG: 'transparent',
      overlayopacity: 0,
      purpleModalVisible: false,
      favorited: props.currentMatch ? props.currentMatch.isFavourited : false
    }
  }


  componentDidMount(){


  }
  componentWillUnmount(){
    console.log('UNmount actionmodal')
  }
  componentWillReceiveProps(props){

    if(props.currentMatch && !this.props.currentMatch){
      this.setTimeout(()=>{
        this.setState({overlayopacity:1})
        LayoutAnimation.configureNext(animations.layout.spring)
      },500)
    }

  }
  _continue(){
    this.toggleModal();

  }
  toggleModal(){
    this.props.toggleModal()
    this.setState({overlayopacity:0})
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
    if(!this.props.currentMatch || !this.props.isVisible) return false;
    var {isVisible} = this.props
    console.log(this.props)
    var theirIds = Object.keys(this.props.currentMatch.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> this.props.currentMatch.users[id])

    var img_url = them[0].image_url
    var matchName = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },"")
    console.log(this.state.overlayopacity)
    return (
          <Modal
        isVisible={isVisible}
        animated={true}
        transparent={false}
        onDismiss={()=>{
            this.props.toggleModal();
            this.setState({overlayopacity:0})
        }}>


        <View style={[styles.actionmodal]}>

          <View  style={[styles.userimageContainer,styles.blur]}>
              <Image
                style={styles.userimage}
                key={this.props.currentMatch.match_id}
                source={{uri: img_url }}

                defaultSource={require('image!placeholderUser')}
                resizeMode={Image.resizeMode.cover}/>


            <Text style={{color:colors.white,fontFamily:'Montserrat-Bold',fontSize:18}}>{`${matchName}`} </Text>

          </View>

          <View>

            <View style={{flexDirection:'row',justifyContent:'space-between',
            marginHorizontal:10,
            paddingHorizontal:0,
            paddingBottom:10,
            marginBottom:10,
            borderBottomWidth:1,
            borderBottomColor:colors.shuttleGray}}>

              <TouchableHighlight
                style={[styles.clearButton,styles.inlineButtons,{marginRight:10}]}
                underlayColor={colors.shuttleGray20}
                onPress={()=>{

                this.setState({purpleModalVisible:true})
                  // MatchActions.unMatch(this.props.currentMatch.match_id)
                  // this.toggleModal()
                }}>
                <View >
                  <Text style={[styles.clearButtonText]}>
                    UNMATCH
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.clearButton,styles.inlineButtons,{marginLeft:10}]}
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
              style={[styles.clearButton,styles.modalButton,{borderColor:colors.mediumPurple,backgroundColor:colors.mediumPurple20}]}
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
                <Text style={{textAlign:'center',fontSize:16,color:colors.shuttleGray}}>CANCEL</Text>
              </View>
            </TouchableOpacity>

          </View>

    </View>
          <View>
          </View>
        {this.state.purpleModalVisible && <PurpleModal  isVisible={this.state.purpleModalVisible} visible={this.state.purpleModalVisible} animated={true}/>}
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
    position:'absolute',
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
    marginVertical: 10,
    borderRadius:0,
    justifyContent:'center',
    height:60,
    borderWidth:1

  },
  modalButton:{
    alignSelf:'stretch',
    alignItems:'center',
    margin: 10,
    borderRadius:0,
    justifyContent:'center',
    height:60,
    borderWidth:1
  },
  profileButton:{
    backgroundColor:colors.mediumPurple20,
    borderColor:colors.mediumPurple,

  },
  inlineButtons:{
    flex:1,
  },
  modalButtonText:{
    color:colors.white,
    fontFamily:'Montserrat',
    fontSize:18,

    textAlign:'center'
  },
  clearButtonText:{
    color:colors.rollingStone,
    fontFamily:'Montserrat',
    fontSize:18,

    textAlign:'center'
  },

  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.darkShadow,
    alignSelf:'stretch',
    flexDirection: 'column',
    width: DeviceWidth,
    height: DeviceHeight,
    top:0,
    position:'absolute'


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
    marginVertical:10,
    paddingBottom: 20,
    width: DeviceWidth - 20,
    paddingHorizontal: 20,
   },

   blur:{

   },

   userimage: {
     padding:0,
     marginVertical:10,
     height: 100,
     marginBottom:20,
     width:100,
     position:'relative',
     borderRadius:50,
     overflow:'hidden'
   },
})



var animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        delay: 500,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        delay: 500,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};
