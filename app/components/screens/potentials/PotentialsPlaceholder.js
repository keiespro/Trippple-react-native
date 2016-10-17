import { Text, View, Image, Dimensions, ActivityIndicator, LayoutAnimation,TouchableOpacity, NativeModules } from 'react-native';
import React from "react";
import FadeInContainer from '../../FadeInContainer';
import SettingsBasic from '../settings/SettingsBasic';
import colors from '../../../utils/colors';
import styles from './styles';
import config from '../../../../config'
import profileOptions from '../../../data/get_client_user_profile_options'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import ActionMan from '../../../actions'
import {pure} from 'recompose'
const {FBAppInviteDialog} = NativeModules
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const {INVITE_FRIENDS_APP_LINK} = config;
const getPotentialsButtonEnabled = true;
import {connect} from 'react-redux'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'


@reactMixin.decorate(TimerMixin)
class PotentialsPlaceholder extends React.Component{
    constructor(props){
        super()
        this.state = {loading:true}
    }
    onDidShow(){
        this.props.onDidShow && this.props.onDidShow(true)
    }
    componentDidMount(){
      this.startTimer()

    }
    openProfileEditor(){

        this.props.navigator.push(this.props.navigation.router.getRoute('SettingsBasic',{
            style:styles.container,
            settingOptions:profileOptions,
        }));
        this.setState({loading:true})

    }
    openPrefs(){

        this.props.navigator.push(this.props.navigation.router.getRoute('SettingsPreferences',{
        }));
        this.setTimeout(()=>{
          this.setState({loading:true})
        },5000)
    }
    startTimer(){
      this.setTimeout(()=>{
        this.setState({loading:false})
      },15000)
    }
    getMorePotentials(){
  //this.state.loading

        this.setState({loading:true})
        const {latitude,longitude} = this.props.user
        const coords = {latitude,longitude};
        this.props.dispatch(ActionMan.getPotentials())

        // this.props.dispatch({type:'REQUEST_POTENTIALS_MANUALLY',payload:{coords}})

    }
    componentDidUpdate(pState){
        if(this.state.loading && !pState.loading){
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            this.startTimer()

        }
    }

    inviteFriends(){
        this.setState({loading:true})
        FBAppInviteDialog.show({applinkUrl: INVITE_FRIENDS_APP_LINK})
    }

