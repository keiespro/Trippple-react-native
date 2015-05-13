/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 Image,
 View,
 TouchableHighlight,
 TextInput,
 PixelRatio,
 ListView,
 NavigatorIOS,
 Navigator
} = React;

var Chat = require("./chat");
var ChatActions = require('../flux/actions/ChatActions');
var ChatStore = require("../flux/stores/ChatStore");


class NavButton extends React.Component {
  constructor(props){
    super(props);
  }
  onPress(){
    this.props.onPress(this.props.matchId)

  }
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.onPress.bind(this)}>
        <Text style={styles.navText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class MatchList extends React.Component{

  constructor(props) {
    super(props);
    console.log(this.props,'props');



  }


  // componentDidUpdate(){
  //   console.log('matches list update',this.props.matches.length)
  //   var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  //
  //   this.setState({
  //     dataSource: ds.cloneWithRows(this.props.matches)
  //   })
  // }
  // shouldComponentUpdate(nextProps,nextState){
  //   console.log(nextProps,nextState)
  //   if(this.props.matches.length === nextProps.matches.length) return false;
  //   return true;
  // }
  _renderRow(rowData: object, sectionID: number, rowID: number) {
    console.log('renderrow1',rowData);
    var myId = this.props.user.id;
    var myPartnerId = this.props.user.relationship_status == 'couple' ? this.props.user.partner_id : null;
    console.log(myId,myPartnerId)
    var them = Object.keys(rowData.users).reduce( (arr, e, i, originalArray) => {
      if(rowData.users[e].id !== myId && rowData.users[e].id !== myPartnerId){
        arr.push(rowData.users[e]);
      }
      return arr;
    }, new Array());

    var threadName = them.map( (user,i) => {
      return user.name.trim();
    }).join(' & ');

    var images = them.map( (user,i) => {
      //
      // var imgwrapClass = cx({
      //   'smallbig': relStatus == 'couple',
      //   'bigbig': relStatus == 'single'
      // });
      // var classes = cx({
      //   "media-object":true,
      //   "most-recent": (lastMessage.from_user_id == user.id),
      //   "not-most-recent": (lastMessage.from_user_id != user.id && lastMessage.from_user_id != myUserId),
      //   "small-image": (relStatus == 'single' ? false : (user.id == partnerId)),
      //   "big-image": (relStatus == 'single' ? true : (user.id != partnerId)),
      //   "left-big-image": relStatus == 'couple' ? false : i == 0,
      //   "right-big-image": relStatus == 'couple' ? false : i == 1,
      //   "isfemaleshowontop": user.gender == 'f'
      // });

      return (
        <Image
          style={!i ? styles.thumb : [styles.thumb, styles.rightthumb]}
          source={{uri: user.thumb_url}}
          defaultSource={require('image!defaultuser')}
          resizeMode={Image.resizeMode.cover}

        />
      )

    });

    return (
      <TouchableHighlight onPress={() => this._pressRow(rowData.match_id)} key={rowData.match_id}>
        <View>
          <View style={styles.row}>
            <View style={styles.thumbswrap}>
              {images}
            </View>
            <View style={styles.textwrap}>
              <Text style={styles.text}>
                {threadName}
              </Text>
              <Text style={styles.text}>
                {rowData.recent_message.message_body || 'New Match'}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
  _pressRow(matchId: number) {
    this.props.navigator.push({
      component: Chat,
      id:'chat',
      index: 3,
      title: 'CHAT',
      passProps:{
        index: 3,
        matchId: matchId
      },
      sceneConfig: Navigator.SceneConfigs.PushFromRight,
    });
  }
  render(){
    console.log('rennn');
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.props.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }
}



class Matches extends React.Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      matches: [],
      dataSource: ds.cloneWithRows([])
    }
  }
  componentDidMount(){
    ChatStore.listen(this.onChange.bind(this));
    ChatActions.getMatches();
  }

  onChange(state) {
    console.log(state.matches,'onc');
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      matches: state.matches,
      dataSource: ds.cloneWithRows(state.matches)
    })
  }
  componentWillUnmount() {
    ChatStore.unlisten(this.onChange.bind(this));
  }
  render(){
    return (
          <MatchList
            user={this.props.user}
            dataSource={this.state.dataSource}
            matches={this.state.matches}
            id={"matcheslist"}
            navigator={this.props.navigator}
            title={"matchlist"}
          />
    );
  }
}


var styles = StyleSheet.create({
  container: {
    backgroundColor: '#39365c',
    paddingTop:60,
    flex: 1
  },
  navText: {
    color:"#000000"
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    height:70,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#39365c',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumbswrap: {
    width: 128,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  thumb: {
    borderRadius: 32,
    width: 64,
    height: 64,
    borderColor: '#ffffff',
    borderWidth: 3/PixelRatio.get()
  },
  rightthumb: {
    left: -16
  },
  text: {
    flex: 1,
    color:'#ffffff'
  },
  textwrap:{
    height: 64,
    flexDirection: 'column',
    justifyContent: 'center',

  }
});

module.exports = Matches;
