import { View, SwipeableListView } from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import { connect } from 'react-redux';
import ActionMan from '../../../actions/';
import colors from '../../../utils/colors';
import MatchesList from './MatchesList'


function rowHasChanged(r1, r2) {
  return r1 !== r2 || r1.match_id !== r2.match_id || r1.unread != r2.unread || r1.recentMessage.message_id != r2.recentMessage.message_id
}


@reactMixin.decorate(TimerMixin)
class Matches extends Component {
  static route = {
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(){
        return 'MESSAGES'
      },
      style: {height: 0},
      renderRight(route, props){
        return false
      }
    }
  };

  constructor(props) {
    super();
    this.ds = SwipeableListView.getNewDataSource(rowHasChanged);
    this.state = {
      matches: props.matches,
      currentMatch: null,
      isVisible: false,
      dataSource: this.ds.cloneWithRowsAndSections(props.matches.map(d => ({
        match: {...d, unread: props.unread[d.match_id]}
      })))
    }
  }

  componentWillReceiveProps(newProps) {
    this._updateDataSource(newProps.matches, 'matches')
  }

  toggleModal() {
    this.setState({
      isVisible: !this.state.isVisible,
    })
  }

  _updateDataSource(data) {
    const newState = {
      matches: data,
      dataSource: this.ds.cloneWithRowsAndSections(data.map(d => ({
        match: {
          ...d,
          unread: this.props.unread[d.match_id]
        }
      }))),
    };
    this.setState(newState)
  }

  render() {
    return (
      <View>
        <MatchesList
          dispatch={this.props.dispatch}
          user={this.props.user}
          dataSource={this.state.dataSource}
          matches={this.state.matches || this.props.matches}
          unread={this.props.unread}
          newMatches={this.props.newMatches}
          getMessages={this.props.getMessages}
          updateDataSource={this._updateDataSource.bind(this)}
          id={'matcheslist'}
          navigator={this.props.navigator}
          route={{ component: 'Matches', title: 'Matches', id: 'matcheslist', }}
          title={'matchlist'}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  matches: state.matchesList.matches,
  user: state.user,
  newMatches: state.matchesList.newMatches,
  unread: state.unread
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  getMessages: (mid) => d => d(ActionMan.getMessages(mid))
})

Matches.displayName = 'Matches';

export default connect(mapStateToProps, mapDispatchToProps)(Matches);
