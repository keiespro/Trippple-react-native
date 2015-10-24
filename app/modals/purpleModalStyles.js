import {StyleSheet,Dimensions,PixelRatio} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'


const purpleModalStyles = StyleSheet.create({
  modalButtonWrap:{
    borderRadius:8,
    justifyContent:'center',
    flex:1,
    margin: 5,
    borderRadius:8,
    alignSelf:'stretch',
},

modalButton:{
  alignSelf:'stretch',
  height:60,
  backgroundColor:colors.sapphire50,
  alignItems:'center',
  margin: 0,
  borderRadius:8,
  borderWidth:2 / PixelRatio.get(),
  borderColor:colors.purple,

  justifyContent:'center',
  flex:1,
},
modalButtonText:{
  color:colors.white,
  fontFamily:'Montserrat',
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
    flex:1,
    borderRadius:10,
    paddingHorizontal:20,
    alignSelf:'center',
    backgroundColor: 'transparent',

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
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor: 'transparent',

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
    alignItems:'stretch',
    flex:1,
    marginTop:20,
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
    backgroundColor: colors.white20,

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
  }
})


export default  purpleModalStyles
