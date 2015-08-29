/* @flow */


var React = require('react-native');
var {
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
} = React;

var colors = require('../utils/colors');

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

var alt = require('../flux/alt')
var Chat = require('./chat');
var MatchActions = require('../flux/actions/MatchActions');
var MatchesStore = require('../flux/stores/MatchesStore');
var Swipeout = require('react-native-swipeout');
var Logger = require('../utils/logger');
var customSceneConfigs = require('../utils/sceneConfigs')

// Buttons
var swipeoutBtns = [
  {
    text: 'Unmatch'
  }
];



class MatchList extends Component{

  constructor(props) {
    super(props);

  }

  // TODO: figure out how dataSource actually works
  // componentDidUpdate(){
  //   console.log('matches list update',this.props.matches.length)
  //   var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  //
  //   this.setState({
  //     dataSource: ds.cloneWithRows(this.props.matches)
  //   })
  // }
  // shouldComponentUpdate(nextProps,nextState){

  // //   if(this.props.matches.length === nextProps.matches.length) return false;
  //   return true;
  // }
  _renderRow(rowData, sectionID: number, rowID: number) {

    var myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status === 'couple' ? this.props.user.partner_id : null;

    var them = Object.keys(rowData.users).reduce( (arr, e, i) => {
      if(rowData.users[e].id !== myId && rowData.users[e].id !== myPartnerId){
        // this might need to be cloned or a const
        arr.push(rowData.users[e]);
      }
      return arr;
    }, []);

    var threadName = them.map( (user,i) => user.name.trim() ).join(' & ');

    var images = them.map( (user,i) => {

      // TODO: convert these classes to stylesheet
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
          key={i+'userimage'}
          style={!i ? styles.thumb : [styles.thumb, styles.rightthumb]}
          source={{uri: user.thumb_url}}
          defaultSource={require('image!defaultuser')}
          resizeMode={Image.resizeMode.cover}

        />
      )

    });

    return (
      <Swipeout right={swipeoutBtns}  key={rowData.match_id+'match'}>
        <TouchableHighlight onPress={() => {console.log('onpress Swipeout');  this._pressRow(rowData.match_id); }} key={rowData.match_id+'match'}>

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
        matchID: matchID
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    });
  }
  render(){

    return (
      <View style={styles.container}>
        <ListView
        initialListSize={12}
        pageSize={8}
        removeClippedSubviews={false}
        renderScrollComponent={ () => <ScrollView style={{height:DeviceHeight,flex:1}} /> }
        dataSource={this.props.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }
}



class Matches extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      matches: [],
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount(){
    MatchesStore.listen(this.onChange.bind(this));
    if(this.props.user.id){
        MatchActions.getMatches();
    }
  }
  componentWillUnmount() {
    MatchesStore.unlisten(this.onChange.bind(this));
  }

  onChange(state) {
    if(state.matches.length < 0){return false}
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.setState({
      matches: state.matches,
      dataSource: ds.cloneWithRows(state.matches)
    })
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
  noop:{},
  container: {
    backgroundColor: colors.outerSpace,
    marginTop:50,
    flex: 1,
    overflow:'hidden',
    height: DeviceHeight-50,
    borderTopWidth: 1,
    borderTopColor: colors.shuttleGray,

  },
  navText: {
    color:colors.black,
    fontFamily:'omnes'

  },
  button: {
    backgroundColor: colors.white,
    padding: 15,
    height:70,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: colors.outerSpace,
  },
  topRow: {
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
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
    color:'#ffffff',
    fontFamily:'omnes'

  },
  textwrap:{
    height: 64,
    flexDirection: 'column',
    justifyContent: 'center',
    width: 200,
    overflow: 'hidden'
  }
});

module.exports = Matches;
