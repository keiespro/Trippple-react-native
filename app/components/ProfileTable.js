/* @flow */

import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  PanResponder,
  Easing
} from 'react-native';

 import colors from '../utils/colors';
 import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import { MagicNumbers } from '../DeviceConfig'

class ProfileTable extends Component{

  constructor(props){
    super()

    this.state = {


    }
  }
  render(){
    var { profile } = this.props

    return (
      <View
      style={{
        backgroundColor:colors.outerSpace,
        flex:1,
      overflow:'hidden',
      marginHorizontal: this.props.location == 'settings' ? MagicNumbers.screenPadding/2 : 0,
        // left:MagicNumbers.screenPadding/2,
          paddingVertical:20,
          width:MagicNumbers.screenWidth,
          alignSelf:'stretch',
          alignItems:'stretch'

      }}
      >
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15,flex:1,}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Gender</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{
              profile.gender && profile.gender == 'm' ? 'Male' : 'Female'
            }</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Height</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.height}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:0}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Body Type</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.body_type}</Text>
        </View>

        <View style={{borderBottomWidth:1,borderBottomColor:colors.shuttleGray,marginVertical:20}}/>

        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Eye Color</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.eye_color}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:0}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Hair Color</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.hair_color}</Text>
        </View>

        <View style={{borderBottomWidth:1,borderBottomColor:colors.shuttleGray,marginVertical:20}}/>

        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Ethnicity</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.ethnicity}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Smoke</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.smoke}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:0}}>
          <Text style={{color:colors.rollingStone,fontSize:18}}>Drink</Text>
          <Text style={{color:colors.white,fontSize:18}} textAlign={'right'}>{profile.drink}</Text>
        </View>

      </View>
    )

  }
}

export default ProfileTable
