var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  SegmentedControlIOS
} = React;

var UserActions = require('../flux/actions/UserActions');
var Birthday = require('../controls/birthday');
var ImageUpload = require('./imageUpload');
var Privacy = require('./privacy');

var DistanceSlider = require('../controls/distanceSlider');
var ToggleSwitch = require('../controls/switches');

class SingleLookingFor extends React.Component{
  render(){
    return (
      <View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Male + Male</Text>
          <ToggleSwitch/>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Male + Female</Text>
          <ToggleSwitch/>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Female + Female</Text>
          <ToggleSwitch/>
        </View>
      </View>
    )
  }
}

class CoupleLookingFor extends React.Component{
  render(){
    return (
      <View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Male</Text>
          <ToggleSwitch/>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Looking For Female</Text>
          <ToggleSwitch/>
        </View>
      </View>
    )
  }
}

class PrivacyWrap extends React.Component{
  constructor(props){
    super(props);
  }
  _continue(value){

    this.props.navigator.push({
      component: ImageUpload,
      id:'imgupload',
      title:'image'
    })

  }

  render(){
    return(
      <Privacy user={this.props.user} handlePrivacyChange={this._continue.bind(this)}/>
    )
  }
}

class LookingFor extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'match_age_min': this.props.user.match_age_min || null,
      'match_age_max': this.props.user.match_age_max || null,
      'match_distance': this.props.user.match_distance || null
    }
  }
  _continue(){
    console.log('continue')
    UserActions.updateUser({
      match_age_min: this.state.match_age_min,
      match_age_max: this.state.match_age_max,
      match_distance: this.state.match_distance,
    })

    this.props.navigator.push({
      component: PrivacyWrap,
      id:'privacy',
      title:'privacy'
    });
  }
  _setAgeMin(value){

    this.setState({
      match_age_min: value
    })
  }
  _setAgeMax(value){

    this.setState({
      match_age_max: value
    })
  }
  _setDistance(value){

    this.setState({
      match_distance: value
    })
  }
  render(){
    return(
      <View style={[styles.container,styles.padTop]}>

        {this.props.user.relationship_status == 'couple' ?
          <CoupleLookingFor/> :
          <SingleLookingFor/>
        }


        <View pointerEvents={'box-none'}>

          <Text style={styles.formLabel}>Age</Text>
          <View style={[styles.formRow, styles.sliderFormRow]}><DistanceSlider handler={this._setAgeMin.bind(this)} /></View>
          <View style={[styles.formRow, styles.sliderFormRow]}><DistanceSlider handler={this._setAgeMax.bind(this)} /></View>

          <Text style={styles.formLabel}>Distance</Text>
          <View style={[styles.formRow, styles.sliderFormRow]}><DistanceSlider handler={this._setDistance.bind(this)} /></View>

        </View>
        <TouchableHighlight style={styles.continue} onPress={this._continue.bind(this)}>
          <Text style={[styles.textplain]}>Continue</Text>
        </TouchableHighlight>
      </View>

    )
  }
}


