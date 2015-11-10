//import {StyleSheet} from "react-native";
import {MagicNumbers} from '../DeviceConfig';
import colors from '../utils/colors';

const SCREEN_HEIGHT  = require('Dimensions').get('window').height;
const SCREEN_WIDTH   = MagicNumbers.screenWidth;
const SCREEN_PADDING = MagicNumbers.screenPadding;
const PCARD_WIDTH    = SCREEN_WIDTH;
const Theme = {
  FullScreenContainer: {
    position:'relative',
    flex:1,
    opacity:1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },

  FullSCreenImage: {
      flex: 1,
      alignSelf:'stretch',
      padding:0,
      alignItems:'stretch',
      flexDirection:'column',
      width:    SCREEN_WIDTH,
      height:   SCREEN_HEIGHT
  },

  Potentials: {
    Deck: {
      margin:0,
      padding:0,
      flex:1,
      marginLeft:0,
      position:'relative',
      backgroundColor:  colors.shuttleGray
    },

    Housing: {
      position: 'absolute',
      width:     SCREEN_WIDTH,
      height:    600,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },

  Card: {
    borderRadius:8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor:'rgba(0,0,0,.2)',
    overflow:'hidden'
  },

  ShadowCard:{
    shadowColor:colors.darkShadow,
    shadowRadius:5,
    shadowOpacity:50,
    shadowOffset: {
      width:0,
      height: 5
    }
  }
  },
  SCREEN_WIDTH,
  SCREEN_PADDING,
  PCARD_WIDTH
};

export { Theme,SCREEN_PADDING, SCREEN_WIDTH, PCARD_WIDTH,SCREEN_HEIGHT };
