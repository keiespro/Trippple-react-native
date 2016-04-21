/* @flow */

import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Navigator,
} from 'react-native'

import colors from '../../utils/colors'
import ThreeDots from '../../buttons/ThreeDots'
import {MagicNumbers} from '../../DeviceConfig'
import Chat from '../chat'
import AppActions from '../../flux/actions/AppActions'
import MatchActions from '../../flux/actions/MatchActions'
import MatchesStore from '../../flux/stores/MatchesStore'
import customSceneConfigs from '../../utils/sceneConfigs'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class SectionHeader extends Component{
  render(){
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{this.props.content.toUpperCase()}</Text>
      </View>
    )
  }
}

class NewMatches extends Component{
  openChat(nm,e){
    console.log(e,nm)
    this.props.navigator.push({
      component: Chat,
      id:'chat',
      index: 3,
      title: 'CHAT',
      passProps:{
        index: 3,
        user:this.props.user,
        match_id: nm.match_id,
        matchInfo: nm,
        currentMatch: nm
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    });
  }
  render(){
    return (
      <View style={styles.newMatchesContainer}>

        <SectionHeader content={`NEW MATCHES`}/>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          horizontal={true}
          vertical={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {this.props.newMatches.map((nm,i)=>{

            const matchInfo = nm,
                  theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
                  them = theirIds.map((id)=> matchInfo.users[id]);

            let img = them[0].image_url;

            return (
              <View key={'newmatch'+i+nm.match_id} style={styles.listItem}>
                <TouchableOpacity
                  style={{borderRadius:45}}
                  onPress={this.openChat.bind(this,nm)}
                >
                  <Image
                    source={{uri:img}}
                    defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                    style={styles.listItemImage}
                  />
                  {__DEBUG__ && <Text>{nm.match_id}</Text>}
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>

        <SectionHeader content={`MESSAGES`}/>

      </View>
    )
  }
}


export default NewMatches;

const styles = StyleSheet.create({
  newMatchesContainer:{
    height:180,
    backgroundColor:colors.outerSpace,
    overflow:'hidden',
    flexDirection:'column'
  },
  contentContainer:{
    backgroundColor:colors.outerSpace,
    height:120,
    alignItems:'center',
    justifyContent:'center'
  },
  scrollView:{
    backgroundColor:colors.outerSpace,
    flex:1,
  },
  listItem:{
    height:80,
    width:80,
    margin:7
  },
  listItemImage:{
    height:80,
    width:80,
    borderRadius:40
  },
  sectionHeader:{
    height:25,
    paddingHorizontal:10,
    paddingVertical:15,
    backgroundColor:colors.dark,
    width:DeviceWidth,
    overflow:'hidden',
    alignItems:'flex-start',
    justifyContent:'center'
  },
  sectionHeaderText:{
    fontFamily:'omnes',
    fontSize:14,
    color:colors.offwhite,
    fontWeight:'500',
    fontFamily:'Montserrat'
  }
})
