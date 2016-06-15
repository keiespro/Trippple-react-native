
import { StyleSheet, Dimensions, } from 'react-native'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import colors from '../../utils/colors';
import {MagicNumbers} from '../../DeviceConfig'

const styles = StyleSheet.create({
  dot: {
    backgroundColor: 'transparent',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: colors.white
  },
  activeDot:{
      borderColor: colors.mediumPurple,
    backgroundColor: colors.mediumPurple,

  },
  shadowCard:{
    shadowColor:colors.darkShadow,
    shadowRadius:4,
    shadowOpacity:50,
    shadowOffset: {
      width:0,
      height: 5
    },
    backgroundColor:colors.dark
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width:MagicNumbers.screenWidth/ 2,

  },
  singleTab:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: MagicNumbers.screenPadding/2,
    width:MagicNumbers.screenWidth,

  },
  tabs: {
    height: 60,
    flexDirection: 'row',
    marginTop: 0,
    borderWidth: 1,
    width:MagicNumbers.screenWidth,
    flex:1,
    marginHorizontal:0,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth:1,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center',
    borderColor: colors.shuttleGray,
  },
  animatedIcon:{
    height:60,
    width:60,
    borderRadius:30,
    alignItems:'center',
    justifyContent:'center',
    top:DeviceHeight/2 - 80,
    left:DeviceWidth/2 - 50,
    position:'absolute',
    // shadowColor:colors.darkShadow,
    backgroundColor:'transparent',
    // shadowRadius:5,
    // shadowOpacity:50,
    // overflow:'hidden',
    // shadowOffset: {
    //   width:0,
    //   height: 5
    // }
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow:'hidden',
    top:50
  },
  absoluteText:{
    position:'absolute',
    color:'#ffffff',
    backgroundColor:'transparent',
    fontSize:20
  },
  absoluteTextTop:{
    top:0
  },
  absoluteTextBottom:{
    bottom:0
  },
  basicCard:{
    borderRadius:8,
    backgroundColor: 'transparent',
    overflow:'hidden',

  },
  bottomButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    top:-40,
    justifyContent:'space-around',
    alignSelf:'stretch',
    width: undefined
  },
  topButton: {
    height: 80,
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    alignItems:'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius:8,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    flex: 1,
    borderWidth: 0,
    position:'absolute',
    marginHorizontal:40,
    borderColor:'rgba(0,0,0,.2)',
    overflow:'hidden'

  },

  closeProfile:{
    position:'absolute',
    top:10,
    left:5,
    width: 50,

    backgroundColor:'transparent',

    height: 50,
    alignSelf:'center',

    overflow:'hidden',

    justifyContent:'center',
    alignItems:'center',
    padding:20,
    borderRadius:25
  },
  dashedBorderImage:{
    paddingHorizontal:0,
    paddingBottom:20,
    margin:0,
    padding:0,
    flex:1,
    height:DeviceHeight-55,
    alignSelf:'stretch',
    alignItems:'stretch',
    justifyContent:'center'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    padding:0,
    alignItems:'center',
    justifyContent:'center'

  },

  dot: {
    backgroundColor: 'transparent',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: colors.mediumPurple20,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  wrapper:{

  },
  scrollSection:{
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    padding:0,
    margin:0,
    alignItems: 'center',
    flexDirection: 'column'
  },
  circleimage:{
    backgroundColor: colors.shuttleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor:colors.white,
    borderWidth: 0
  },
  circleimagewrap:{
    padding: DeviceHeight > 568 ? 3 : 2,
    backgroundColor:colors.white,
    alignItems:'center',
    justifyContent:'center',
    height:DeviceHeight > 568 ? 64 : 46,
    width:DeviceHeight > 568 ? 64 : 46,
    borderRadius: DeviceHeight > 568 ? 32 : 23
  },
  circleimageSmaller:{
    backgroundColor: colors.shuttleGray,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor:colors.white,
    borderWidth: 0
  },

  cardStackContainer:{
    width:DeviceWidth,
    height:DeviceHeight-55,
    flex:1,
    top:0,
    position:'absolute',
    left:0,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'transparent'
  },

  cardBottomText:{
    marginLeft:0,
    fontFamily:'Montserrat-Bold',
    color: colors.rollingStone,
    fontSize:18,
    marginTop:0
  },
  cardBottomOtherText:{
    marginLeft: 0,
    fontFamily:'omnes',
    color: colors.rollingStone,
    fontSize:16,
    marginTop:0,
    opacity:0.5
  }
});
export default styles
