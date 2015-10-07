import React from 'react-native'
import {
  PropTypes,
  Text,
  Component
} from 'react-native'

import moment from 'moment'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

@reactMixin.decorate(TimerMixin)
class TimeAgo extends Component{

  static propTypes: {
    time: PropTypes.string.isRequired,
    interval: PropTypes.number
  }

  static defaultProps =()=> {
    return {
      interval: 60000
    }
  }

  componentDidMount() {
    var {interval} = this.props;
    this.setInterval(this.update, interval);
  }

  componentWillUnmount() {
    this.clearInterval(this.update);
  }

  // We're using this method because of a weird bug
  // where autobinding doesn't seem to work w/ straight this.forceUpdate
  update() {
    this.forceUpdate();
  }

  render() {
    return (
      <Text {...this.props}>{this.props.showSent && 'SENT '}{moment(this.props.time).fromNow().toUpperCase()}</Text>
    );
  }
}

export default TimeAgo
