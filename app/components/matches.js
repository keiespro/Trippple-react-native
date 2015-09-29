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
import FadeInContainer from './FadeInContainer'


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
    MatchActions.toggleFavorite(rowData.match_id.toString());
  }
  actionModal(match){
      this.props.chatActionSheet(match)

  }
  // https://github.com/dancormier/react-native-swipeout/wiki/Closing-Swipeouts
  _renderRow(rowData, sectionID, rowID){

    var myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;

    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> rowData.users[id])
    var threadName = them.map( (user,i) => user.firstname.trim() ).join(' & ');
    var modalVisible = this.state.isVisible
    var self = this


    return (

    <Swipeout
        left={[ {
              onPress: self.actionModal.bind(self,rowData),
              underlayColor: 'black',
              component: ( <View style={styles.swipeButtons}><ThreeDots/></View>),
              backgroundColor: colors.dark,
            }
         ]}

        right={[
          {
            component: (rowData.isFavourited ? <ActiveStarButton/> : <EmptyStarButton/>),
            onPress: (()=>self.toggleFavorite(rowData)),
            backgroundColor: colors.dark,
            underlayColor: 'black',
          }
        ]}

        backgroundColor={colors.dark}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={false}
        scroll={event => this._allowScroll(event)}
        onClose={(sectionID_, rowID_) => {console.log('CLOOOOOOOOOOOOOOSE')}}

        onOpen={(sectionID_, rowID_) => {console.log('OPEN',this._handleSwipeout(sectionID_, rowID_))}}>

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
                 source={{uri: them.couple ? them.couple.thumb_url : them.thumb_url}}
                 defaultSource={require('image!placeholderUser')}
                 resizeMode={Image.resizeMode.cover}
               />
               <View style={{backgroundColor:colors.mandy,position:'absolute',bottom:-5,right:-5,
               borderRadius:15,overflow:'hidden',
               borderColor:colors.outerSpace,
               borderWidth:4,width:30,height:30,overflow:'hidden',padding:0,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
               <Text style={{fontFamily:'Montserrat-Bold',color:colors.white,textAlign:'center',fontSize:14}}>10</Text>
               </View>

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
          (this.props.matches.length > 0 ?
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
            /> :
            <ScrollView
                contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
                scrollEnabled={false}
                centerContent={true}
                style={{
                  backgroundColor:colors.outerSpace,
                  flex:1,
                  alignSelf:'stretch',
                  width:DeviceWidth}}>
                  <View style={{color:colors.white,textAlign:'center',flexDirection:'column',paddingHorizontal:20,justifyContent:'space-between',alignItems:'center',alignSelf:'stretch',paddingBottom:80,}}>
                    <Image  style={{width:300,height:100,marginBottom:0 }} source={require('image!listing')}
                    resizeMode={Image.resizeMode.contain} />
                    <Image  style={{width:300,height:100,marginBottom:20 }} source={require('image!listing')}
                    resizeMode={Image.resizeMode.contain} />

                    <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',marginBottom:20}} >{`WAITING FOR MATCHES`}</Text>
                    <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes',textAlign:'center'}} >Your conversations with your matches will appear in this screen</Text>
                  </View>
            </ScrollView>
            )
            :
          (this.props.favorites.length > 0 ? <ListView
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
            /> :
            <ScrollView

          contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
            scrollEnabled={false}
            centerContent={true}
          style={{
            backgroundColor:colors.outerSpace,
            flex:1,
            alignSelf:'stretch',
            width:DeviceWidth}}>
      <FadeInContainer>

        <View style={{color:colors.white,textAlign:'center',flexDirection:'column',paddingHorizontal:20,justifyContent:'space-between',alignItems:'center',alignSelf:'stretch',paddingBottom:80,}}>

        <Image  style={{width:175,height:180,marginBottom:40 }} source={require('image!iconPlaceholderFavs')}
               resizeMode={Image.resizeMode.contain}
        />
        <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',marginBottom:20}} >{`YOUR FAVORITE PEOPLE`}</Text>
        <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes',textAlign:'center'}} >Tap on the star next to  to add matches to your favorites for easy access</Text>

        </View>
      </FadeInContainer>

        </ScrollView>)}







        </View>
    );
  }
}



class MatchesInside extends Component{

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      console.log(props)
    this.state = {
      matches: props.matches,
      isVisible: false,
      dataSource: this.ds.cloneWithRows(props.matches),
      favDataSource: this.ds.cloneWithRows(props.favorites)

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
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.setState({
      matches: newProps.matches,
      dataSource: this.ds.cloneWithRows(newProps.matches)
    })
  }
  _updateDataSource(data) {
    this.setState({
      dataSource: this.ds.cloneWithRows(data)
    })
  }

  render(){
     return (
           <MatchList
            user={this.props.user}
            dataSource={this.state.dataSource}
            favDataSource={this.state.favDataSource}
            matches={this.props.matches}
            favorites={this.props.favorites}

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

  showProfile(match){
    this.props.navigator.push({
      component: UserProfile,
      passProps:{match, hideProfile: ()=> {
        this.props.navigator.pop()
      }}
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
          <View><ActionModal
              user={this.props.user}
              navigator={this.props.navigator}
              toggleModal={(e)=>{ this.setState({isVisible:false}) }}
              isVisible={this.state.isVisible}
              currentMatch={this.state.currentMatch}
            /></View>

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
