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
 InteractionManager,
 ListView,
 Navigator,
 AsyncStorage
} = React;

var colors = require('../utils/colors');

var alt = require('../flux/alt')
var Chat = require("./chat");
var MatchActions = require('../flux/actions/MatchActions');
var MatchesStore = require("../flux/stores/MatchesStore");
var Swipeout = require('react-native-swipeout');
var Logger = require('../utils/logger');
var customSceneConfigs = require('../utils/sceneConfigs')

// Buttons
var swipeoutBtns = [
  {
    text: 'Button'
  }
];



class MatchList extends React.Component{

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
  shouldComponentUpdate(nextProps,nextState){

  //   if(this.props.matches.length === nextProps.matches.length) return false;
    return true;
  }
  _renderRow(rowData, sectionID: number, rowID: number) {

    var myId = this.props.user.id,
        myPartnerId = this.props.user.relationship_status == 'couple' ? this.props.user.partner_id : null;

    var them = Object.keys(rowData.users).reduce( (arr, e, i) => {
      if(rowData.users[e].id !== myId && rowData.users[e].id !== myPartnerId){
        // this might need to be cloned or a const
        arr.push(rowData.users[e]);
      }
      return arr;
    }, []);

    var threadName = them.map( (user,i) => {
      return user.name.trim();
    }).join(' & ');

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
        <TouchableHighlight onPress={() => {Logger.log('onpress Swipeout');  this._pressRow(rowData.match_id); }} key={rowData.match_id+'match'}>

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

    // use OUTER navigator
    // this.props.navigator.push({
console.log(this.props.navigator)
    // use INNER (main) navigator.
    this.props.navigator.push({
      component: Chat,
      id:'chat',
      index: 3,
      title: 'CHAT',
      passProps:{
        index: 3,
        matchID: matchID
      },
      sceneConfig: customSceneConfigs.SlideInFromRight,
    });
  }
  render(){

    return (
      <View style={styles.container}>
        <ListView
          initialListSize={12}
          removeClippedSubviews={false}
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
    console.log('mount matches',this.props.user_id,this.props.user.id)

    MatchesStore.listen(this.onChange.bind(this));

        // get data from server
    if(this.props.user.id){
        MatchActions.getMatches();
    }

  }

  onChange(state) {
    if(state.matches.length < 0) return false
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.setState({
        matches: state.matches,
        dataSource: ds.cloneWithRows(state.matches)
      })
    // if(state.matches.length){
    //   InteractionManager.runAfterInteractions(() => {
    //     this.saveToStorage()
    //   })
    // }
  }
  saveToStorage(){
    AsyncStorage.setItem('MatchesStore', alt.takeSnapshot(MatchesStore))
      .then(() => {console.log('saved matches store')})
      .catch((error) => {console.log('AsyncStorage error: ' + error.message)})
      .done();
  }
  componentWillUnmount() {
    console.log('UNmount matches')

    MatchesStore.unlisten(this.onChange.bind(this));
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
    backgroundColor: colors.outerSpace,
    paddingTop:50,
    flex: 1,
    overflow:'hidden'
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
