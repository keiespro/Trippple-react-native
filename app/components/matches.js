/* @flow */

import React,{Component} from "react";

import {StyleSheet, Text, Image, TouchableOpacity, View, TouchableHighlight, TextInput, PixelRatio, InteractionManager, ListView, Navigator, Dimensions, RefreshControl, Alert, ScrollView} from "react-native";

import colors from '../utils/colors'
import ThreeDots from '../buttons/ThreeDots'
import {MagicNumbers} from '../DeviceConfig'
import ActionModal from './ActionModal'
import _ from 'underscore'
import alt from '../flux/alt'
import Chat from './chat'
import AppActions from '../flux/actions/AppActions'
import MatchActions from '../flux/actions/MatchActions'
import MatchesStore from '../flux/stores/MatchesStore'
import Swipeout from './Swipeout'
import customSceneConfigs from '../utils/sceneConfigs'
import SegmentedView from '../controls/SegmentedView'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import AltContainer from 'alt-container/native';
import FakeNavBar from '../controls/FakeNavBar'
import Analytics from '../utils/Analytics'
import FadeInContainer from './FadeInContainer'
import { BlurView,VibrancyView} from 'react-native-blur'
import UserProfile from './UserProfile'
import NewMatches from './matches/NewMatches'
import NoMatches from './matches/NoMatches'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class MatchList extends Component{

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isVisible:false,
      scrollEnabled: true,
      isRefreshing: false,
      lastPage:0
    }
  }

  componentDidMount() {
    MatchActions.getMatches();
  }

  _allowScroll(scrollEnabled){
    var listref =  '_listView';
this.setState({ scrollEnabled })
    // this[listref] && this[listref].refs.listviewscroll.refs.ScrollView.setNativeProps({ scrollEnabled })
  }

  _updateDataSource(data) {
    this.props.updateDataSource(data)
  }

  _handleSwipeout(sectionID, rowID) {
    this.setState(({unmatchOpen:true}))

    //TODO:
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

  handleCancelUnmatch(rowData){
    this.setTimeout(()=>{
      this.setState(({unmatchOpen:false}))
    },350);

  }

  unmatch(rowData){
    if(this.state.unmatchOpen){return false}
    this.setState({unmatchOpen:true})

    Alert.alert(
      'Remove this match?',
      'Do you want to remove this match?',
      [
        {text: 'Cancel', onPress: () => this.handleCancelUnmatch(rowData), style: 'cancel'},
        {text: 'OK', onPress: () => {
          Analytics.extra('Social',{name: 'Unmatch', match_id: rowData.match_id, match: rowData})
          MatchActions.unMatch(rowData.match_id);
          MatchActions.removeMatch.defer(rowData.match_id);
          this.handleCancelUnmatch();
        } },
      ],
    );
  }

  _pressRow(match_id: number) {
    // TODO: test this InteractionManager out again
    // var handle = InteractionManager.createInteractionHandle();

    // InteractionManager.runAfterInteractions(() => {
      MatchActions.getMessages(match_id);
    // })
    this.props.chatActionSheet()

    this.props.navigator.push({
      component: Chat,
      id:'chat',
      index: 3,
      title: 'CHAT',
      passProps:{
        // handle,
        index: 3,
        match_id: match_id,
        matchInfo: this.props.matches[0]
      },
      sceneConfig: Navigator.SceneConfigs.PushFromRight,
    });
  }

  onEndReached(e){
    const nextPage = parseInt(this.props.matches.length / 20) + 1;
    if(this.state.fetching || nextPage == this.state.lastPage){ return false }

    this.setState({
      lastPage: nextPage,
      isRefreshing: false,
      loadingMoreMatches: true
    })
    this.setTimeout(()=>{
      this.setState({
        loadingMoreMatches:false
      })
    },3000);

    Analytics.event('Interaction',{type: 'scroll', name: 'Load more matches', page: nextPage})

    MatchActions.getMatches(nextPage);
  }

  segmentedViewPress(index){
    this.setState({
      index: index == 0 ? 0 : 1
    })
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.onEndReached();
    // this.setTimeout(()=>{
    //   this.setState({
    //     isRefreshing:false
    //   })
    // },3000);
  }
  chatActionSheet(row){
    this.props.chatActionSheet(row)
  }
  _renderRow(rowData, sectionID, rowID){
    const myId = this.props.user.id;
    const  myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;
    const  theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id);
    const  them = theirIds.map((id)=> rowData.users[id]);
    const  threadName = them.map( (user,i) => user.firstname.trim() ).join(' & ');
    const  modalVisible = this.state.isVisible;
    const  thumb = them[0].thumb_url;
    const  matchImage = thumb
    const  unread = rowData.unread || 0;
    const message_body = rowData.recent_message.message_body.replace(/(\r\n|\n|\r)/gm," ");
    return (
      <Swipeout
        left={
          [{
            threshold: 150,
            action: this.chatActionSheet.bind(this,rowData),
            backgroundColor: colors.dark,
          }]
          }
          right={
          [{
            threshold: 150,
            component: true,
            action: this.unmatch.bind(this,rowData),
            backgroundColor: rowData.isFavourited ? colors.dandelion : colors.dark,
          }]
        }
        rowData={rowData}
        backgroundColor={colors.dark}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={true}
        scroll={this._allowScroll.bind(this)}
        onOpen={(sectionID_, rowID_) => {this._handleSwipeout(sectionID_, rowID_)}}
      >
        <TouchableHighlight
          onPress={(e) => {
            // if(this.state.isVisible || !this.state.scrollEnabled){ return false}
            this._pressRow(rowData.match_id);
          }}
          key={rowData.match_id+'match'}
        >
          <View>
            {__DEBUG__ && <Text style={{color:'#fff'}}>{
              new Date(rowData.recent_message.created_timestamp*1000).toLocaleString()  + ' | match_id: ' + rowData.match_id
            }</Text>}

            <View style={styles.row}>
              <View style={styles.thumbswrap}>
                <Image
                  key={'userimage'+rowID}
                  style={styles.thumb}
                  source={ {uri: matchImage}}
                  resizeMode={Image.resizeMode.cover}
                  defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                />
               {unread ?
                  <View style={styles.newMessageCount}>
                   <Text style={{fontFamily:'Montserrat-Bold',color:colors.white,textAlign:'center',fontSize:14}}>{
                     unread
                   }</Text>
                 </View>
                : null }
              </View>
              <View style={styles.textwrap}>
                <Text style={[styles.text,styles.title]}>
                  {threadName.toUpperCase()}
                </Text>
                <Text style={styles.text}>
                  {message_body || 'New Match'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>

    );
  }

  render(){
    var isVisible = this.state.isVisible;
    if(!this.props.matches.length && !this.props.newMatches.length){
      return <NoMatches/>
    }

    return (
      <View>
        <ListView
          dataSource={this.props.dataSource}
          chatActionSheet={this.props.chatActionSheet}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={200}
          ref={component => this._listView = component}
          renderRow={this._renderRow.bind(this)}
          style={{height:DeviceHeight-53,marginTop:53,overflow:'hidden',backgroundColor:colors.outerSpace}}
          scrollEnabled={this.state.scrollEnabled}
          directionalLockEnabled={true}
          removeClippedSubviews={true}
          vertical={true}
          initialListSize={5}
          scrollsToTop={true}
          contentOffset={{x:0,y:this.state.isRefreshing ? -50 : 0}}
          renderHeader={()=>{
            if(!this.props.newMatches || !Object.keys(this.props.newMatches).length){
              return false;
            }else{
              return (
                <NewMatches
                  user={this.props.user}
                  navigator={this.props.navigator}
                  newMatches={this.props.newMatches}
                  matchesCount={this.props.matches.length}
                />
              )
            }
          }}
         />
        {this.state.loadingMoreMatches && false ?
          <View style={{position:'absolute',bottom:0,width:DeviceWidth,height:30}}>
            <ActivityIndicator style={{alignSelf:'center',alignItems:'center',flex:1,height:60,width:60,justifyContent:'center'}} animating={true} />
          </View> :
        null}



      </View>
    )
  }
}

