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
 RefreshControl,
 Alert,
 ScrollView
} from 'react-native'

import colors from '../utils/colors'
import ThreeDots from '../buttons/ThreeDots'
import {MagicNumbers} from '../DeviceConfig'

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
import AltContainer from 'alt-container/native';

import FakeNavBar from '../controls/FakeNavBar'
import Mixpanel from '../utils/mixpanel'
import FadeInContainer from './FadeInContainer'
import { BlurView,VibrancyView} from 'react-native-blur'

import UserProfile from './UserProfile'

class MatchList extends Component{

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isVisible:false,
      scrollEnabled: true,
      isRefreshing: false,

    }

  }

  componentDidMount() {
    MatchActions.getMatches();
    // MatchActions.getFavorites.defer();

    Mixpanel.track('On - Matches Screen');
  }


  _allowScroll(scrollEnabled){
    var listref = this.state.index ? '_flistView' :  '_listView';
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
  unmatch(rowData){
    Alert.alert(
      'Remove this match?',
      'Do you want to remove this match?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          MatchActions.unMatch(rowData.match_id);
          MatchActions.removeMatch.defer(rowData.match_id);
        } },
      ],
    );
  }
  _renderRow(rowData, sectionID, rowID){
    console.log(rowData)
    const myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;
    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id);
    var them = theirIds.map((id)=> rowData.users[id]);
    var threadName = them.map( (user,i) => user.firstname.trim() ).join(' & ');
    var modalVisible = this.state.isVisible;
    var thumb = ( them.couple && them.couple.thumb_url ) || them[0].thumb_url || them[1].thumb_url || null;
      /*
       * TODO:
       * this deals with test bucket urls
       * but not very maintainable
       */
      var matchImage;
      var img = thumb;//(thumb_url && typeof thumb_url === 'string' ? thumb_url : image_url);
      if(img && img.includes('test')){
        var u = img;
        var x = u.split('/test/')[0].split('uploads') + u.split('test')[1];
        matchImage = x.split('/images')[0] + x.split('/images')[1]
      }else{
        matchImage = +'';
      }


    var unread = rowData.unread || 0;

    return (

      <Swipeout
        left={
          [{
            threshold: 200,
            action: this.props.chatActionSheet.bind(this,rowData),
            backgroundColor: colors.dark,
          }]
        }
        right={
          [{
            threshold: 200,
            component: true,
            action: this.unmatch.bind(this,rowData),
            backgroundColor: rowData.isFavourited ? colors.dandelion : colors.dark,
          }]
        }
        rowData={rowData}
        backgroundColor={colors.dark}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={false}
        scroll={this._allowScroll.bind(this)}
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
                 source={matchImage ? {uri: matchImage} : {uri: 'assets/placeholderUser@3x.png'}}
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

  onEndReached(e){
    const nextPage = this.props.matches.length / 20 + 1;
    if(this.state.fetching || nextPage === this.state.lastPage){ return false }

    this.setState({lastPage: nextPage,
        isRefreshing: false,
    })
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
    this.setTimeout(()=>{
      this.setState({
        isRefreshing:false
      })
    },3000);
  }

  render(){
    var isVisible = this.state.isVisible;

    return (
        <View style={[styles.container,{ }]}>
          <View style={{height:0, }}>

          <SegmentedView
            style={{backgroundColor: colors.dark}}
            barColor={colors.mediumPurple}
            titles={['','']/*['ALL', 'FAVORITES']*/}
            index={this.state.index}
            titleStyle={{
              fontFamily: 'Montserrat',
              fontSize:15,
              padding:5,
              color:colors.shuttleGray
            }}
            selectedTitleStyle={{color:colors.white}}
            stretch
            onPress={this.segmentedViewPress.bind(this)}
          />
        </View>

        {this.state.index == 0 ?
          (this.props.matches.length > 0 ?
          <ListView
            chatActionSheet={this.props.chatActionSheet}
            onEndReached={this.onEndReached.bind(this)}
            ref={component => this._listView = component}
            dataSource={this.props.dataSource}
            initialListSize={8}
            renderRow={this._renderRow.bind(this)}
            renderScrollComponent={(props) => <ScrollView
              scrollEnabled={this.state.scrollEnabled}
              directionalLockEnabled={true}
              removeClippedSubviews={true}
              vertical={true}
              contentOffset={{x:0,y:this.state.isRefreshing ? -50 : 0}}
                  refreshControl={
                    <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    tintColor={colors.sushi}
                    colors={[colors.mediumPurple,colors.sushi]}
                    progressBackgroundColor={colors.dark}
                  />
                }/>

              }
          /> :
            <NoMatches/> ) :
          (this.props.favorites.length > 0 ?
          <ListView
            scrollEnabled={this.state.scrollEnabled}
            removeClippedSubviews={true}
            directionalLockEnabled={true}
            vertical={true}
            chatActionSheet={this.props.chatActionSheet}
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

reactMixin.onClass(MatchList, TimerMixin)


function rowHasChanged(r1, r2){
  return r1.id != r2.id || r1.recentMessage != r2.recentMessage
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
      favDataSource: this.fds.cloneWithRows(props.matches)

    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      matches: newProps.matches,
      dataSource: this.ds.cloneWithRows(newProps.matches),
      favDataSource: this.ds.cloneWithRows(newProps.matches),
      favorites: newProps.favorites
    })

    if(newProps.matches[0]){
      this._updateDataSource(newProps.matches,'matches')
    }
    if(newProps.favorites[0] ){
      this._updateDataSource(newProps.matches,'favorites')
    }

  }

  // shouldComponentUpdate(nProps,nState){

  //   var {matches,favorites} = this.state


  //   var matchesDidUpdate = (matches && matches[0] && matches[0].unread || nProps.matches && nProps.matches[0] && nProps.matches[0].unread) || (matches.length != nProps.matches.length);
  //   var favsDidUpdate = ((favorites && favorites[0] && favorites[0].unread) || (nProps.favorites && nProps.favorites[0] && nProps.favorites[0].unread)) || (nProps.favorites && favorites.length != nProps.favorites.length);

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
              style={{width:300,
                height:MagicNumbers.is4s ? 70 : 100,
                marginBottom:0 }}
              source={{uri: 'assets/listing@3x.png'}}
              resizeMode={Image.resizeMode.contain}
            />
            <Image
              style={{width:300,
                height:MagicNumbers.is4s ? 70 : 100,
                marginBottom:20 }}
              source={{uri: 'assets/listing@3x.png'}}
              resizeMode={Image.resizeMode.contain}
            />
            <Text style={{
                color:colors.white,
                fontSize: MagicNumbers.is4s ? 18 : 22,
                fontFamily:'Montserrat-Bold',textAlign:'center',marginBottom:20}}>{
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
              style={{
                width:175,
                height: MagicNumbers.is4s ? 150 : 180,
                marginBottom: MagicNumbers.is4s ? 20 : 40
              }}
              source={{uri: 'assets/iconPlaceholderFavs@3x.png'}}
              resizeMode={Image.resizeMode.contain}
            />

            <Text
              style={{
                color:colors.white,
                fontSize:MagicNumbers.is4s ? 18 : 22,
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
                fontSize: MagicNumbers.is4s ? 16 : 20,
                fontFamily:'omnes',
                textAlign:'center'
              }}
              >{
                `Swipe left to add a match to your favorites for easy access`
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
    // AppActions.saveStores.defer(2)
  }
  toggleModal(){
    this.setState({
      isVisible:!this.state.isVisible,
    })
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

    };

    return (
      <AltContainer stores={storesForMatches}>

        <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} />

          {this.props.navBar}

        {this.state.isVisible ? <View
          style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]}>

           <FadeInContainer duration={300} >
             <TouchableOpacity activeOpacity={0.5} onPress={this.toggleModal}
              style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]} >

               <BlurView
                 blurType="light"
                 style={[{width:DeviceWidth,height:DeviceHeight}]} >
                 <View style={[{ }]}/>
               </BlurView>
             </TouchableOpacity>
           </FadeInContainer>
         </View> : <View/>}

            <ActionModal
              user={this.props.user}
              navigator={this.props.navigator}
              toggleModal={this.toggleModal.bind(this)}
              isVisible={this.state.isVisible}
              currentMatch={this.state.currentMatch}
            />

        </AltContainer>
    )
  }
}


const styles = StyleSheet.create({
  noop:{},
  container: {
    backgroundColor: colors.dark,
    marginTop:54,
    flex: 1,
    overflow:'hidden',
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



reactMixin.onClass(Matches, TimerMixin)



export default Matches;
