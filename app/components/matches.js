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
  // constructor(props){
  //   super(props);
  //   console.log('x')
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      return {
        matches: [],
        dataSource: ds.cloneWithRows([{
    "users": {
        "user_230": {
            "id": 230,
            "image_url": "https://trippple-user.s3.amazonaws.com/uploads/230/0edff94-profile.jpeg",
            "thumb_url": "https://trippple-user.s3.amazonaws.com/uploads/230/0edff94-profile-thumbnail.jpeg",
            "name": "Prince Shariff",
            "role": ""
        }
        ,
        "user_2": {
            "id": 2,
            "image_url": "https://trippple-user.s3.amazonaws.com/test/uploads/images/2/84f1a75e9-original.jpg",
            "thumb_url": "https://trippple-user.s3.amazonaws.com/test/uploads/images/2/thumb_84f1a75e9-original.jpg",
            "name": "Benny",
            "role": ""
        }
        ,
        "user_1": {
            "id": 1,
            "image_url": "https://trippple-user.s3.amazonaws.com/uploads/1/0eeac69-original.jpg",
            "thumb_url": "https://trippple-user.s3.amazonaws.com/uploads/1/0eeac69-original-thumbnail.jpg",
            "name": "Sandra",
            "role": ""
        }
    }
    ,
    "match_id": 21,
    "created_timestamp": 1425713448,
    "recent_message": {
        "created_timestamp": 1430998958,
        "from_user_info": {
            "id": 2,
            "image_url": "https://trippple-user.s3.amazonaws.com/test/uploads/images/2/thumb_84f1a75e9-original.jpg",
            "name": "Benny",
            "role": ""
        }
        ,
        "message_id": 4004,
        "message_body": "Sup"
    }
}])
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

   handlePress: function(matchId){
     console.log(matchId);
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

   _renderRow: function(rowData: object, sectionID: number, rowID: number) {
     console.log(rowData,sectionID,rowID);
      // var imgSource = {
      //   uri:
      // };
      for (var user in rowData.users) {
        console.log(user);
      }
      return (
        <TouchableHighlight onPress={() => this._pressRow(rowData.match_id)}>
          <View>
            <View style={styles.row}>
              <Text style={styles.text}>
                {rowData.created_timestamp}
              </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    },



    _pressRow: function(matchId: number) {
      // this._pressData[rowID] = !this._pressData[rowID];
      // this.setState({dataSource: this.state.dataSource.cloneWithRows(
      //   this._genRows(this._pressData)
      // )});
      console.log(matchId);
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
    console.log('renda');

    return (
      <View   style={styles.container}>
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
