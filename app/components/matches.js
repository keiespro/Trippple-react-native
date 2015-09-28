/* @flow */


import React from 'react-native'
import {
Component,
 StyleSheet,
 Text,
 Image,
 View,
 TouchableHighlight,
 TextInput,
 PixelRatio,
 InteractionManager,
 ListView,
 Navigator,
 Dimensions,
 ScrollView
} from 'react-native'

import colors from '../utils/colors'
import ThreeDots from '../buttons/ThreeDots'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import ActionModal from './ActionModal'

import _ from 'underscore'
import alt from '../flux/alt'
import Chat from './chat'
import MatchActions from '../flux/actions/MatchActions'
import MatchesStore from '../flux/stores/MatchesStore'
import FavoritesStore from '../flux/stores/FavoritesStore'
import Swipeout from 'react-native-swipeout'
import Logger from '../utils/logger'
import customSceneConfigs from '../utils/sceneConfigs'
import SegmentedView from '../controls/SegmentedView'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import AltContainer from 'alt/AltNativeContainer'
import FakeNavBar from '../controls/FakeNavBar'
import Mixpanel from '../utils/mixpanel'


@reactMixin.decorate(TimerMixin)
class MatchList extends Component{

  static defaultProps = {
  }
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isVisible:false,
      scrollEnabled: true
    }

  }

  componentDidMount() {
    Mixpanel.track('On - Matches Screen');
  }

  // componentWillReceiveProps(newProps){
  //   this._updateDataSource(newProps.matches)
  //
  // }

  _allowScroll(scrollEnabled) {
    console.log('toggle scroll:',scrollEnabled)
    // if(scrollEnabled != this.state.scrollEnabled) {
      this._listView.setNativeProps({ scrollEnabled })
    // }
  }

  _updateDataSource(data) {
    this.props.updateDataSource(data)
  }


  //  set active swipeout item
  _handleSwipeout(sectionID, rowID) {
    const rows = this.props.matches;
    for (var i = 0; i < rows.length; i++) {
      if (i != rowID) { rows[i].active = false }
      else {rows[i].active = true}
    }
    this._updateDataSource(rows)
  }
  toggleFavorite(rowData){
    console.log("TOGGLE FAVORITE",rowData);
    MatchActions.toggleFavorite(rowData.id);
  }
  actionModal(match){
      this.props.chatActionSheet(match)

  }
  // https://github.com/dancormier/react-native-swipeout/wiki/Closing-Swipeouts
  _renderRow(rowData, sectionID, rowID){

    var myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;

    var threadName = rowData.users.them.users.map( (user,i) => user.firstname.trim() ).join(' & ');
    var modalVisible = this.state.isVisible
    var self = this

      function toggleFavorite(){
      self.toggleFavorite(rowData)

    }
    return (
      <Swipeout
        left={[ {
              onPress: self.actionModal.bind(self,rowData),
              underlayColor: 'black',
              component: ( <View><ThreeDots/></View>),
              backgroundColor: colors.dark,
            }
         ]}

        right={[
          {
            component: (rowData.isFavourited ? <ActiveStarButton/> : <EmptyStarButton/>),
            onPress: toggleFavorite,
            backgroundColor: colors.dark,
            underlayColor: 'black',
          }
        ]}

        backgroundColor={colors.dark}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={true}
        scroll={event => this._allowScroll(event)}
        onOpen={(sectionID_, rowID_) => this._handleSwipeout(sectionID_, rowID_)}>

        <TouchableHighlight onPress={(e) => {
            console.log('onpress Swipeout',e);
            this._pressRow(rowData.match_id);
          }}
            key={rowData.match_id+'match'}>

        <View>
          <View style={styles.row}>
            <View style={styles.thumbswrap}>
               <Image
                 key={'userimage'+rowID}
                 style={styles.thumb}
                 source={{uri: rowData.couple ? rowData.couple.thumb_url : rowData.users.them.users[0].thumb_url}}
                 defaultSource={require('image!placeholderUser')}
                 resizeMode={Image.resizeMode.cover}
               />

            </View>
            <View style={styles.textwrap}>
              <Text style={[styles.text,styles.title]}>
                {threadName}
              </Text>
              <Text style={styles.text}>
                {rowData.recent_message.message_body || 'New Match'}
              </Text>
            </View>



          </View>
        </View>
      </TouchableHighlight>
      </Swipeout>
    );
  }
  _pressRow(matchID: number) {
    // get messages from server and open chat view

    this.props.navigator.push({
      component: Chat,
      id:'chat',
      index: 3,
      title: 'CHAT',
      passProps:{
        index: 3,
        matchID: matchID,
        navigator: this.props.navigator,
        route: {
          component: Chat,
          id:'chat',
          index: 3,
          title: 'CHAT'
        }
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    });
  }

  render(){
    var self = this, isVisible = modalVisible = this.state.isVisible
    return (
      <View style={styles.container}>
        <View style={{height:50}}>

          <SegmentedView
            barPosition={'bottom'}
            style={{backgroundColor:colors.dark}}
            barColor={colors.mediumPurple}
            titles={['ALL', 'FAVORITES']}
            index={this.state.index}
            titleStyle={{fontFamily:'Montserrat',fontSize:15,padding:5,color:colors.shuttleGray}}
            selectedTitleStyle={{color:colors.white}}
            stretch
            onPress={index => this.setState({ index })}
          />
        </View>
        {this.state.index === 0 ?
          <ListView
          initialListSize={12}
          scrollEnabled={this.state.scrollEnabled}
          chatActionSheet={this.props.chatActionSheet}
            onEndReached={ (e) => {
              const nextPage = this.props.matches.length/20 + 1;
              if(this.state.fetching || nextPage === this.state.lastPage){ return false }
              this.setState({lastPage: nextPage })
              MatchActions.getMatches(nextPage);

            }}
            ref={component => this._listView = component}
            dataSource={this.props.dataSource}
            renderRow={this._renderRow.bind(this)}
            />
            :
          <ListView
          initialListSize={12}
          scrollEnabled={this.state.scrollEnabled}
          chatActionSheet={this.props.chatActionSheet}
            onEndReached={ (e) => {
              const nextPage = this.props.matches.length/20 + 1;
              if(this.state.fetching || nextPage === this.state.lastPage){ return false }
              this.setState({lastPage: nextPage })
              MatchActions.getMatches(nextPage);

            }}
            ref={component => this._listView = component}
            dataSource={this.props.favDataSource}
            renderRow={this._renderRow.bind(this)}
            />
          }


        </View>
    );
  }
}



