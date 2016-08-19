/* @flow */

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  SwipeableListView,
  Navigator,
  Dimensions,
  Alert,
} from 'react-native';
import React, { Component } from "react";

import ActionModal from '../../modals/ActionModal';
import Analytics from '../../../utils/Analytics';
import BackButton from '../../buttons/BackButton';
import Chat from '../chat/chat';
import FadeInContainer from '../../FadeInContainer';
import NewMatches from './NewMatches';
import NoMatches from './NoMatches';
import ThreeDots from '../../buttons/ThreeDots';
import UserProfile from '../../UserProfile';
import colors from '../../../utils/colors';

import _ from 'underscore'
import {SwipeoutBtn} from '../../controls/Swipeout'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

import { BlurView, VibrancyView } from 'react-native-blur'
import { connect } from 'react-redux';
import ActionMan from  '../../../actions/';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const SwipeableQuickActions = require('SwipeableQuickActions');

class MatchList extends Component {

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isVisible: false,
      scrollEnabled: true,
      isRefreshing: false,
      lastPage: 0
    }
  }
  //
  // componentDidMount() {
  //   this.setTimeout(() => {
  //
  //
  //   }, 500)
  // }

  // _allowScroll(scrollEnabled) {
  //   var listref = '_listView';
  //   this.setState({
  //     scrollEnabled
  //   })
  // // this[listref] && this[listref].refs.listviewscroll.refs.ScrollView.setNativeProps({ scrollEnabled })
  // }

  _updateDataSource(data) {
    this.props.updateDataSource(data)
  }
  //
  // _handleSwipeout(sectionID, rowID) {
  //   this.setState(({
  //     unmatchOpen: true
  //   }))
  //
  // //TODO:
  // // const rows = this.props.matches;
  // // for (var i = 0; i < rows.length; i++) {
  // //   if (i != rowID) { rows[i].active = false }
  // //   else {rows[i].active = true}
  // // }
  // // this._updateDataSource(rows)
  // }


  handleCancelUnmatch(rowData) {
    this.setTimeout(() => {
      this.setState(({
        unmatchOpen: false
      }))
    }, 350);

  }

  unmatch(rowData) {
    if (this.state.unmatchOpen) {
      return false
    }
    this.setState({
      unmatchOpen: true
    })

    Alert.alert(
      'Remove this match?',
      'Do you want to remove this match?',
      [
        {
          text: 'Cancel',
          onPress: () => this.handleCancelUnmatch(rowData),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            Analytics.extra('Social', {
              name: 'Unmatch',
              match_id: rowData.match_id,
              match: rowData
            })
            // MatchActions.unMatch(rowData.match_id);
            // TODO : REPLACE WITH NEW
            // MatchActions.removeMatch.defer(rowData.match_id);
            this.handleCancelUnmatch();
          }
        },
      ],
    );
  }

  _pressRow(rowData,title) {
    // this.setTimeout(() => {
    //   // MatchActions.resetUnreadCount.defer(match_id);
    //   // MatchActions.getMessages.defer(match_id);
    //   // TODO : REPLACE WITH NEW
      this.props.dispatch(ActionMan.getMessages({'match_id':rowData.match_id}))
    // }, 200)

      const payload = {title, match_id: rowData.match_id, matchInfo: rowData }
      this.props.navigator.push(this.props.navigator.navigationContext.router.getRoute('Chat',payload));

  }

  onEndReached(e) {
    const nextPage = parseInt(this.props.matches.length / 20) + 1;
    if (this.state.fetching || nextPage == this.state.lastPage) {
      return false
    }

    this.setState({
      lastPage: nextPage,
      isRefreshing: false,
      loadingMoreMatches: true
    })
    this.setTimeout(() => {
      this.setState({
        loadingMoreMatches: false
      })
    }, 3000);

    Analytics.event('Interaction', {
      type: 'scroll',
      name: 'Load more matches',
      page: nextPage
    })


    this.props.dispatch(ActionMan.getMatches(nextPage))
  }

  segmentedViewPress(index) {
    this.setState({
      index: index == 0 ? 0 : 1
    })
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    this.onEndReached();
  // this.setTimeout(()=>{
  //   this.setState({
  //     isRefreshing:false
  //   })
  // },3000);
  }
  chatActionSheet(row) {
    this.props.chatActionSheet(row)
  }
  _renderRow(rowData, sectionID, rowID) {
    // console.log(rowData,sectionID, rowID);

    const myId = this.props.user.id;
    const myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;
    const theirIds = Object.keys(rowData.users).filter((u) => u != this.props.user.id && u != this.props.user.partner_id);
    const them = theirIds.map((id) => rowData.users[id]);
    const threadName = them.map((user, i) => user.firstname.trim()).join(' & ');
    const modalVisible = this.state.isVisible;
    const thumb = them[0].thumb_url;
    const matchImage = thumb
    const unread = rowData.unread || 0;
    const message_body = rowData.recent_message.message_body.replace(/(\r\n|\n|\r)/gm, " ");
    return (

      <TouchableHighlight onPress={(e) => { this._pressRow(rowData,threadName.toUpperCase()) }} key={rowData.match_id + 'match'}>
        <View>
          {__DEBUG__ && <Text style={{ color: '#fff' }}>
            {new Date(rowData.recent_message.created_timestamp * 1000).toLocaleString() + ' | match_id: ' + rowData.match_id}
          </Text>}
          <View style={styles.row}>
            <View style={styles.thumbswrap}>
              <Image
                 key={'userimage' + rowID}
                 style={styles.thumb}
                 source={{ uri: matchImage }}
                 resizeMode={Image.resizeMode.cover}
                 defaultSource={{ uri: 'assets/placeholderUser@3x.png' }} />
              {unread ?
               <View style={styles.newMessageCount}>
                 <Text style={{ fontFamily: 'Montserrat-Bold', color: colors.white, textAlign: 'center', fontSize: 14 }}>
                   {unread}
                 </Text>
               </View>
               : null}
            </View>
            <View style={styles.textwrap}>
              <Text style={[styles.text, styles.title]}>
                {threadName.toUpperCase()}
              </Text>
              <Text style={styles.text}>
                {message_body || 'New Match'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    var isVisible = this.state.isVisible;
    return (!this.props.matches.length && !this.props.newMatches.length) ?  <NoMatches/> : (
      <View>
        <SwipeableListView
          dataSource={this.props.dataSource}
          maxSwipeDistance={100}
          renderQuickActions={(rowData, sectionID, rowID) =>  (
             <SwipeableQuickActions style={{backgroundColor:'black'}}>
               <TouchableHighlight
                onPress={this.chatActionSheet.bind(this,rowData)}
                 underlayColor="black">
                <View style={{backgroundColor:'transparent',width:50, justifyContent:'center',alignItems:'center',height:100}}>
                  <ThreeDots dotColor={colors.white}/>
                </View>
              </TouchableHighlight>
             </SwipeableQuickActions>
           )
          }
          bounceFirstRowOnMount={true}
          chatActionSheet={this.props.chatActionSheet}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={200}
          ref={component => this._listView = component}
          renderRow={this._renderRow.bind(this)}
          style={{ height: DeviceHeight, marginTop: 0, overflow: 'hidden', backgroundColor: colors.outerSpace }}
          scrollEnabled={this.state.scrollEnabled}
          directionalLockEnabled={true}
          removeClippedSubviews={true}
          vertical={true}
          initialListSize={5}
          scrollsToTop={true}
          contentOffset={{ x: 0, y: this.state.isRefreshing ? -50 : 0 }}
          renderHeader={() => (!this.props.newMatches || !this.props.newMatches.length) ? false : (
            <NewMatches
              dispatch={this.props.dispatch}
              user={this.props.user}
              navigator={this.props.navigator}
              newMatches={this.props.newMatches}
              matchesCount={this.props.matches.length}
            />
          )}
        />
        {this.state.loadingMoreMatches && false ?
         <View style={{ position: 'absolute', bottom: 0, width: DeviceWidth, height: 30 }}>
           <ActivityIndicator style={{ alignSelf: 'center', alignItems: 'center', flex: 1, height: 60, width: 60, justifyContent: 'center' }} animating={true} />
         </View> :
         null}
      </View>
    )
  }
}

reactMixin.onClass(MatchList, TimerMixin)


function rowHasChanged(r1, r2) {
  return r1.match_id !== r2.match_id || r1.unread != r2.unread || r1.recentMessage.message_id != r2.recentMessage.message_id
}


class MatchesInside extends Component {

  constructor(props) {
    super(props);
    this.ds = SwipeableListView.getNewDataSource();
    this.state = {
      matches: props.matches,
      isVisible: false,
      dataSource: this.ds.cloneWithRowsAndSections(props.matches.map(d => {
        return {
          match: d
        }
      }))
    }
  }

  chatActionSheet(match) {
    if (match) {
      this.setState({
        isVisible: true,
        currentMatch: match
      })
    } else {
      this.setState({
        isVisible: false
      })
    }
  }

  showProfile(match) {
    Analytics.event('Interaction', {
      type: 'tap',
      name: 'View user profile',
      match_id: match.match_id,
      match
    })

    this.props.navigator.push({
      component: UserProfile,
      passProps: {
        match,
        hideProfile: () => {
          this.props.navigator.pop()
        }
      },
      name: `User Profile`
    })
  }

  toggleModal() {
    this.setState({
      isVisible: !this.state.isVisible,

    })
  }
  componentWillReceiveProps(newProps) {
    if (newProps.matches && newProps.matches[0]) {
      this._updateDataSource(newProps.matches, 'matches')
    }
  }

  _updateDataSource(data, whichList) {
    if (data.length > 1) {
      const newState = {
        matches: data,
        dataSource: this.ds.cloneWithRowsAndSections(data.map(d => { return { match: d } })),
      };
      this.setState(newState)
    }
  }

  render() {
    return (
      <View>
        <MatchList
          dispatch={this.props.dispatch}
           user={this.props.user}
           dataSource={this.state.dataSource}
           matches={this.state.matches || this.props.matches}
           newMatches={this.props.newMatches}
           updateDataSource={this._updateDataSource.bind(this)}
           id={"matcheslist"}
           chatActionSheet={this.chatActionSheet.bind(this)}
           navigator={this.props.navigator}
           route={{ component: Matches, title: 'Matches', id: 'matcheslist', }}
           title={"matchlist"}
        />

        {this.state.isVisible && this.state.currentMatch ?
         <View style={[{ position: 'absolute', top: 0, left: 0, width: DeviceWidth, height: DeviceHeight }]}>
           <FadeInContainer delayAmount={1} duration={200}>
             <View style={[{ width: DeviceWidth, position: 'absolute', top: 0, left: 0, height: DeviceHeight }]}>
               <VibrancyView blurType="light" style={[{ width: DeviceWidth, position: 'absolute', top: 0, left: 0, height: DeviceHeight }]} />
             </View>
           </FadeInContainer>
         </View> : <View/>}
        <ActionModal
         user={this.props.user}
         navigator={this.props.navigator}
         dispatch={this.props.dispatch}
         toggleModal={this.toggleModal.bind(this)}
         isVisible={this.state.isVisible}
         currentMatch={this.state.currentMatch}
         />
      </View>
    )
  }
}

reactMixin.onClass(MatchesInside, TimerMixin)


class Matches extends Component {
  static route = {
    navigationBar: {
      backgroundColor: colors.shuttleGray,
      title(params){
        return `MESSAGES`
      },
      style: {height:0},
      renderRight(route, props){
        return false
      }
    }
  };

  constructor(props) {
    super();

    this.state = {
      currentMatch: null,
      isVisible: false
    }
  }

  chatActionSheet(match) {


    if (match) {
      // this.setState({
      //   isVisible:!this.state.isVisible
      // })
      // this.setTimeout(()=>{
      this.setState({
        isVisible: true,
        currentMatch: match
      })
    // },10)
    } else {
      this.setState({
        isVisible: false
      })
    }
  }

  showProfile(match) {
    this.props.navigator.push({
      component: UserProfile,
      passProps: {
        match,
        hideProfile: () => {
          this.props.navigator.pop()
        }
      }
    })
  }

  toggleModal() {
    this.setState({
      isVisible: !this.state.isVisible
    })
  }
  // shouldComponentUpdate(nProps,nState){
  //   return true
  // }

  render() {
    return <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} />
  }
}


