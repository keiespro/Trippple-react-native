
import React, {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicatorIOS,
  ScrollView,
  PixelRatio,
  Dimensions,
  PanResponder,
  Easing
} from 'react-native';
import styles from './components/potentials/styles'

import FakeNavBar from './controls/FakeNavBar';
import ScrollableTabView from './scrollable-tab-view'
import SliderTabBar from './components/potentials/SliderTabBar'

import alt from './flux/alt';
import MatchActions from './flux/actions/MatchActions';

import TimerMixin from 'react-timer-mixin';
import colors from './utils/colors';
import Swiper from './controls/swiper';

import reactMixin from 'react-mixin';

import ProfileTable from './components/ProfileTable'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from './DeviceConfig'


class UserDetails extends React.Component{

  constructor(props){
    super()

  }
  render(){
    const {potential} = this.props;
    const rel = this.props.user.relationship_status;

    return (
      <View>
      {rel == 'single' && potential.partner ?
      <View style={{width:MagicNumbers.screenWidth,overflow:'hidden',marginHorizontal:MagicNumbers.screenPadding/2}}>

        <ScrollableTabView tabs={['1','2']} renderTabBar={(props) => <SliderTabBar {...props}  /> }>
              <ProfileTable
            index={0}
            profile={potential.user}
            tabLabel={`${potential.user.firstname}, ${potential.user.age}`}
          />
          <ProfileTable
            index={1}
            profile={potential.partner}
            tabLabel={`${potential.partner.firstname}, ${potential.partner.age}`}
            />
            </ScrollableTabView></View> :

        <View style={{flex:1,width:MagicNumbers.screenWidth, alignSelf:'stretch'}}>
          <View style={[styles.tabs,{ marginHorizontal:MagicNumbers.screenPadding/2,marginBottom:20}]}>
            <Text style={{fontFamily:'Montserrat',fontSize:16,textAlign:'center', color:  colors.white }} >
            {
              `${potential.user.firstname} ${potential.user.age}`
            }
            </Text>
          </View>
          <View style={[styles.singleTab]}>
            <ProfileTable profile={potential.user} tabLabel={'single'}/>
          </View>
        </View>

      }
      </View>

    )
  }
}
export default UserDetails