class AboutYou extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'bday_year': this.props.user.bday_year || null,
      'bday_month': this.props.user.bday_month || null,
      firstname: this.props.user.firstname || null,
      gender: this.props.user.gender || null
    }
  }
  _setMonth(m){
    console.log(m)

    this.setState({
      'bday_month': m
    })
  }
  _setYear(y){
    console.log(y)
    this.setState({
      'bday_year': y
    })
  }
  _continue(){
    console.log('continue')
    UserActions.updateUser({
      bday_year: this.state.bday_year,
      gender: this.state.gender,
      bday_month: this.state.bday_month,
      firstname: this.state.firstname,
    })


    this.props.navigator.push({
      component: LookingFor,
      id:'lookingfor',
      title:'Looking For'
    })
  }
  render(){
    return(
        <View style={[styles.container,styles.padTop]}>
          <TextInput
            style={styles.textfield}
            placeholder={'First name'}
            value={this.state.firstname}
            onChangeText={(text) => this.setState({firstname: text})}
          />
          <SegmentedControlIOS
            values={['m','f']}
            tintColor={'#000'}
            selectedIndex={this.state.gender == 'm' ? 0 : 1}
            onValueChange={(value) => this.setState({gender:value})} />
          <Birthday
            bdayYear={this.state.bday_year}
            bdayMonth={this.state.bday_month}
            updateYear={this._setYear.bind(this)}
            updateMonth={this._setMonth.bind(this)}
            />
          <TouchableHighlight style={styles.continue} onPress={this._continue.bind(this)}>
            <Text style={[styles.textplain]}>Continue</Text>
          </TouchableHighlight>

        </View>
     )
  }
}

  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {
      if(route.id == 'aboutyou') return false;
      return (
        <TouchableOpacity
          onPress={() => {
            navigator.pop();
          }}>
          <View style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              Back
            </Text>
          </View>
        </TouchableOpacity>

      );

    },
    Title: function(route, navigator, index, navState) {
      return (
        <View >
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {route.title}
          </Text>
        </View>
      );
    },
    RightButton:  function(route, navigator, index, navState) {
      return false;
    }
  };

class OnboardSingle extends React.Component{

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      return (<route.component {...route.passProps} navigator={navigator} user={this.props.user} />);
    }

    render(){


      return(

        <Navigator
                ref="nav"
                itemWrapperStyle={[styles.container,styles.padTop]}
                renderScene={this.selectScene.bind(this)}

                navigationBar={ <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} style={styles.navbar} /> }

                initialRoute={{
                   component: AboutYou,
                   title: 'About You',
                   id:'aboutyou'
                 }}
                  />


      )
    }
}
class OnboardCouple extends React.Component{
    render(){


      return(
        <View style={styles.container}>
          <Text style={styles.textplain}>COUPLE</Text>
          <AboutYou user={this.props.user}/>
        </View>
      )
    }
}

class Onboard extends React.Component{
  render() {
    console.log(this.props.user);

    switch (this.props.user.relationship_status){

      case "single":
        return (<OnboardSingle user={this.props.user}/>)
      case "couple":
        return (<OnboardCouple user={this.props.user}/>)
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
    height:undefined,
    width:undefined,
    padding:10
  },
  padTop:{

    paddingTop:60
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
  },
  textfieldWrap:{
    height:undefined,
    flex:1,
    alignSelf:'stretch',
    width:undefined
  },
  textfield:{
    color:'#111',
    backgroundColor:'#fff',
    fontSize:18,
    borderWidth:2,
    borderColor:'#111',
    paddingHorizontal:20,
    fontFamily:'omnes',
    height:60
  },
  header:{
    fontSize:24,
    fontFamily:'omnes'

  },
  panel:{
    width:undefined,
    height:undefined,

    borderColor:'#000',
    borderWidth:2
  },
  navBar: {
    backgroundColor: '#39365c',
    height: 50,
    justifyContent:'space-between',
    alignSelf: 'stretch',
    alignItems:'center',
  },
  navBarText: {
    fontSize: 16,
  },
  navBarTitleText: {
    color: '#222',
    fontWeight: '500',
    fontFamily:'omnes',
    height: 50,

  },
  navBarLeftButton: {
    paddingLeft: 10,
    height: 50,

  },
  navBarRightButton: {
    paddingRight: 10,
    height: 50,

  },
  navBarButtonText: {
    color: '#dddddd',
    fontFamily:'omnes'
  },
  continue:{
    backgroundColor:'green',
    alignItems:'center',
    justifyContent:'center',
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight:15,
    backgroundColor:'#fff',
    height:60,
  },
  tallFormRow: {
    width: 250,
    left:0,
    height:120,
    alignSelf:'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow:{
    height:120,
    paddingLeft: 30,
    paddingRight:30
  },

});


module.exports = Onboard;