    render(){
        const {user} = this.props;
        const attrs = ['drink', 'smoke', 'height', 'body', 'ethnicity', 'eye_color', 'hair_color'];
        let potentialsReturnedEmpty = this.props.potentialsReturnedEmpty;
        const userProfileIncomplete = attrs.reduce((acc,el)=>{
            if(!user[el]){
                return true
            }else{
                return false
            }
        },false);

        return (
        <FadeInContainer
            delayAmount={2000}
            duration={300}
        >
            <View
                style={[
                    styles.dashedBorderImage,
                    {
                        height: DeviceHeight,
                        width:DeviceWidth,
                        backgroundColor:colors.outerSpace,
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex:1,
                        flexDirection: 'column',

                    }
                ]}
            >
                <Image
                    source={{uri: 'assets/placeholderDashed@3x.png'}}
                    style={{
                        alignSelf: 'stretch',
                        height: MagicNumbers.is5orless ? DeviceHeight-90 : DeviceHeight-55-MagicNumbers.screenPadding/2,
                        marginHorizontal: MagicNumbers.is4s ? MagicNumbers.screenPadding : 15,
                        marginVertical: MagicNumbers.is4s ? MagicNumbers.screenPadding : 15,
                        width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 0,
                        flex:1,
                        bottom:0,
                        left: 0,
                        flexDirection: 'column',
                    }}
                    resizeMode={MagicNumbers.is4s ? Image.resizeMode.stretch : Image.resizeMode.contain}
                >
                    <Image
                        source={{uri: 'assets/tripppleLogo@3x.png'}}
                        style={{
                            alignSelf: 'center',
                            opacity:  1,
                            height:160,
                            width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding*2 : DeviceWidth-30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: this.state.loading ? 50 : 10
                        }}
                        resizeMode={Image.resizeMode.contain}
                    />



                  {this.state.loading &&
                    <View style={{flex:0,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>

                    <Text
                        style={{
                            color: colors.white,
                            fontSize: MagicNumbers.size18+2,
                            textAlign: 'center',
                            fontFamily:'montserrat',fontWeight:'800',
                        }}
                    >{`LOOKING FOR MATCHES`}</Text>
                  <Spinner />

                  </View> }

              {userProfileIncomplete && !this.state.loading ?
                <Button
                    btnText={'COMPLETE YOUR PROFILE'}
                    labelText={`WANT MORE MATCHES?`}
                    loading={this.state.loading}
                    onTap={this.openProfileEditor.bind(this)}
                /> : null
              }

              {!userProfileIncomplete && getPotentialsButtonEnabled && !potentialsReturnedEmpty && (!this.state.loading) ?
                <Button
                    loading={this.state.loading}
                    btnText={  'GET MORE MATCHES'}
                    labelText={ `GO AHEAD, TREAT YOURSELF`}
                    labelPosition={'bottom'}
                    onTap={this.getMorePotentials.bind(this)}
                /> : null
              }

              {!userProfileIncomplete && potentialsReturnedEmpty && (!this.state.loading) ?
                <Button
                    loading={this.state.loading}
                    btnText={ `ADJUST PREFERENCES`}
                    labelText={ `NO MORE USERS MATCH YOUR PREFERENCES`}
                    labelPosition={'top'}
                    onTap={this.openPrefs.bind(this)}
                /> : null
              }
              {!userProfileIncomplete && !potentialsReturnedEmpty && !getPotentialsButtonEnabled && !this.state.loading ?
                <Button
                    btnText={'INVITE FRIENDS'}
                    onTap={this.inviteFriends.bind(this)}
                /> : null
              }
          </Image>
        </View>
      </FadeInContainer>
    )
    }
}



const Spinner = ({labelText,btnText,onTap,loading}) => (

        <ActivityIndicator
            style={{top:0,height:50,width:50,marginVertical:50}}
            color={colors.white20}
            animating={true}
            size={'large'}
        />
);

const Button = ({labelText,labelPosition='top',btnText,onTap,loading}) => (
    <View
        style={{
            alignSelf:'stretch',
            marginTop:30,
            marginHorizontal:20,
            flex:0
        }}
    >
      {labelText && labelPosition == 'top' &&
        <Text
            style={{
                color: colors.rollingStone,
                fontSize: MagicNumbers.size18-2,
                textAlign: 'center'
            }}
        >{labelText}</Text>}

    <TouchableOpacity
        onPress={onTap}
        style={{
            justifyContent:'center',
            alignItems:'center',
            borderRadius:5,
            borderWidth:1,
            paddingVertical:15,
            borderColor:colors.white,
            marginTop:15,
            marginBottom:20,
            marginHorizontal:MagicNumbers.screenPadding
        }}
    >
      <View>
        <Text
            style={{
                color: colors.white,
                textAlign: 'center',
                fontFamily:'Montserrat-Bold'
            }}
        >
          {btnText}
        </Text>
      </View>
    </TouchableOpacity>

    {labelText && labelPosition == 'bottom' &&
      <Text
          style={{
              marginTop:20,
              color: colors.rollingStone,
              fontSize: MagicNumbers.size18-2,
              textAlign: 'center'
          }}
      >{labelText}</Text>}

  </View>
);

PotentialsPlaceholder.displayName = "PotentialsPlaceholder"


const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        user: state.user,
        potentialsReturnedEmpty: state.app.potentialsReturnedEmpty
    }
}
const mapDispatchToProps = (dispatch) => {
    return { dispatch };
}

export default connect(mapStateToProps,mapDispatchToProps)(PotentialsPlaceholder)
