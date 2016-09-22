import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, ListView, Keyboard, TouchableOpacity,LayoutAnimation, ScrollView, Animated, Dimensions, KeyboardAvoidingView } from 'react-native';
import FadeInContainer from '../../FadeInContainer';
import MessageComposer from './MessageComposer';
import TimeAgo from '../../controls/Timeago';
import colors from '../../../utils/colors';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {pure} from 'recompose'
import {MagicNumbers} from '../../../utils/DeviceConfig'

export default class NoMessages extends React.Component{
  constructor(props){
    super()
    this.state = {}
  }
  componentDidMount(){
    Keyboard.addListener('keyboardWillHide', this.hideKeyboard.bind(this))
    Keyboard.addListener('keyboardWillShow', this.showKeyboard.bind(this))
  }
  componentWillUnmount(){
    Keyboard.removeListener('keyboardWillHide', this.hideKeyboard.bind(this))
    Keyboard.removeListener('keyboardWillShow', this.showKeyboard.bind(this))

  }
  hideKeyboard(k){
    // LayoutAnimation.easeInEaseOut()
    this.setState({isKeyboardOpened: false})
  }
  showKeyboard(k){
    this.setState({isKeyboardOpened: true})

  }
  getThumbSize(){

    let size =  MagicNumbers.is4s ? SIZES.small : SIZES.big;
    let isKeyboardOpened = this.props.isKeyboardOpened ||  this.state.isKeyboardOpened;

    return  {
                width: isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
                height: isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
                borderRadius: isKeyboardOpened ? size.dimensions.open/2 : size.dimensions.closed/2,
                marginVertical: isKeyboardOpened ? size.margin.open : size.margin.closed,
                backgroundColor: colors.dark
              }
  }

  render(){
    let isKeyboardOpened = this.props.isKeyboardOpened ||  this.state.isKeyboardOpened;

    const matchInfo = this.props.currentMatch || this.props.matchInfo,
          theirIds = Object.keys(matchInfo.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id),
          them = theirIds.map((id)=> matchInfo.users[id]),
          chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ` & ` : '')  },'')

    return (
      <ScrollView
        {...this.props}
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth,}}
        contentInset={{top:0,right:0,left:0,bottom:50}}
        automaticallyAdjustContentInsets={true}
        scrollEnabled={false}
        key={'scrollnomsgs'+this.props.user.id}
        removeClippedSubviews={true}
        style={{  alignSelf:'stretch',width:DeviceWidth,}}
      >
      <KeyboardAvoidingView  style={{flex:1,width:DeviceWidth,height:DeviceHeight-64,backgroundColor:colors.outerSpace,marginTop:64}} behavior={'padding'}>

        <FadeInContainer delayAmount={500} duration={1000}>

          <View style={{flexDirection:'column',justifyContent: 'center', top: 10, alignItems: 'center',alignSelf:'stretch',flex: 1 ,paddingBottom:30 }}>

            <View style={{width:DeviceWidth,alignSelf: 'center',alignItems:'center',flexDirection:'column', justifyContent:'center' }}>

              <Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{
                    `YOU MATCHED WITH`
              }</Text>

    					<Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat-Bold',textAlign:'center',
                }} >{
                    `${chatTitle}`
              }</Text>

            <View style={{}} >
                <TimeAgo style={{color:colors.shuttleGray, fontSize:16,fontFamily:'omnes',}} time={matchInfo.created_timestamp*1000} />
              </View>

              <Image
                source={{uri:them[0].image_url}}
                style={this.getThumbSize()}
                defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
              />
    					<Text style={{color:colors.shuttleGray,fontSize:20,textAlign:'center',fontFamily:'omnes', backgroundColor: 'transparent'}} >Say something. {
                  (them.length == 2 ? 'They\'re' : them[0].gender == 'm' ? 'He\'s' : 'She\'s')
                } already into you.</Text>
            </View>
          </View>
        </FadeInContainer>
        <MessageComposer
          textInputValue={this.props.textInputValue}
          onTextInputChange={this.props.onTextInputChange}
          sendMessage={this.props.sendMessage}
        />
      </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}


const SIZES = {
      big:{
        dimensions:{
          closed: 200,
          open: 140,
        },
        margin:{
          closed: 40,
          open: 20,
        }
      },
      small: {
        dimensions:{
          closed: 100,
          open: 50
        },
        margin:{
          closed: 20,
          open: 10,
        }
      }
   };

   const styles = StyleSheet.create({
     container: {

       backgroundColor: colors.white,
       paddingTop: 0,
       paddingBottom:50
     },
     chatContainer: {

       margin: 0,
       flexDirection: 'column',
       // alignItems: '  stretch',
       alignSelf: 'stretch',
       backgroundColor:colors.dark,

       // bottom: 50,
       // top:60
     },
     messageList: {

       flexDirection: 'column',
       alignSelf: 'stretch',
      },

     bubble: {
       borderRadius:10,
       padding: 10,
       paddingHorizontal: 20,
       paddingVertical:15,
       marginTop:10,
       marginBottom:5,
       flexDirection: 'column',
       maxWidth:DeviceWidth-100,
     },
     row:{
       flexDirection: 'row',
       alignItems:'center',
       justifyContent:'space-between',
       marginHorizontal: 10,

     },
     col:{
       flexDirection: 'column',

       alignSelf:'stretch',
       alignItems:'stretch',
       justifyContent:'space-around',

     },
     theirMessage:{
       backgroundColor: colors.mediumPurple,
       marginRight: MagicNumbers.is4s ? 0 : 10,
       alignSelf:'flex-start',

     },
     ourMessage:
     {
       // marginLeft: MagicNumbers.is4s ? 0 : 10,
       backgroundColor: colors.dark,
       alignSelf:'flex-end',

     },
     messageTitle: {
       fontFamily: 'Montserrat',
       color: colors.shuttleGray,
       fontSize: 12,
       marginBottom: 5
     },

     chatInsideWrap:{
       flexDirection:'column',
       alignItems:'flex-end',
       alignSelf:'stretch',
       flex:1,
       backgroundColor: colors.dark,

       position:'relative',
       height:DeviceHeight,
         width:DeviceWidth,
     },
     messageText: {
       fontSize: 16,
       fontWeight: '200',
       // flexWrap: 'wrap',
       color: colors.white
     },
     thumb: {
       borderRadius:MagicNumbers.is4s ? 20 : 24,
       width: MagicNumbers.is4s ? 40 : 48,
       height:MagicNumbers.is4s ? 40 :  48,
       position:'relative',
       marginHorizontal:MagicNumbers.is4s ?  0 : 5,
       marginRight: 5
     },
     listview:{
       backgroundColor:colors.outerSpace,
       // alignSelf:'stretch',
       // bottom:80,
       flex:1,
       width:DeviceWidth,
     },
     invertedContentContainer:{
       backgroundColor:colors.outerSpace,
       justifyContent:'center',
       width:DeviceWidth,
     }
   });
