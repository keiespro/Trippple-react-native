/* @flow */

import React, {Component} from "react";

import {StyleSheet, Text, Image, TouchableOpacity, View, ListView, Dimensions, ScrollView, Navigator} from "react-native";

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
  constructor(props){
    super()
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.newMatches),
    }
  }
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
  componentWillReceiveProps(nProps){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(nProps.newMatches),
    })
  }
  shouldComponentUpdate(nProps,nState){
    return nProps.newMatches.length != this.props.newMatches.length

  }
  renderRow(rowData,sectionID, rowID, highlightRow){
    const matchInfo = rowData,
          theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
          them = theirIds.map((id)=> matchInfo.users[id]);

    let img = them[0].image_url;

    return (
      <View key={'newmatch'+rowID+rowData.match_id} style={styles.listItem}>
        <TouchableOpacity
          style={{borderRadius:45}}
          onPress={this.openChat.bind(this,rowData)}
        >
          <Image
            source={{uri:img}}
            defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            style={styles.listItemImage}
          />
          {__DEBUG__ && <Text>{rowData.match_id}</Text>}
        </TouchableOpacity>
      </View>
    )
  }
  render(){
    return (
      <View style={styles.newMatchesContainer}>

      <SectionHeader content={`NEW MATCHES` + (__DEBUG__ ? ` (${this.props.newMatches.length})` : '')}/>

      <ListView
          contentContainerStyle={styles.contentContainer}
          horizontal={true}
          vertical={false}
          pageSize={10}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
          />

        <SectionHeader content={`MESSAGES` + (__DEBUG__ ? ` (${this.props.matchesCount})` : '')}/>

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
