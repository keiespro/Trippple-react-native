/* @flow */


import React from 'react-native'
import {
Component,
 StyleSheet,
 Text,
 Image,
 TouchableOpacity,
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
import AppActions from '../flux/actions/AppActions'
import MatchActions from '../flux/actions/MatchActions'
import MatchesStore from '../flux/stores/MatchesStore'
// import FavoritesStore from '../flux/stores/FavoritesStore'
import Swipeout from './Swipeout'
import Logger from '../utils/logger'
import customSceneConfigs from '../utils/sceneConfigs'
import SegmentedView from '../controls/SegmentedView'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import AltContainer from 'alt/AltNativeContainer'
import FakeNavBar from '../controls/FakeNavBar'
import Mixpanel from '../utils/mixpanel'
import FadeInContainer from './FadeInContainer'
import { BlurView,VibrancyView} from 'react-native-blur'

import UserProfile from './UserProfile'

@reactMixin.decorate(TimerMixin)
class MatchList extends Component{

  static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isVisible:false,
      scrollEnabled: true
    }

  }

  componentDidMount() {
    MatchActions.getMatches();
    MatchActions.getFavorites.defer();

    Mixpanel.track('On - Matches Screen');
  }


  _allowScroll = (scrollEnabled,listindex)=> {
    var listref = listindex == 0 ? '_listView' : '_flistView'
    this[listref] && this[listref].refs.listviewscroll.refs.ScrollView.setNativeProps({ scrollEnabled })
  }

  // shouldComponentUpdate =(nProps,nState)=> nProps.matches.length > this.props.matches.length

  _updateDataSource(data) {
    this.props.updateDataSource(data)
  }


  //  set active swipeout item
  _handleSwipeout(sectionID, rowID) {
    // const rows = this.props.matches;
    // for (var i = 0; i < rows.length; i++) {
    //   if (i != rowID) { rows[i].active = false }
    //   else {rows[i].active = true}
    // }
    // this._updateDataSource(rows)
  }

  toggleFavorite(rowData){
    MatchActions.toggleFavorite(rowData.match_id.toString());
  }

  actionModal(match){
      this.props.chatActionSheet(match)
  }

  _renderRow(rowData, sectionID, rowID){
    const myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;
    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> rowData.users[id])
    var threadName = them.map( (user,i) => user.firstname.trim() ).join(' & ');
    var modalVisible = this.state.isVisible
    var self = this
    var matchImage = ( them.couple && them.couple.thumb_url ) || them[0].thumb_url || them[1].thumb_url || null

    var unreadCount = rowData.unreadCount || 0

    return (

      <Swipeout
        left={
          [{
            threshold: 200,
            action: self.actionModal.bind(self,rowData),
            backgroundColor: colors.dark,
          }]
        }
        right={
          [{
            threshold: 200,
            component: true,
            action: () => self.toggleFavorite(rowData),
            backgroundColor: rowData.isFavourited ? colors.dandelion : colors.dark,
          }]
        }
        rowData={rowData}
        backgroundColor={colors.dark}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={false}
        scroll={event => this._allowScroll(event,this.state.index)}
        onOpen={(sectionID_, rowID_) => {this._handleSwipeout(sectionID_, rowID_)}}
        >

        <TouchableHighlight onPress={(e) => {
            if(this.state.isVisible || !this.state.scrollEnabled){ return false}
            this._pressRow(rowData.match_id);
          }}
            key={rowData.match_id+'match'}>

        <View>
          <View style={styles.row}>
            <View style={styles.thumbswrap}>
               <Image
                 key={'userimage'+rowID}
                 style={styles.thumb}
                 source={matchImage ? {uri: matchImage} : {uri:'../../newimg/placeholderUser.png'}}
                 resizeMode={Image.resizeMode.cover}
                  defaultSource={{uri:'../../newimg/placeholderUser.png'}}
               />
             {unreadCount ?
                <View style={styles.newMessageCount}>
                 <Text style={{fontFamily:'Montserrat-Bold',color:colors.white,textAlign:'center',fontSize:14}}>{
                   unreadCount
                 }</Text>
               </View>
               : null }
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
  _pressRow(match_id: number) {
    // get messages from server and open chat view
    var handle = InteractionManager.createInteractionHandle();

    InteractionManager.runAfterInteractions(() => {
      MatchActions.getMessages(match_id);
   })

    this.props.navigator.push({
      component: Chat,
      id:'chat',
      index: 3,
      title: 'CHAT',
      passProps:{
        handle,
        index: 3,
        match_id: match_id,
        navigator: this.props.navigator,
        matchInfo: this.props.matches[0]
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    });



  }

  render(){
    var self = this,
        isVisible = this.state.isVisible;

    return (
      <View style={styles.container}>
        <View style={{height:50}}>

          <SegmentedView
            barPosition={'bottom'}
            style={{backgroundColor:colors.dark}}
            barColor={colors.mediumPurple}
            titles={['ALL', 'FAVORITES']}
            index={this.state.index}
            titleStyle={{
              fontFamily:'Montserrat',
              fontSize:15,
              padding:5,
              color:colors.shuttleGray
            }}
            selectedTitleStyle={{color:colors.white}}
            stretch
            onPress={index => this.setState({ index })}
          />
        </View>

        {this.state.index === 0 ?
          (this.props.matches.length > 0 ?
          <ListView
            initialListSize={12}
            scrollEnabled={this.state.scrollEnabled}
            directionalLockEnabled={true}
            vertical={true}
            chatActionSheet={this.props.chatActionSheet}
            onEndReached={ (e) => {
              const nextPage = this.props.matches.length / 20 + 1;
              if(this.state.fetching || nextPage === this.state.lastPage){ return false }

              this.setState({lastPage: nextPage })
              MatchActions.getMatches(nextPage);
            }}
            ref={component => this._listView = component}
            dataSource={this.props.dataSource}
            renderRow={this._renderRow.bind(this)}
          /> :
            <NoMatches/>
            )
            :
          (this.props.favorites.length > 0 ?
          <ListView
            initialListSize={12}
            scrollEnabled={this.state.scrollEnabled}
            removeClippedSubviews={true}
            directionalLockEnabled={true}
            vertical={true}
            chatActionSheet={this.props.chatActionSheet}
            onEndReached={ (e) => {
             // const nextPage = this.props.favorites.length/20 + 1;
              // if(this.state.fetching || nextPage === this.state.lastPage){ return false }
              // this.setState({lastPage: nextPage })
              // MatchActions.getFavorites(nextPage);
            }}
            ref={component => this._flistView = component}
            dataSource={this.props.favDataSource}
            renderRow={this._renderRow.bind(this)}

            /> :
            <NoFavorites/>
        )}

        </View>
    );
  }
}



class MatchesInside extends Component{

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.fds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      matches: props.matches,
      favorites: props.favorites,
      isVisible: false,
      dataSource: this.ds.cloneWithRows(props.matches),
      favDataSource: this.fds.cloneWithRows(props.favorites)

    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      matches: newProps.matches,
      dataSource: this.ds.cloneWithRows(newProps.matches),
      favDataSource: this.ds.cloneWithRows(newProps.favorites),
      favorites: newProps.favorites
    })

    if(newProps.matches[0]){
      this._updateDataSource(newProps.matches,'matches')
    }
    if(newProps.favorites[0] ){
      this._updateDataSource(newProps.favorites,'favorites')
    }

  }

  // shouldComponentUpdate(nProps,nState){

  //   var {matches,favorites} = this.state


  //   var matchesDidUpdate = (matches && matches[0] && matches[0].unreadCount || nProps.matches && nProps.matches[0] && nProps.matches[0].unreadCount) || (matches.length != nProps.matches.length);
  //   var favsDidUpdate = ((favorites && favorites[0] && favorites[0].unreadCount) || (nProps.favorites && nProps.favorites[0] && nProps.favorites[0].unreadCount)) || (nProps.favorites && favorites.length != nProps.favorites.length);

  //   return matchesDidUpdate || favsDidUpdate

  // }

  _updateDataSource(data,whichList) {
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.match_id !== r2.match_id});
    if(data.length > 1){
      const newState = (whichList == 'matches') ? {
        matches: data,
        dataSource: this.ds.cloneWithRows(data || []),
      } : {
        favorites: data,
        favDataSource: this.fds.cloneWithRows(data || []),
      };
      this.setState(newState)
    }
  }

  render(){
    return (
      <MatchList
        user={this.props.user}
        dataSource={this.state.dataSource}
        favDataSource={this.state.favDataSource}
        matches={this.state.matches || this.props.matches}
        favorites={this.state.favorites || this.props.favorites}
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

class NoMatches extends Component{

  render(){
    return (
      <ScrollView
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
        scrollEnabled={false}
        centerContent={true}
        style={{
          backgroundColor:colors.outerSpace,
          flex:1,
          alignSelf:'stretch',
          width:DeviceWidth
        }}
        >
        <FadeInContainer>
          <View
            style={{flexDirection:'column',padding:20,justifyContent:'space-between',alignItems:'center',alignSelf:'stretch',paddingBottom:80,}}
            >
            <Image
              style={{width:300,height:100,marginBottom:0 }}
              source={require('../../newimg/listing.png')}
              resizeMode={Image.resizeMode.contain}
            />
            <Image
              style={{width:300,height:100,marginBottom:20 }}
              source={require('../../newimg/listing.png')}
              resizeMode={Image.resizeMode.contain}
            />
            <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',marginBottom:20}}>{
              `WAITING FOR MATCHES`
            }</Text>
            <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes',textAlign:'center'}}>{
              `Your conversations with your matches will appear in this screen`
            }</Text>
          </View>
        </FadeInContainer>

      </ScrollView>
    )
  }
}


