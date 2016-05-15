import {StyleSheet,Dimensions,PixelRatio} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'


const purpleModalStyles = StyleSheet.create({
  modalButtonWrap:{
    borderRadius:4,
    justifyContent:'center',
    flex:1,
    marginVertical: 5,
    flexDirection:'row',
    alignSelf:'stretch',
  },

  modalButton:{
    alignSelf:'stretch',
    height:60,
    backgroundColor:colors.sushi,
    alignItems:'center',
    margin: 0,
    borderRadius:4,
    borderWidth:1 / PixelRatio.get(),
    borderColor:colors.darkGreenBlue,

    justifyContent:'center',
    flex:1,
  },
  modalButtonText:{
    color:colors.white,
    fontFamily:'Montserrat',
    fontSize:18,

    textAlign:'center'
  },
  nothankstext:{
    color:colors.shuttleGray,
    fontFamily:'Montserrat',
    marginVertical: 10,
    fontSize:18,

    textAlign:'center'

  },
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf:'stretch',
    flexDirection: 'column',
    backgroundColor: 'transparent',

  },
  modalcontainer:{
    borderRadius:4,
    backgroundColor: 'transparent',
    marginVertical:MagicNumbers.isSmallDevice ? 0 : 20
  },
  fullWidth:{
    width: MagicNumbers.screenWidth,
    padding:MagicNumbers.screenPadding

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
    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor: 'transparent',

  },
  text:{
    color: colors.shuttleGray,
    fontFamily:'omnes'
  },
  rowtext:{
    color: colors.shuttleGray,
    fontSize:18,
    fontFamily:'omnes'
  },
  bigtext: {
    textAlign:'center',
    color: colors.shuttleGray,

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
    marginTop:MagicNumbers.isSmallDevice ? 0 : 20,
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
  cancelButton:{
    backgroundColor: colors.mandy,
    borderColor: colors.mandy
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
  blurcontainer:{
    position:'absolute',
    top:0,
    width:DeviceWidth,
    height:DeviceHeight,backgroundColor: 'transparent'
},
grayIconbuttonLeftBox:{
 // backgroundColor:colors.darkGreenBlue,
},
fullContainer:{
  overflow:'hidden',
  width:MagicNumbers.screenWidth,
  marginHorizontal:MagicNumbers.screenPadding/2,
  padding:MagicNumbers.screenPadding/2,
          backgroundColor:colors.white,
          height:DeviceHeight-MagicNumbers.screenPadding*2,
          marginTop:MagicNumbers.screenPadding
}
})


export default  purpleModalStyles
