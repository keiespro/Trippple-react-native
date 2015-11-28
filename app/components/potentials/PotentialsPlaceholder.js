/* @flow */

import React, {  StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import {MagicNumbers} from '../../DeviceConfig'
import FadeInContainer from '../FadeInContainer'
import colors from '../../utils/colors';
import styles from './styles'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class PotentialsPlaceholder extends React.Component{
  constructor(props){
    super()
   }
  render(){
    return (
      <FadeInContainer
        delayAmount={2000}
        duration={300}
        didShow={()=>{
          this.props.onDidShow(true)
        }}
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
          source={require('../../../newimg/placeholderDashed.png')}
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
              source={require('../../../newimg/iconClock.png')}
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
