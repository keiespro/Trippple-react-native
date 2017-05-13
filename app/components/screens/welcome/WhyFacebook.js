import { StyleSheet, Text, Dimensions, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';

import colors from '../../../utils/colors'
import { MagicNumbers } from '../../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const WhyFacebook = ({kill}) => (
  <ScrollView style={{ width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.outerSpace, padding: MagicNumbers.screenPadding}}>
    <View style={{flexDirection: 'column', justifyContent: 'space-around', height: DeviceHeight - 50, flex: 1}}>
      <Text style={[styles.allText, styles.titleText, {textAlign: 'center', marginTop: 20}]}>WHY FACEBOOK?</Text>
      <View>
        <Text style={[styles.allText, styles.titleText, {}]}>USER PRIVACY</Text>
        <Text style={[styles.allText, {}]}>By signing up with Facebook, we can block your profile from your Facebook friends.</Text>
      </View>
      <View>
        <Text style={[styles.allText, styles.titleText, {}]}>NO FAKE USERS</Text>
        <Text style={[styles.allText, {}]}>Facebook does a pretty good job at purging fake users. Signing up with Facebook lowers the chances of fake users joining Trippple.</Text>
      </View>
      <TouchableOpacity style={{backgroundColor: colors.shuttleGray, padding: 10, alignSelf: 'center', borderRadius: 50}} onPress={() => { kill() }}>
        <Image source={require('./assets/close.png')} style={{width: 15, height: 15}} />
      </TouchableOpacity>
    </View>
  </ScrollView>
)


const styles = StyleSheet.create({
  allText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'omnes',
    textAlign: 'left',
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'montserrat',
    fontWeight: '800',
  },
});

export default WhyFacebook
