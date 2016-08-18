import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import Analytics from '../../utils/Analytics'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'

import NotificationActions from '../actions/NotificationActions'
import { matchWasAdded, messageWasAdded } from '../../utils/matchstix'
import { AsyncStorage, Alert } from 'react-native'
import _ from 'underscore'
import UserStore from './UserStore'
import ChatStore from './ChatStore'

class MatchesStore {


  constructor() {
    this.state = {
      matches: {},
      newMatches:{},
      favorites: [],
      removedMatches:[],
      mountedAt: Date.now() - 36000 ,
    }

    this.exportPublicMethods({
      getAllMatches: this.getAllMatches,
      getNewMatches: this.getNewMatches,
      getAllFavorites: this.getAllFavorites,
      getMatchInfo: this.getMatchInfo,
      getAnyUnread: this.getAnyUnread
    });

    this.bindListeners({
      handleGetFavorites: MatchActions.GET_FAVORITES,
      handleGetMatches: MatchActions.GET_MATCHES,
      handleGetNewMatches: MatchActions.GET_NEW_MATCHES,
      handleReportUser: MatchActions.REPORT_USER,
      removeMatch: MatchActions.REMOVE_MATCH,
      toggleFavorite: MatchActions.TOGGLE_FAVORITE,
      sendMessage: MatchActions.SEND_MESSAGE_TO_SERVER,
      insertLocalMessage: MatchActions.SEND_MESSAGE,
      updateLastAccessed: MatchActions.SET_ACCESS_TIME,
      unMatch: MatchActions.UN_MATCH,
      handleNewMessages: MatchActions.GET_MESSAGES,
      handleSaveStores: AppActions.SAVE_STORES,
      handleLogout: UserActions.LOG_OUT,
      clearMatches: AppActions.CLEAR_MATCHES_DATA,
      handleResetUnreadCount: MatchActions.RESET_UNREAD_COUNT

    });

    this.on( 'init', () => {
      // Analytics.all( 'INIT matches store' );
    });

    this.on( 'error', ( err, payload, currentState ) => {
      // Analytics.all( 'ERROR matches store', err, payload, currentState );
      // Analytics.err({...err, payload})

    });

    this.on( 'bootstrap', ( bootstrappedState ) => {
      // Analytics.all( 'BOOTSTRAP matches store', bootstrappedState );
    });

    this.on( 'afterEach', ( x ) => {
      // if(x.payload && x.payload.payload && x.payload.payload.matches && x.payload.payload.matches.length && x.payload.details.name != 'getPotentials'){
      //   Analytics.all( 'UPDATE Matches store', {...x });
      // }
    })

  }

  handleLogout() {
    this.setState({
      matches: [],
      favorites: [],
    })
  }

  clearMatches(){
    this.setState({
      matches: [],
    })
    this.save();

  }
  handleSaveStores() {
  }

  save() {
    var partialSnapshot = alt.takeSnapshot( this );
    Analytics.log( 'saving', partialSnapshot );
    AsyncStorage.setItem( 'MatchesStore', JSON.stringify( partialSnapshot ) );
  }

  unMatch( matchID ) {
    this.removeMatch( matchID )
  }

  removeMatch( matchID ) {
    const { matches } = this.state
    matches[ matchID ] = null
    delete matches[ matchID ]

    this.setState({
      matches,
      removedMatches: [...this.state.removedMatches, matchID]
    });
    this.save();

  }

  handleReportUser( payload ) {
    const { user_id, reason } = payload

  }

  updateLastAccessed( payload ) {
    // save timestamp of last match view, reset unread counts
    const {
      match_id,
      timestamp
    } = payload;
    const m = this.state.matches[ match_id ]
    if(m){
      m.lastAccessed = timestamp || Date.now()
      m.unread = 0
      const matches = this.state.matches
      matches[ match_id ] = m
      m.unread = 0;

      this.setState({
        matches
      })
    }else{
      const nm = this.state.newMatches[ match_id ]
      if(nm){
        nm.lastAccessed = timestamp || Date.now()
        nm.unread = 0
        const newMatches = this.state.newMatches
        newMatches[ match_id ] = nm
        nm.unread = 0;

        this.setState({
          newMatches
        })
      }
    }
  }



  handleResetUnreadCount( match_id ) {
    const m = this.state.matches[ match_id ];
    m.unread = 0;
    this.setState({
      matches: {...this.state.matches, m }
    })
  }

  sendMessage( payload ) {
    this.handleGetMatches( payload.matchesData )
  }

  toggleFavorite( matchesData ) {
    this.handleGetFavorites( matchesData )
  }