reactMixin.onClass(MatchList, TimerMixin)


function rowHasChanged(r1, r2){
  return r1.id != r2.id || r1.recentMessage != r2.recentMessage
}


class MatchesInside extends Component{

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // this.fds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      matches: props.matches,
      favorites: props.favorites,
      isVisible: false,
      dataSource: this.ds.cloneWithRows(props.matches),
      // favDataSource: this.fds.cloneWithRows(props.matches)
    }
  }

  chatActionSheet(match){
    if(match){
      this.setState({
        isVisible:true,

          currentMatch: match
        })
      // },10)
    }else{
      this.setState({
        isVisible:false
      })
    }
  }

  showProfile(match){
    Analytics.event('Interaction',{type:'tap',name: 'View user profile', match_id: match.match_id, match })

    this.props.navigator.push({
      component: UserProfile,
      passProps:{match, hideProfile: ()=> {
        this.props.navigator.pop()
      }},
      name: `User Profile`
    })
  }

  toggleModal(){
    this.setState({
      isVisible:!this.state.isVisible,

    })
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      matches: newProps.matches,
      dataSource: this.ds.cloneWithRows(newProps.matches),
      // favDataSource: this.ds.cloneWithRows(newProps.matches),
      // favorites: newProps.favorites
    })

    if(newProps.matches[0]){
      this._updateDataSource(newProps.matches,'matches')
    }
    // if(newProps.favorites[0] ){
    //   this._updateDataSource(newProps.matches,'favorites')
    // }
  }

  _updateDataSource(data,whichList) {
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.match_id !== r2.match_id});
    if(data.length > 1){
      const newState =  {
        matches: data,
        dataSource: this.ds.cloneWithRows(data || []),
      };
      this.setState(newState)
    }
  }

  render(){
    return (
      <View>
      {__TEST__ && <FakeNavBar
        hideNext={true}
        backgroundStyle={{backgroundColor:colors.shuttleGray}}
        titleColor={colors.white}
        title={'MESSAGES'} titleColor={colors.white}
        onPrev={(nav,route)=> nav.pop()}
        customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}} source={{uri:'assets/close@3x.png'}} />
        }
      />}
        <MatchList
          user={this.props.user}
          dataSource={this.state.dataSource}
          matches={this.state.matches || this.props.matches}
          newMatches={this.props.newMatches}
          updateDataSource={this._updateDataSource.bind(this)}
          id={"matcheslist"}
          chatActionSheet={this.chatActionSheet.bind(this)}
          navigator={this.props.navigator}
          route={{
            component: Matches,
            title:'Matches',
            id:'matcheslist',
          }}
          title={"matchlist"}
        />

        {this.props.navBar}

        {this.state.isVisible && this.state.currentMatch ? <View
            style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]}>
            <FadeInContainer delayAmount={1} duration={200}>
                  <View   style={[{width:DeviceWidth,position:'absolute',top:0,left:0,height:DeviceHeight}]}>
              <VibrancyView
                    blurType="light"
                    style={[{width:DeviceWidth,position:'absolute',top:0,left:0,height:DeviceHeight}]} />
                </View>
              </FadeInContainer>


           </View> : <View/>}

           <ActionModal
             user={this.props.user}
             navigator={this.props.navigator}
             toggleModal={this.toggleModal.bind(this)}
             isVisible={this.state.isVisible }
             currentMatch={this.state.currentMatch}
           />

      </View>


    )

  }

}

