var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;

var UserActions = require('../flux/actions/UserActions');


class Onboard extends React.Component{
  render() {
    console.log(this.props.user);

    switch (this.props.user.relationship_status){

      case "single":
        return (<View><Text style={styles.textplain}>SINGLE</Text></View>)
      case "couple":
        return (<View><Text style={styles.textplain}>COUPLE</Text></View>)
      case null:
      default:
        return (<SelectRelationshipStatus user={this.props.user}/>)

    }
  }

}


class SelectRelationshipStatus extends React.Component{
  constructor(props){

    super(props);

    this.state = {
      selection: null
    }
  }

  _selectSingle(){
    this.setState({
      selection: 'single'
    })
  }
  _selectCouple(){
    this.setState({
      selection: 'couple'
    })
  }
  _continue(){
    UserActions.updateUser({relationship_status:this.state.selection})
  }
  render() {

    return (
      <View style={styles.container}>
          <Text style={[styles.textplain]}>ONBOARDING</Text>

          <TouchableHighlight
            style={[styles.fatbutton,(this.state.selection == 'couple' && styles.fatbuttonSelected)]}
            onPress={this._selectCouple.bind(this)}>
            <Text style={[styles.textplain]}>Couple</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.fatbutton,(this.state.selection == 'single' && styles.fatbuttonSelected)]}
            onPress={this._selectSingle.bind(this)}>
            <Text style={[styles.textplain]}>Single</Text>
          </TouchableHighlight>

          {this.state.selection ?
            <TouchableHighlight
              style={styles.button}
              onPress={this._continue.bind(this)}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableHighlight> :
            <View style={[styles.button,styles.disabledButton]}>
              <Text style={[styles.buttonText, styles.disabledbuttonText]}>Continue</Text>
            </View>}

      </View>
    );
  }


}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding:20
  },
  textplain:{
    color:'#111',
    fontSize:30,
    fontFamily:'omnes'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#111',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  disabledButton: {
    borderColor: '#aaa',
  },
  disabledButtonText: {
    fontSize: 18,
    color: '#aaa',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  fatbutton:{
    padding:10,
    height:100,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    marginVertical:10
  },
  fatbuttonSelected:{
    backgroundColor:'green',
  }
});


module.exports = Onboard;
