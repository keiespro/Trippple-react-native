import {
  Image,
  Text,
  Settings,
  ScrollView,
  Animated,
  ActivityIndicator,
  View,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ActionMan from '../../../actions';
import colors from '../../../utils/colors';
import styles from '../potentials/styles';
import {MagicNumbers} from '../../../utils/DeviceConfig';
import { connect } from 'react-redux';
import {SHOW_COUPLING} from '../../../utils/SettingsConstants'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class NoPartner extends React.Component{
  constructor(props){
    super()
    const startState = props.startState || {}

    this.state = {
      success:false,
      ...startState
    }
  }


  couple(){

    //TODO: if we are not coming from the onboard modal, we should confirm
    // with the user if they want really to join a couple. Then we need to 
    // ask their partner's gender, for now it assumes partner is female.
    this.props.onboardUser ? this.props.onboardUser() : this.props.dispatch(ActionMan.onboard({
      relationship_status:'couple',
      genders:`${this.props.user.gender}f`
    }))
    this.props.exit();
  }
  nothanks(){
    this.props.exit();
  }

  render(){

    const couple = this.props.couple || {};

    return (
      <ScrollView>
      <View style={{left:0}}>
        <View style={[{width:DeviceWidth, paddingTop:MagicNumbers.is5orless ? 30 : 50,paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

          <View style={{height:120,marginVertical:MagicNumbers.is5orless ? 10 : 30,flexDirection:'row',alignItems:'center',justifyContent:'center',transform:[{scale:MagicNumbers.is5orless ? .8 : 1 }]}}>
                      <Image style={[{width:120,height:120,borderRadius:60,marginLeft:0}]}
            source={ {uri: this.props.user.image_url} }
            defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
          </View>

          <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', backgroundColor:'transparent', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10 }]}>
            COUPLE
          </Text>

          <View style={{flexDirection:'column' }} >
            <Text style={[styles.rowtext,styles.bigtext,{
              fontSize:MagicNumbers.is5orless ? 17 : 20,
              marginVertical:10,
              color:'#fff',
              marginBottom:15,
              backgroundColor:'transparent',
              flexDirection:'column'
            }]}>
            You can still proceed as a couple even if your partner isn't ready to join. We strongly encourage you to have your partner join, especially since Couples where both people have joined get 50% more matches on average. Your partner can still join you at a later time, just send them your couple code and we'll connect you.
        </Text>
        </View>

    
        <View style={{alignItems:'center',justifyContent:'center'}}>

          {this.state.submitting ?
              <ActivityIndicator style={[ {width:80,height: 80}]} size="large" animating={true}/> :
            <TouchableHighlight
            underlayColor={colors.white20}
            style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:0,marginTop:20,marginBottom:15}}
            onPress={this.couple.bind(this)}>
            <View style={{paddingVertical:20,paddingHorizontal:MagicNumbers.is5orless ? 10 : 20}} >
              <Text style={{fontFamily:'Montserrat-Bold', backgroundColor:'transparent', fontSize:MagicNumbers.is5orless ? 16 : 18,textAlign:'center', color:'#fff',}}>
                PROCEED AS A COUPLE
              </Text>
            </View>
          </TouchableHighlight>
          }
        </View>
        <TouchableOpacity onPress={this.nothanks.bind(this)}>
          <Text style={{backgroundColor:'transparent', fontSize:16,textAlign:'center', marginVertical:MagicNumbers.is5orless ? 5 : 40,color:colors.rollingStone,}}>
            Nevermind
          </Text>
        </TouchableOpacity>
      </View>

    </View>
      </ScrollView>
    )
  }
 }


const mapStateToProps = (state, ownProps) => {
  return { ...ownProps, pin: state.app.couplePin, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoPartner);