  insertLocalMessage( payload ) {
    this.handleGetMatches( payload.matchesData )
  }
  handleGetNewMatches(matchesData ) {
    if ( !matchesData ) return false;
    const {matches} = matchesData
    const matchesHash = matches.reduce( ( acc, el, i ) => {
      acc[ el.match_id ] = el;
      return acc
    }, {})

    this.setState({
      newMatches: matchesHash,
    });

  }
  handleGetMatches( matchesData ) {
    if ( !matchesData ) return false
    const { matches } = matchesData,
          user = UserStore.getUser();

    if ( matches.length > 0 ) {
      var allmatches;

      if ( !Object.keys( this.state.matches ).length ) {
        // first batch of matches

        var m = orderMatches( matches )
        const matchesHash = m.reduce( ( acc, el, i ) => {
          el.lastAccessed = this.state.mountedAt


          el.unread = 0; //el.recent_message.created_timestamp*1000 > el.lastAccessed ? 1 : 0;


          acc[ el.match_id ] = el;
          return acc
        }, {})
        allmatches = matchesHash;
      } else {
        const matchesHash = matches.reduce( ( acc, el, i ) => {
          if(!this.state.matches[el.match_id] || this.state.matches[el.match_id].lastAccessed < this.state.matches[el.match_id].recent_message.created_timestamp * 1000){

            MatchActions.getMessages.defer(el.match_id);

            if (el.unread == 0 && el.recent_message && el.recent_message.from_user_info && el.recent_message.from_user_info.id && (el.recent_message.from_user_info.id != user.id && ( el.recent_message.created_timestamp * 1000 > el.lastAccessed )) ){
              // el.unread = 1;
              // console.log('UNREAD - ',el.recent_message.created_timestamp * 1000,el.lastAccessed)

            }
          }else{
            el.unread = this.state.matches[el.match_id] ? this.state.matches[el.match_id].unread : 0;
            if (el.unread == 0 && el.recent_message && el.recent_message.from_user_info && el.recent_message.from_user_info.id && (el.recent_message.from_user_info.id != user.id && ( el.recent_message.created_timestamp * 1000 > el.lastAccessed )) ){
              // el.unread = 1;

              // console.log('UNREAD - ',el.recent_message.created_timestamp * 1000,el.lastAccessed)
            }
          }

          acc[ el.match_id ] = el
          return acc
        }, {})

        allmatches = {...this.state.matches,...matchesHash};
      }
      this.setState({
        matches: allmatches,
      });
    } else {
      this.emitChange()
    }
  }

  handleNewMessages( payload ) {
    if ( !payload ) {
      return false
    }
    const { match_id, message_thread } = payload.messages;

    // if ( !message_thread || !message_thread.length || ( message_thread.length == 1 && !message_thread[ 0 ].message_body ) ) {return false}

    const { matches } = this.state;

    this.waitFor(ChatStore)
    const unreadCount = ChatStore.getUnreadForMatch(match_id);
    matches[ match_id ].unread = unreadCount;

    this.setState({ matches: {...matches} })
    this.emitChange()
    this.save()

  }

  handleResetUnreadCount(match_id){

    const { matches } = this.state;

    matches[ match_id ].unread = 0;

    console.log(match_id + ' unreadCount reset',unreadCount);
    this.setState({ matches: {...matches} })

  }
  handleGetFavorites( matchesData ) {

    // this.emitChange()

  }

  // public methods
  getAnyUnread() {
    const matches = this.getState().matches || {};
    return Object.keys( matches ).reduce( ( acc, el, i ) => {
        return matches[ el ].unread > 0
    }, false)
  }

  getAllMatches() {

    const matches = this.getState().matches || {};
    const removedMatches = this.getState().removedMatches || [];
    const matcharray = Object.keys( matches ).map( ( m, i ) => matches[ m ] )
    const filteredMatches = _.reject(matcharray, (m) =>{ return removedMatches.indexOf(m.match_id) >= 0 })
    return orderMatches( filteredMatches )
  }

  getNewMatches(){
    const matches = this.getState().newMatches || {};
    const removedMatches = this.getState().removedMatches || [];
    const matcharray = Object.keys( matches ).map( ( m, i ) => matches[ m ] )
    const filteredMatches = _.reject(matcharray, (m) =>{ return removedMatches.indexOf(m.match_id) >= 0 })
    return orderNewMatches( filteredMatches )

  }
  getAllFavorites() {

    return []

  }

  getMatchInfo( matchID ) {
    const s = this.getState()
    const {matches,newMatches} = s
    const m = matches[matchID] || newMatches[matchID]

    return m
  }
}

function orderMatches( matches ) {
  const sortableMatches = matches;

  return sortableMatches.sort( function( a, b ) {
    const aTime = a.recent_message && a.recent_message.created_timestamp
    const bTime = b.recent_message && b.recent_message.created_timestamp
    if ( aTime < bTime ) {
      return 1;
    } else if ( aTime >= bTime ) {
      return -1;
    }
    return 0;
  });

}


function orderNewMatches( matches ) {
  const sortableMatches = matches;
  return sortableMatches.sort( function( a, b ) {
    const aTime = a.match_id
    const bTime = b.match_id
    if ( aTime < bTime ) {
      return 1;
    } else if ( aTime >= bTime ) {
      return -1;
    }
    return 0;
  });
}

export default {}//alt.createStore( MatchesStore, 'MatchesStore' )
