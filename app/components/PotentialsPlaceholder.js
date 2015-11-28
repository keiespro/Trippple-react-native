/* @flow */

import React, {  StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import {MagicNumbers} from '../DeviceConfig'
import FadeInContainer from './FadeInContainer'
import colors from '../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class PotentialsPlaceholder extends React.Component{
  constructor(props){
    super()
    this.state = {
      didShow: false
    }
  }
  render(){
    return (
      <FadeInContainer
        delayAmount={2000}
        duration={300}
        didShow={()=>this.setState({didShow:true})}
        >
        <View
          style={[
            styles.dashedBorderImage,
            {
              height: DeviceHeight,
              flex: 10,
              position: 'relative',
            }]}
          >

          <Image
            source={require('../../newimg/placeholderDashed.png')}
            style={{
              alignSelf: 'stretch',
              flex: 10,
              height: MagicNumbers.is4s ? DeviceHeight-70 : DeviceHeight-55-MagicNumbers.screenPadding/2,
              marginHorizontal: MagicNumbers.is4s ? MagicNumbers.screenPadding : 15,
              width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              flexDirection: 'column',
            }}
            resizeMode={MagicNumbers.is4s ? Image.resizeMode.stretch : Image.resizeMode.contain}
            >
            <Image
              source={require('../../newimg/iconClock.png')}
              style={{
                height: MagicNumbers.is4s ? MagicNumbers.screenWidth/2 - 20 : MagicNumbers.screenWidth/2,
                width: MagicNumbers.is4s ? MagicNumbers.screenWidth/2 - 20 : MagicNumbers.screenWidth/2,
                marginBottom: MagicNumbers.is4s ? 0 : MagicNumbers.screenPadding,
                marginTop: MagicNumbers.is4s ? 40 : MagicNumbers.screenPadding*2
              }}
            />
            <Text
              style={{
                color: colors.white,
                fontFamily: 'Montserrat-Bold',
                fontSize:  (MagicNumbers.size18+2),
                marginVertical: 10
              }}
            >
            COME BACK AT MIDNIGHT
            </Text>
            <Text
              style={{
                color: colors.rollingStone,
                fontSize: MagicNumbers.size18+2,
                marginHorizontal: MagicNumbers.is4s ? 30 : 70,
                marginBottom: 180,
                textAlign: 'center'
              }}
            >
              You’re all out of potential matches for today.
            </Text>
          </Image>
        </View>
      </FadeInContainer>
    )
  }
}
export default PotentialsPlaceholder

var styles = StyleSheet.create({

shadowCard:{
  shadowColor:colors.darkShadow,
  shadowRadius:4,
  shadowOpacity:50,
  shadowOffset: {
    width:0,
    height: 5
  }
},
tab: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  width:(DeviceWidth - 40 )/ 2,

},
singleTab:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 20,
  width:DeviceWidth,

},
tabs: {
  height: 60,
  flexDirection: 'row',
  marginTop: 0,
  borderWidth: 1,
  width:DeviceWidth-40,
  flex:1,
  marginHorizontal:20,
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
  overflow:'hidden',
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
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
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
    alignItems:'stretch',


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
    borderWidth: 3
  },
  cardStackContainer:{
    width:DeviceWidth,
    height:DeviceHeight-55,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    backgroundColor:'transparent'
  },

  cardBottomText:{
    marginLeft:20,
    fontFamily:'Montserrat-Bold',
    color: colors.shuttleGray,
    fontSize:18,
    marginTop:0
  },
  cardBottomOtherText:{
    marginLeft:20,
    fontFamily:'omnes',
    color: colors.rollingStone,
    fontSize:16,
    marginTop:0,
    opacity:0.5
  }
});