reactMixin.onClass(MatchesInside, TimerMixin)


class Matches extends Component{

  constructor(props) {
    super();

    this.state = {
      currentMatch:null,
      isVisible:false
    }
  }

  chatActionSheet(match){


    if(match){
      // this.setState({
      //   isVisible:!this.state.isVisible
      // })
      // this.setTimeout(()=>{
        this.setState({
          isVisible:true,
        currentMatch: match
        })
      // },10)
    }else{
      this.setState({
        isVisible:false
      })
    }
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
    // AppActions.saveStores.defer()
  }
  toggleModal(){
    this.setState({
      isVisible:!this.state.isVisible,
      // currentMatch:null
    })
  }
  shouldComponentUpdate(nProps,nState){
    return true
    // return this.state.isVisible != nState.isVisible || this.state.currentMatch != nState.currentMatch
  }

  render(){

    var storesForMatches = {
      matches: (props) => {
        return {
          store: MatchesStore,
          value: MatchesStore.getAllMatches()
        }
      },
      newMatches: (props) => {
        return {
          store: MatchesStore,
          value: MatchesStore.getNewMatches()
        }
      },

    };

    return __TEST__ ?  <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} /> : (
      <AltContainer stores={storesForMatches}>
        <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} />
      </AltContainer>
    )
  }
}


const styles = StyleSheet.create({
  noop:{},
  container: {
    backgroundColor: colors.dark,
    marginTop:55,
    flex: 1,
    height: DeviceHeight-55,
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
    fontSize:17
  },
  title:{
    fontSize:16,
		fontFamily: 'Montserrat-Bold',
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
             source={{uri: 'assets/star@3x.png'}}
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
             source={{uri: 'assets/starOutline@3x.png'}}
             resizeMode={Image.resizeMode.cover}
           />
       </View>
    )
  }
}

Matches.displayName = "Matches";


reactMixin.onClass(Matches, TimerMixin)



export default Matches;
