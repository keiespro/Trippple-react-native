import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  SwipeableListView,
  Dimensions,
  Alert,
} from 'react-native';
import React, { Component } from "react";

import Action from '../../modals/Action';
import Analytics from '../../../utils/Analytics';
import NewMatches from './NewMatches';
import NoMatches from './NoMatches';
import ThreeDots from '../../buttons/ThreeDots';
import UserProfile from '../../UserProfile';
import colors from '../../../utils/colors';

import _ from 'underscore'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

import { BlurView, VibrancyView } from 'react-native-blur'
import { connect } from 'react-redux';
import ActionMan from  '../../../actions/';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const SwipeableQuickActions = require('SwipeableQuickActions');

@reactMixin.decorate(TimerMixin)
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
  componentDidMount() {
    // this.setTimeout(() => {


    // }, 500)
    //
    this.props.dispatch(ActionMan.getMatches())
    this.props.dispatch(ActionMan.getNewMatches())

  }

  _updateDataSource(data) {
    this.props.updateDataSource(data)
  }

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
            this.props.dispatch(ActionMan.unmatch(rowData.match_id));
            this.handleCancelUnmatch();
          }
        },
      ],
    );
  }

  _pressRow(rowData,title) {
    this.setTimeout(() => {

      this.props.dispatch(ActionMan.getMessages({'match_id':rowData.match_id}))
    }, 1000)

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
    this.props.dispatch(ActionMan.showInModal({component:'Action',passProps:{match:row}}))


  }
  _renderRow(rowData, sectionID, rowID) {
    console.log(rowData);

    const myId = this.props.user.id;
    // const myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;
    const theirIds = Object.keys(rowData.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id);
    const them = theirIds.map((id) => rowData.users[id]);
    const threadName = them.map((user, i) => user.firstname.trim()).join(' & ');
    const modalVisible = this.state.isVisible;
    const thumb = them[0].thumb_url;
    const matchImage = thumb || ''
    const unread = rowData.unread || 0;
    const message_body = rowData.recent_message.message_body.replace(/(\r\n|\n|\r)/gm, " ");
    return (

      <TouchableHighlight style={{}} onPress={(e) => { this._pressRow(rowData,threadName.toUpperCase()) }} key={rowData.match_id + 'match'}>
        <View style={{
          backgroundColor:colors.outerSpace,
          shadowColor:colors.darkShadow,
          shadowRadius:1,
          shadowOpacity:10,
          shadowOffset: {
              width:StyleSheet.hairlineWidth,
              height: 0
          }
        }}>
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
    const isVisible = this.state.isVisible;
    return (!this.props.matches.length && !this.props.newMatches.length) ?  <NoMatches/> : (
      <View >
        <SwipeableListView
          dataSource={this.props.dataSource}
          maxSwipeDistance={150}
          renderQuickActions={(rowData, sectionID, rowID) =>  (
             <SwipeableQuickActions style={{backgroundColor:colors.dark,alignItems:'stretch',overflow:'hidden' }}>
             <TouchableHighlight
              onPress={this.unmatch.bind(this,rowData)}
               underlayColor={colors.shuttleGray}>
              <View style={{backgroundColor:colors.mandy,width:75,margin:0,right:-5, flex:1,justifyContent:'center',alignItems:'center',alignSelf:'stretch',flexDirection:'column',}}>
                <Image
                  resizeMode={Image.resizeMode.contain}
                  style={{width:20,height:20,alignItems:'flex-start'}}
                  source={{uri: 'assets/close@3x.png'}}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={this.chatActionSheet.bind(this,rowData)}
                 underlayColor={colors.dark}>
                <View style={{backgroundColor:colors.shuttleGray,width:75,margin:0, flex:1,justifyContent:'center',alignItems:'center',alignSelf:'stretch',flexDirection:'column'}}>
                  <ThreeDots dotColor={colors.white}/>
                </View>
              </TouchableHighlight>
             </SwipeableQuickActions>
           )
          }
          bounceFirstRowOnMount={false}
          chatActionSheet={this.props.chatActionSheet}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={200}
          ref={component => this._listView = component}
          renderRow={this._renderRow.bind(this)}
          style={{ height: DeviceHeight, marginTop: 64, overflow: 'hidden', backgroundColor: colors.outerSpace }}
          scrollEnabled={this.state.scrollEnabled}
          directionalLockEnabled={true}
          removeClippedSubviews={true}
          contentInset={{top:0,left:0,right:0,bottom:0}}
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



function rowHasChanged(r1, r2) {
  return r1.match_id !== r2.match_id || r1.unread != r2.unread || r1.recentMessage.message_id != r2.recentMessage.message_id
}


@reactMixin.decorate(TimerMixin)
class MatchesInside extends Component {

  constructor(props) {
    super();
    this.ds = SwipeableListView.getNewDataSource(rowHasChanged);
    this.state = {
      matches: props.matches,
      isVisible: false,
      dataSource: this.ds.cloneWithRowsAndSections(props.matches.map(d => {
        return {
          match: {...d, unread: props.unread[d.match_id]}
        }
      }))
    }
  }

  // showProfile(match) {
  //   Analytics.event('Interaction', {
  //     type: 'tap',
  //     name: 'View user profile',
  //     match_id: match.match_id,
  //     match
  //   })
  //
  //   this.props.navigator.push({
  //     component: UserProfile,
  //     passProps: {
  //       match,
  //       hideProfile: () => {
  //         this.props.navigator.pop()
  //       }
  //     },
  //     name: `User Profile`
  //   })
  // }

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
        dataSource: this.ds.cloneWithRowsAndSections(data.map(d => { return { match: {...d, unread: this.props.unread[d.match_id]}} })),
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
          unread={this.props.unread}
           newMatches={this.props.newMatches}
           updateDataSource={this._updateDataSource.bind(this)}
           id={"matcheslist"}
            navigator={this.props.navigator}
           route={{ component: 'Matches', title: 'Matches', id: 'matcheslist', }}
           title={"matchlist"}
        />
      </View>
    )
  }
}


@reactMixin.decorate(TimerMixin)
class Matches extends Component {
  static route = {
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
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
        currentMatch: match
      })
    // },10)
    } else {


    }
  }

  // showProfile(match) {
  //   this.props.navigator.push({
  //     component: UserProfile,
  //     passProps: {
  //       match,
  //       hideProfile: () => {
  //         this.props.navigator.pop()
  //       }
  //     }
  //   })
  // }

  // toggleModal() {
  //   this.setState({
  //     isVisible: !this.state.isVisible
  //   })
  // }
  // shouldComponentUpdate(nProps,nState){
  //   return true
  // }

  render() {
    return <MatchesInside {...this.props} chatActionSheet={this.chatActionSheet.bind(this)} />
  }
}


const mapStateToProps = (state, ownProps) => {

  return {
    ...ownProps,
    matches: state.matchesList.matches,
    user: state.user,
    newMatches: state.matchesList.newMatches,
    unread: state.unread
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getMessages: (mid) => dispatch => dispatch(ActionMan.getMessages(mid))
  };
}



Matches.displayName = "Matches";

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
