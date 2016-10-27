import React, {Component} from 'react';
import {StyleSheet, Text, Dimensions, View, LayoutAnimation, TouchableHighlight, Image, TouchableOpacity, Animated, ScrollView, PanResponder, Easing} from 'react-native';

import colors from '../utils/colors';
import profileOptions from '../data/get_client_user_profile_options'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../utils/DeviceConfig'

class ProfileTable extends Component{

  constructor(props){
    super()

    this.state = {


    }
  }
  render(){
    const { profile } = this.props
    let {body_type, height, age} = profile
    if (Number.isInteger(parseInt(body_type))){
      body_type = profileOptions.body_type.values[body_type] || ''
    }
    height = profileOptions.height.values[height] || height;
    return (
      <View
      pointerEvents={'none'}
        style={{
          width: MagicNumbers.screenWidth,
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
        >
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Gender</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{
              profile.gender && profile.gender == 'm' ? 'Male' : 'Female'
            }</Text>
        </View>
        {profile.age && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Age</Text>
          <Text style={{color: colors.white, fontSize: 18, fontFamily: 'omnes', }} textAlign={'right'}>{age}</Text>
          </View>}
        {profile.height && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Height</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{height}</Text>
          </View>}
        {profile.body_type && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Body Type</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{body_type}</Text>
          </View>}

        {/* <View style={{borderBottomWidth:1,borderBottomColor:colors.shuttleGray,marginVertical:20}}/> */}

        {profile.eye_color && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Eye Color</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{profile.eye_color}</Text>
          </View>}
        {profile.hair_color && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Hair Color</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{profile.hair_color}</Text>
          </View>}

        {/* <View style={{borderBottomWidth:1,borderBottomColor:colors.shuttleGray,marginVertical:20}}/> */}

        {profile.ethnicity && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Ethnicity</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{profile.ethnicity}</Text>
          </View>}
        {profile.smoke && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Smoke</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{profile.smoke}</Text>
          </View>}
        {profile.drink && <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
          <Text style={{color: colors.rollingStone, fontFamily: 'omnes', fontSize: 18}}>Drink</Text>
          <Text style={{color: colors.white, fontFamily: 'omnes', fontSize: 18}} textAlign={'right'}>{profile.drink}</Text>
          </View>}
      </View>

    )
  }
}

export default ProfileTable
