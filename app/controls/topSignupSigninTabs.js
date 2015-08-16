/**
* @flow
*/
 ;

var React = require('react-native');
var {
  Text,
  StyleSheet,
  View,
  TouchableHighlight
} = React;

var colors = require('../utils/colors')
var TimerMixin = require('react-timer-mixin');

var TopTabs = React.createClass({
  mixins: [TimerMixin],
  getInitialState(){
    return ({
      ready: false
    })
  },
  componentDidMount(){
    this.setTimeout(
      () => {
        this.setState({
          ready: true
        })
      },
      500
    );
  },
  toggleTab(tab) {
    if(this.state.ready && this.props.active != tab){
      console.log('toggle tab',tab)
      this.props.toggleTab(tab)
    }
  },
  render() {
    return (
      <View style={styles.topButtons}>
        <TouchableHighlight
          key={'toptablogin'}
          style={[styles.topButton,(this.props.active == 'login' ? styles.activeButton : styles.otherButton)]}
          onPress={()=>this.toggleTab('login')}
          underlayColor={this.props.active == 'login' ? colors.outerSpace : colors.rollingStone}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableHighlight>

        <TouchableHighlight
          key={'toptabregister'}
          style={[styles.topButton,(this.props.active == 'register' ? styles.activeButton : styles.otherButton)]}
          onPress={()=>this.toggleTab('register')}
          underlayColor={this.props.active == 'register' ? colors.outerSpace : colors.rollingStone}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableHighlight>
      </View>
    );
  }
});


var styles = StyleSheet.create({

  topButton: {
    height: 80,
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  activeButton:{
    backgroundColor: colors.outerSpace,
  },
  otherButton:{
    backgroundColor: colors.shuttleGray,
  },
  buttonText: {
    fontSize: 24,
    color: colors.white,
    opacity:0.5,
    alignSelf: 'center',
    fontFamily:'Montserrat'
  },
  topButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignSelf:'stretch',
    width: undefined
  },
});

module.exports = TopTabs;
