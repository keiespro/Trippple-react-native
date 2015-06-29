/* @flow */

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;

var UserActions = require('../flux/actions/UserActions');


var Privacy = React.createClass({
  getInitialState(){
    return ({
      privacy: this.props.user.privacy || null
    })
  },
  _goPrivate(){
      // if is fb logged in
    this.setState({
      privacy: 'hidden'
    })

    //otherwise login with fb and try again
  },
  _goPublic(){
    this.setState({
      privacy: 'public'
    })
  },
  _submit(){
    UserActions.updateUser({
      privacy: this.state.privacy
    });
    this.props.handlePrivacyChange && this.props.handlePrivacyChange(this.state.privacy);

    this.props.saveAndClose && this.props.saveAndClose();

  },

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.cardcontainer}>
          <TouchableHighlight style={[styles.button,(this.state.privacy == 'public' && styles.selected)]} onPress={this._goPublic}>
            <Text style={styles.textS}>Public</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.button,(this.state.privacy == 'hidden' && styles.selected)]} onPress={this._goPrivate}>
            <Text style={[styles.textS,styles.textbottom]}>Private</Text>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.button,styles.submitbutton]} onPress={this._submit}>
            <Text style={[styles.textS,styles.textbottom]}>Continue</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },


});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardcontainer:{
    margin:10,
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#111',
    overflow:"hidden"
  },
  textS:{
    color:'#111',
    fontSize:30,
    fontFamily:'omnes'
  },
  selected:{
    backgroundColor:'yellow'
  },
  button:{
    backgroundColor: '#ddd',
    borderRadius: 3,
    borderWidth: 1,
    borderColor:'#111',
    alignSelf:'stretch',
    alignItems:'stretch',
    height:50,
    width:undefined
  },
  submitbutton:{
    backgroundColor: 'blue'
  },
  textbottom:{
    marginTop: 20,
  }
});


module.exports = Privacy;
