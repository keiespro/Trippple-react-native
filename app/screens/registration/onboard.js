import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  InteractionManager,
} from 'react-native'

import UserActions from '../../flux/actions/UserActions'
import Birthday from './bday'
import Privacy from '../../components/privacy'
import colors from '../../utils/colors'
import SelectRelationshipStatus from './selectRelationshipStatus'
import Facebook from './facebook'
import CustomSceneConfigs from '../../utils/sceneConfigs'
import Dimensions from 'Dimensions'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class Onboard extends Component{
  constructor(props){
    super(props)

    this.state = {

    }
  }

  selectScene(route: Navigator.route, navigator: Navigator) : Component {
    return (<route.component {...route.passProps} navigator={Navigator} user={this.props.user} />);
  }

  render() {
    console.log('onboard nav')

    return (
      <View style={styles.container}>
        <Navigator
          configureScene={ (route) => {
            return route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.HorizontalSlide
          }}

          onDidFocus={(x,y)=>{console.log('onDIDfocus',x,y)}}
          onWillFocus={(x,y)=>{console.log('onwillfocus',x,y)}}
          renderScene={this.selectScene.bind(this)}
          initialRoute={{
            index: 0,
             component: SelectRelationshipStatus,
             id:'relStatus',
             title:'rel status',
             sceneConfig: CustomSceneConfigs.SlideInFromRight,
             passProps: { }
           }}
          />
      </View>
    )


  }

}


const styles = StyleSheet.create({

  sceneWrap:{
    backgroundColor: colors.outerSpace
  },
  container: {
    flex: 1,
    height:DeviceHeight,
    width:DeviceWidth,
    padding:0,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.sushi
  },
  padTop:{

    paddingTop:60
  },
  textplain:{
    // color:'#111',
    // fontSize:30,
    fontFamily:'omnes'
  },

  iconButton:{
    height:70,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignSelf:'stretch',
    flex: 1,
    width: undefined
    // marginVertical:10
  },
  iconButtonLeftBox: {
    width: 80,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:10,
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  iconButtonLeftBoxSingles: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1

  },
  iconButtonRightBox: {
    width: undefined,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:20,
    flex: 1
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonSingles:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1
  },
  iconButtonSelected:{
    // backgroundColor:,
  },
  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
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
  // navBar: {
  //   backgroundColor: '#39365c',
  //   height: 50,
  //   justifyContent:'space-between',
  //   alignSelf: 'stretch',
  //   alignItems:'center',
  // },
  // navBarText: {
  //   fontSize: 16,
  // },
  // navBarTitleText: {
  //   color: '#222',
  //   fontWeight: '500',
  //   fontFamily:'omnes',
  //   height: 50,
  //
  // },
  // navBarLeftButton: {
  //   paddingLeft: 10,
  //   height: 50,
  //
  // },
  // navBarRightButton: {
  //   paddingRight: 10,
  //   height: 50,
  //
  // },
  // navBarButtonText: {
  //   color: '#dddddd',
  //   fontFamily:'omnes'
  // },
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


export default Onboard
