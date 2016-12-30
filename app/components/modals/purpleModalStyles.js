import {StyleSheet, Dimensions, PixelRatio} from 'react-native'

import colors from '../../utils/colors'
import {MagicNumbers} from '../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const purpleModalStyles = StyleSheet.create({
  modalButtonWrap: {
    borderRadius: 4,
    justifyContent: 'center',

    marginVertical: 5,
    alignSelf: 'stretch',
  },

  modalButton: {
    alignSelf: 'stretch',
    height: 60,
    // backgroundColor:colors.sushi,
    alignItems: 'center',
    margin: 0,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.sushi,


    justifyContent: 'center',

  },
  modalButtonText: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center'
  },
  nothankstext: {
    fontFamily: 'montserrat',
    marginVertical: 10,
    fontSize: 18,

    textAlign: 'center'

  },
  container: {

    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'transparent',

  },
  modalcontainer: {
    borderRadius: 4,
    backgroundColor: 'transparent',
    width: MagicNumbers.screenWidth,

    // marginVertical:MagicNumbers.isSmallDevice ? 0 : 20
  },
  fullWidth: {
    width: (MagicNumbers.screenWidth - MagicNumbers.screenPadding) / 2,
    // padding:MagicNumbers.screenPadding/2

  },
  row: {
    flexDirection: 'row',
    padding: 0,
    alignSelf: 'stretch',
    height: 70,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  col: {
    flexDirection: 'column',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',

  },
  text: {
    color: colors.white,
    fontFamily: 'omnes'
  },
  rowtext: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'omnes'
  },
  bigtext: {
    textAlign: 'center',
    color: colors.white,

  },
  separator: {
    height: 1,
    backgroundColor: colors.outerSpace,
  },
  rowtextwrapper: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  insidemodalwrapper: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 10,
    // flexGrow: 10,
    width:DeviceWidth,
height: DeviceHeight,
    marginTop: MagicNumbers.isSmallDevice ? 0 : 20,
    alignSelf: 'stretch',
  },
  rowSelected: {
    backgroundColor: colors.mediumPurple20,
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  searchwrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderBottomWidth: 2,
    marginHorizontal: 10,
    borderBottomColor: colors.mediumPurple
  },
  searchfield: {
    color: colors.white,
    fontSize: 22,
    alignItems: 'stretch',

    paddingHorizontal: 10,
    fontFamily: 'montserrat',
    height: 60,
    backgroundColor: 'transparent',

  },


  contactthumb: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginHorizontal: 10
  },
  searchicon: {
    top: 20,
    left: 10,
    position: 'absolute',
    width: 20,
    height: 20
  },
  cancelButton: {
    borderColor: colors.mandy
  },
  plainButton: {
    borderColor: colors.rollingStone,
    borderWidth: 1,
    height: 70,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainButtonText: {
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'montserrat',
    textAlign: 'center',
  },
  blurcontainer: {
    position: 'absolute',
    top: 0,
    width: DeviceWidth,
    height: DeviceHeight,
    backgroundColor: 'transparent'
  },
  grayIconbuttonLeftBox: {
 // backgroundColor:colors.darkGreenBlue,
  },
  fullContainer: {
    overflow: 'hidden',
    width: MagicNumbers.screenWidth,
    marginHorizontal: MagicNumbers.screenPadding / 2,
    padding: MagicNumbers.screenPadding / 2,
    backgroundColor: 'transparent',
    height: (DeviceHeight - MagicNumbers.screenPadding) * 2,
    marginTop: MagicNumbers.screenPadding
  }
})


export default purpleModalStyles
