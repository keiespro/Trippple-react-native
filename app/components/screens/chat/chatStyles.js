import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


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



export default styles
