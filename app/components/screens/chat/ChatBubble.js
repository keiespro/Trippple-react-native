import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import React from 'react';

import dismissKeyboard from 'dismissKeyboard'
import NoMessages from './NoMessages'
import ActionModal from '../../modals/ActionModal';
import Analytics from '../../../utils/Analytics';
import { BlurView, VibrancyView } from 'react-native-blur'
import FadeInContainer from '../../FadeInContainer';
import TimeAgo from '../../controls/Timeago';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
import MessageComposer from './MessageComposer'
import { connect } from 'react-redux';
import styles from './chatStyles'

import ActionMan from  '../../../actions/';

const ChatBubble = (props) => {
    const isMessageOurs = (props.messageData.from_user_info.id === props.user.id || props.messageData.from_user_info.id === props.user.partner_id);
    var thumb = ''
    if(!isMessageOurs){
      const {from_user_info} = props.messageData;
      const {thumb_url,image_url} = from_user_info;
       thumb = (image_url)+'';
    }else{
       thumb = '';

    }

    return (
      <View style={[styles.col]} shouldRasterizeIOS={true}>
        <View style={[styles.row]}>
          <View style={{flexDirection:'column', alignItems:isMessageOurs ? 'flex-end' : 'flex-start', alignSelf: 'stretch', flex:1, justifyContent:'center',backgroundColor: props.messageData.ephemeral && __DEV__ ? colors.sushi : 'transparent'}}>
          <View style={{alignSelf: isMessageOurs ? 'flex-end' : 'flex-start',justifyContent:'center',alignItems:'center',maxWidth:MagicNumbers.screenWidth,backgroundColor:'transparent',flexDirection:'row'}}>
            {!isMessageOurs ?
              <View style={{backgroundColor:'transparent'}}>
              <Image style={[styles.thumb,{backgroundColor:colors.dark}]}
                  source={{uri: thumb}}
                  resizeMode={Image.resizeMode.cover}
                  defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                />
              </View> : null
            }
            { !isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={{uri: 'assets/TrianglePurple@3x.png'}}
                style={{left:1,width:10,height:22,opacity:1}}
              /> : null
            }
            <View style={[styles.bubble,(isMessageOurs ? styles.ourMessage : styles.theirMessage),{flexWrap:'wrap',flexDirection:'column' },]}>

              <Text style={[styles.messageText, styles.messageTitle,
                    {color: isMessageOurs ? colors.shuttleGray : colors.lavender, fontFamily:'Montserrat'} ]}
              >{ props.messageData.from_user_info.name.toUpperCase() }</Text>

              <Text style={[styles.messageText,{flex:1}]} >{
                props.text
              }</Text>

            </View>

            {isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={{uri: 'assets/TriangleDark@3x.png'}}
                style={{right:0,width:10,height:22,tintColor:colors.darks,opacity:1}}
              /> : null
            }
            </View>
          </View>
        </View>

        <View style={[{paddingHorizontal:20,marginBottom:10},{marginLeft: isMessageOurs ? 2 : 62,alignSelf: isMessageOurs ? 'flex-end' : 'flex-start' }]}>
          <TimeAgo showSent={true} style={{color:colors.shuttleGray,fontSize:10,fontFamily:'Montserrat'}} time={props.messageData.created_timestamp * 1000} />
        </View>

      </View>
    );

};

export default ChatBubble


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