const mapStateToProps = (state, ownProps) => {
  // console.log('state',state,'ownProps',ownProps); // state
  return {
    ...ownProps,
    matches: state.matchesList.matches,
    user: state.user,
    newMatches: state.matchesList.newMatches
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getMessages: (mid) => dispatch => dispatch(ActionMan.getMessages(mid))
  };
}



Matches.displayName = "Matches";


reactMixin.onClass(Matches, TimerMixin)


export default connect(mapStateToProps, mapDispatchToProps)(Matches);


const styles = StyleSheet.create({
  noop: {},
  container: {
    backgroundColor: colors.dark,
    marginTop: 0,
    flex: 1,
    height: DeviceHeight - 60,
  },
  navText: {
    color: colors.black,
    fontFamily: 'omnes'
  },
  button: {
    backgroundColor: colors.white,
    padding: 15,
    height: 70,
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
    marginRight: 20,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'flex-start',

  },
  thumb: {
    borderRadius: 32,
    width: 64,
    height: 64,
    backgroundColor: colors.dark
  },
  rightthumb: {
    left: -16
  },
  text: {
    color: colors.rollingStone,
    fontFamily: 'omnes',
    fontSize: 17
  },
  title: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: colors.white,
    fontWeight: '500'
  },
  textwrap: {
    height: 66,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    flex: 3,
    alignSelf: 'stretch'
  },
  swipeButtons: {
    width: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginLeft: 0
  },
  newMessageCount: {
    backgroundColor: colors.mandy,
    position: 'absolute',
    bottom: -5,
    right: -5,
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: colors.outerSpace,
    borderWidth: 4,
    width: 30,
    height: 30,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