class MatchesInside extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      console.log(props)
    this.state = {
      matches: props.matches,
      isVisible: false,
      dataSource: ds.cloneWithRows(props.matches),
      favDataSource: ds.cloneWithRows(props.favorites)

    }
  }

  componentDidMount(){
    if(this.props.user.id){
        MatchActions.getMatches();
    }
  }
  componentDidUpdate(pProps,pState) {
      console.log(this.props)


  }
  componentWillReceiveProps(newProps) {
    this.setState({
      matches: newProps.matches,
      dataSource: this.state.dataSource.cloneWithRows(newProps.matches)
    })
  }
  _updateDataSource(data) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    })
  }

  render(){
     return (
           <MatchList
            user={this.props.user}
            dataSource={this.state.dataSource}
            favDataSource={this.state.favDataSource}
            matches={this.props.matches}
            updateDataSource={this._updateDataSource.bind(this)}
            id={"matcheslist"}
            chatActionSheet={this.props.chatActionSheet}
            navigator={this.props.navigator}
            route={{
              component: Matches,
              title:'matches',
              id:'matcheslist',
            }}
            title={"matchlist"}
          />

     )

  }

}



class Matches extends Component{

  static defaultProps = {

  }
  constructor(props) {
    super(props);

    this.state = {
      currentMatch:null,
      isVisible:false
    }

  }
  chatActionSheet(match){
    this.setState({
      currentMatch: match,
      isVisible:!this.state.isVisible
    })
  }


  render(){
    return (
        <AltContainer
          stores={{
            matches: (props) => {
              return {
                store: MatchesStore,
                value: MatchesStore.getAllMatches()
              }
            },
            favorites: (props) => {
              return {
                store: FavoritesStore,
                value: FavoritesStore.getAllFavorites()
              }
            },

          }}>
           <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} />
           <ActionModal
              modalHide={()=>{ this.setState({isVisible:false}) }}
              toggleModal={(e)=>{ this.setState({isVisible:false}) }}
              isVisible={this.state.isVisible}
              currentMatch={this.state.currentMatch}
            />
        </AltContainer>
    );
  }
}


var styles = StyleSheet.create({
  noop:{},
  container: {
    backgroundColor: colors.outerSpace,
    marginTop:50,
    flex: 1,
    overflow:'hidden',
    height: DeviceHeight-50,

  },
  navText: {
    color:colors.black,
    fontFamily:'omnes'

  },
  button: {
    backgroundColor: colors.white,
    padding: 15,
    height:70,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: colors.outerSpace,
  },
  topRow: {
    // borderTopWidth: 1,
    // borderTopColor: '#CCCCCC',
  },
  separator: {
    height: 1,
    borderColor: 'transparent',

    backgroundColor: 'transparent',
  },
  thumbswrap: {
    width: 64,
    marginRight:20,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'flex-start',

  },
  thumb: {
    borderRadius: 32,
    width: 64,
    height: 64,
  },
  rightthumb: {
    left: -16
  },
  text: {
    color:colors.rollingStone,
    fontFamily:'omnes',
    fontSize:16
  },
  title:{
    fontSize:20,
    color:colors.white,
    fontWeight:'500'
  },
  textwrap:{
    height: 66,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow:'hidden',
    flex:3,
    alignSelf:'stretch'
  },
  swipeButtons:{
    width:50,
    alignSelf:'center',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height:100,

    marginLeft:0
  }
});


class StarButton extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <View style={styles.swipeButtons}>
          <Image
            style={{alignSelf:'center' }}
            source={require('image!starOutline')}
            resizeMode={Image.resizeMode.cover}
           />
       </View>
    )
  }
}


class ActiveStarButton extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <View style={styles.swipeButtons}>
           <Image
             style={{alignSelf:'center' }}
             source={require('image!star')}
             resizeMode={Image.resizeMode.cover}
           />
       </View>
    )
  }
}


class EmptyStarButton extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <View style={styles.swipeButtons}>
           <Image
             style={{alignSelf:'center' }}
             source={require('image!starOutline')}
             resizeMode={Image.resizeMode.cover}
           />
       </View>
    )
  }
}







module.exports = Matches;
