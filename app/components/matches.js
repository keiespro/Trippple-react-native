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

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import _ from 'underscore'
import alt from '../flux/alt'
import Chat from './chat'
import MatchActions from '../flux/actions/MatchActions'
import MatchesStore from '../flux/stores/MatchesStore'
import Swipeout from 'react-native-swipeout'
import Logger from '../utils/logger'
import customSceneConfigs from '../utils/sceneConfigs'
import SegmentedView from '../controls/SegmentedView'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import AltContainer from 'alt/AltNativeContainer'
import FakeNavBar from '../controls/FakeNavBar'
import Mixpanel from '../utils/mixpanel'



class StarButton extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <View style={{width:60,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',justifyContent:'center',height:100,marginLeft:10}}>
           <Image
             key={'star'}
             style={{alignSelf:'center' }}
             source={require('image!starOutline')}
             resizeMode={Image.resizeMode.cover}
           />
       </View>
    )
  }
}
// Buttons
var swipeoutBtnsLeft = [
  {
    component: (<StarButton/>),
    backgroundColor: colors.dark,
    underlayColor: colors.purple,
  }
];

var swipeoutBtnsRight = [
  {
    text: 'Unmatch',
    onPress(){
      console.log('REJECT');
    },
    backgroundColor: colors.dark,
  }
];



@reactMixin.decorate(TimerMixin)
class MatchList extends Component{

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
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

  // https://github.com/dancormier/react-native-swipeout/wiki/Closing-Swipeouts
  _renderRow(rowData, sectionID, rowID){

    var myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;

    var threadName = rowData.users.them.users.map( (user,i) => user.firstname.trim() ).join(' & ');

    return (
      <Swipeout
        left={swipeoutBtnsLeft}
        right={swipeoutBtnsRight}
        backgroundColor={colors.dark}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={true}
        scroll={event => this._allowScroll(event)}
        onOpen={(sectionID_, rowID_) => this._handleSwipeout(sectionID_, rowID_)}>

        <TouchableHighlight onPress={() => {console.log('onpress Swipeout');  this._pressRow(rowData.match_id); }} key={rowData.match_id+'match'}>

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

  filterFavorites(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(_.filter(this.props.matches, (el) => el.favorited === true ))
  }
  render(){

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
        <ListView
        initialListSize={12}
        scrollEnabled={this.state.scrollEnabled}
          onEndReached={ (e) => {
            const nextPage = this.props.matches.length/20 + 1;
            if(this.state.fetching || nextPage === this.state.lastPage){ return false }
            this.setState({fetching:true,lastPage: nextPage })
            MatchActions.getMatches(nextPage);
            this.setState({fetching:false})

          }}
          ref={component => this._listView = component}
          dataSource={this.state.index === 0 ? this.props.dataSource : this.filterFavorites()}
          renderRow={this._renderRow.bind(this)}
          />

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
      dataSource: ds.cloneWithRows(props.matches)
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
            matches={this.props.matches}
            updateDataSource={this._updateDataSource.bind(this)}
            id={"matcheslist"}
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

  constructor(props){
    super();
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

          }}>
           <MatchesInside {...this.props} />
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
  }
});

module.exports = Matches;
