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
        style={{backgroundColor:colors.outerSpace,width:DeviceWidth-40,flex:1,padding:20,alignSelf:'stretch'}}
      >

        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Height</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.height}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Body Type</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.body_type}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:0}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Bust Size</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.bust_size}</Text>
        </View>
        <View style={{borderBottomWidth:1,borderBottomColor:colors.warmGrey,marginVertical:20}}/>

        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Eye Color</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.eye_color}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:0}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Hair Color</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.hair_color}</Text>
        </View>
        <View style={{borderBottomWidth:1,borderBottomColor:colors.warmGrey,marginVertical:20}}/>

        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Ethnicity</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.ethnicity}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Smoke</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.smoke}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:0}}>
          <Text style={{color:colors.rollingStone,fontSize:20}}>Drink</Text>
          <Text style={{color:colors.white,fontSize:20}} textAlign={'right'}>{profile.drink}</Text>
        </View>
      </View>
    )

  }
}

export default ProfileTable
