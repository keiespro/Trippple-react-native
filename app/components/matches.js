/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput,
 PixelRatio,
 ListView,
 NavigatorIOS,
 Navigator
} = React;

var Api = require("../utils/api");
var Chat = require("./chat");



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

var MatchList = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return {
      matches: [],
      dataSource: ds.cloneWithRows([])
    }

  },

  componentDidMount: function(){
    Api.getMatches()
      .then((res) => {
        console.log(res);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({matches:  res.response, dataSource: ds.cloneWithRows(res.response) })

      })



  },

  _renderRow: function(rowData: object, sectionID: number, rowID: number) {
    console.log(rowData,sectionID,rowID);
      // var imgSource = {
      //   uri:
      // };

    var myId = 450;

    var them = Object.keys(rowData.users).reduce( (arr, e, i, originalArray) =>{
      if(rowData.users[e].id !== myId ){

      // if(rowData.users[e].id !== myId && rowData.users[e].id !== myPartnerId){
        arr.push(rowData.users[e]);
      }
      return arr;
    }, new Array());

    console.log(them);

    // rowData.users.map((el,i) =>{
    // })
    // for (var user in rowData.users) {
    //   console.log(user);
    // }
    var threadName = '';

    return (
      <TouchableHighlight onPress={() => this._pressRow(rowData.match_id)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {`${them[0].name} & ${them[1].name}`}
              {/*`${them[0].name}```*/}

            </Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  },
  _pressRow: function(matchId: number) {
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
  },
  render: function() {
    console.log('rennn');
    return (
      <View style={styles.container}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
      </View>
    );
  }
})



class Matches extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      matches: []
    }
  }
  render(){
    console.log('outmatchesrender')
    return (
      <MatchList
       id={"matcheslist"} navigator={this.props.navigator} title={"matchlist"}>

      </MatchList>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  },
});

module.exports = Matches;