class NoFavorites extends Component{

  render(){
    return (

      <ScrollView
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
        scrollEnabled={false}
        centerContent={true}
        style={{
        backgroundColor:colors.outerSpace,
        flex:1,
        alignSelf:'stretch',
        width:DeviceWidth}}
        >
        <FadeInContainer>

          <View
            style={{
              flexDirection:'column',
              padding:20,
              justifyContent:'space-between',
              alignItems:'center',
              alignSelf:'stretch',
              paddingBottom:80,
            }}
            >

            <Image
              style={{width:175,height:180,marginBottom:40 }}
              source={require('../../newimg/iconPlaceholderFavs.png')}
              resizeMode={Image.resizeMode.contain}
            />

            <Text
              style={{
                color:colors.white,
                fontSize:22,
                fontFamily:'Montserrat-Bold',
                textAlign:'center',
                marginBottom:20
              }}
              >{
                `YOUR FAVORITE PEOPLE`
              }
            </Text>
            <Text
              style={{
                color:colors.shuttleGray,
                fontSize:20,
                fontFamily:'omnes',
                textAlign:'center'
              }}
              >{
                `Tap on the star next to  to add matches to your favorites for easy access`
              }
            </Text>

          </View>
        </FadeInContainer>

      </ScrollView>
    )
  }
}
class Matches extends Component{

  constructor(props) {
    super();

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

  showProfile(match){
    this.props.navigator.push({
      component: UserProfile,
      passProps:{match, hideProfile: ()=> {
        this.props.navigator.pop()
      }}
    })
}
componentDidUpdate(){
        AppActions.saveStores.defer(2)
}
  render(){

    var storesForMatches = {
      matches: (props) => {
        return {
          store: MatchesStore,
          value: MatchesStore.getAllMatches()
        }
      },

      favorites: (props) => {
        return {
          store: MatchesStore,
          value: MatchesStore.getAllFavorites()
        }
      },

    }
    return (
        <AltContainer stores={storesForMatches}>

          <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} />

          {this.props.navBar}

          {this.state.isVisible ?
          <FadeInContainer
            duration={300}
            style={{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}}
            >
            <TouchableOpacity activeOpacity={0.5} onPress={(e)=>{ this.setState({isVisible:false}) }}>
              <BlurView
                blurType="light"
                style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]}
                >
                <View style={[{}]}/>
              </BlurView>
            </TouchableOpacity>
          </FadeInContainer> : <View/>
          }

          <View>
            <ActionModal
              user={this.props.user}
              navigator={this.props.navigator}
              toggleModal={(e)=>{ this.setState({isVisible:false}) }}
              isVisible={this.state.isVisible}
              currentMatch={this.state.currentMatch}
            />
          </View>

        </AltContainer>
    )
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
    backgroundColor:colors.dark
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
  },
  newMessageCount:{
    backgroundColor:colors.mandy,
    position:'absolute',
    bottom:-5,
    right:-5,
    borderRadius:15,
    overflow:'hidden',
    borderColor:colors.outerSpace,
     borderWidth:4,
     width:30,
     height:30,
     padding:0,
     alignItems:'center',
     justifyContent:'center',
     flexDirection:'row'
  }
});


class StarButton extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
       this.props.startValue ?  <ActiveStarButton {...this.props}/> : <EmptyStarButton {...this.props}/>

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
             source={require('../../newimg/star.png')}
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
             style={{alignSelf:'center',
             tintColor: this.props.activeLevel

           }}
             source={require('../../newimg/starOutline.png')}
             resizeMode={Image.resizeMode.cover}
           />
       </View>
    )
  }
}







module.exports = Matches;
