
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  ScrollView,
  Dimensions,
  Animated,
  PixelRatio,
  NativeModules,
  Platform,
  Image,
  AsyncStorage,
} from  'react-native'

import React from "react";
import dismissKeyboard from 'dismissKeyboard'

import AgePrefs from '../../controls/AgePrefs';
import FieldModal from '../../modals/FieldModal';
import PartnerMissingModal from '../../modals/PartnerMissingModal';
import PermissionSwitches from '../../controls/PermissionSwitches';
import colors from '../../../utils/colors';
import styles from './settingsStyles';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import ActionMan from '../../../actions'
import Selectable from '../../controls/Selectable'
import {connect} from 'react-redux'

import {
  NavigationStyles,
} from '@exponent/ex-navigation';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

import OSPermissions from '../../../../lib/OSPermissions/ospermissions'
const iOS = Platform.OS == 'ios';


class MultiLineInput extends React.Component{
  constructor(props){
    super()
    this.state = {
      bioHeight: 65,
    }
  }
  sizeChange(e){
    this.setState({bioHeight: e.nativeEvent.contentSize.height})
  }

  render(){
    return (
      <TextInput
      {...this.props}
        autofocus={true}
        style={[styles.autogrowTextinput,{paddingVertical:5,height: this.state.bioHeight}]}
        placeholder={''}
        autoGrow={true}
        autoCapitalize={'sentences'}
        placeholderTextColor={colors.white}
        maxLength={300}
        autoCorrect={true}
        returnKeyType={'done'}
        multiline={true}
        keyboardAppearance={'dark'}
        ref={'_textArea'}
        clearButtonMode={'always'}
        onContentSizeChange={this.sizeChange.bind(this)}
      />
    )
  }
}
class SettingsPreferences extends React.Component{

    static route = {
      styles: iOS ? SlideHorizontalIOS : FloatHorizontal,
      navigationBar: {
        backgroundColor: colors.shuttleGrayAnimate,
        visible:true,
        translucent:true,
        title(params){
          return `PREFERENCES`
        }
      }
    };
  constructor(props){
    super()
    this.state = {
      bio: null,
      scroll: 'on',
      nearMeToggled: OSPermissions.location && parseInt(OSPermissions.location) > 2,
      looking_for_mf: props.user.looking_for_mf || false,
      looking_for_mm: props.user.looking_for_mm || false,
      looking_for_ff: props.user.looking_for_ff || false,
      looking_for_m: props.user.looking_for_m || false,
      looking_for_f: props.user.looking_for_f || false,
    }
  }
  toggleField(field){
    var newState = {}
    newState[field] = !this.state[field]
    this.props.dispatch(ActionMan.updateUser(newState))
    this.setState(newState)
  }
  toggleScroll(direction){
    this.setState({scroll:direction})
  }
   editBio(){
     this.props.navigator.push(this.props.navigation.router.getRoute('FieldModal', {
        component: FieldModal,
        inputField: ()=>{
            return(
              <MultiLineInput
              />
            )
        },
        field:{
          label: `What are you looking for in a Match?`,
          field_type:'textarea'
        },
        updateOutside:this.updateBio.bind(this),
        title:'PREFERENCES',
        fieldName:'bio',
        cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
        fieldValue: this.state.bio || this.props.user.bio || '',
      }))

  }
  updateBio(v){
    // console.log('update outside',v);
    this.setState({bio:v})
  }
  onPressSelectable(field){
      this.toggleField(field)

  }

  render(){
    let u = this.props.user;

    const {looking_for_mf,looking_for_mm,looking_for_ff, looking_for_f, looking_for_m} = this.state
    const values = {looking_for_mf,looking_for_mm,looking_for_ff, looking_for_f, looking_for_m}
    return (

        <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,height:DeviceHeight,overflow:'hidden',flex:1,paddingTop:60}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            automaticallyAdjustContentInsets={true}
            style={{
              flex:1,
              paddingVertical:MagicNumbers.is5orless ? 0 : 20
            }}
            scrollEnabled={this.state.scroll == 'on' ? true : false}
          >
              <View style={[styles.paddedSpace,{marginTop:0}]}>
                <View style={styles.formHeader}>
                  <Text style={styles.formHeaderText}>
                    What are you looking for in a Match?
                  </Text>
                </View>
              </View>

              <View style={{marginTop:10}}>
                <TouchableHighlight underlayColor={colors.dark} onPress={this.editBio.bind(this)}>
                  <View style={styles.textareaWrap}>
                    <Text numberOfLines={2} style={styles.bioText}>
                      {this.state.bio ? this.state.bio : this.props.user.bio ? this.props.user.bio : ''}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={[styles.paddedSpace,{marginBottom:0}]}>
                <View style={styles.formHeader}>
                  <Text style={styles.formHeaderText}>{`Show Me`}</Text>
                </View>
              </View>

              {this.props.user.relationship_status == 'single' && <Selectable
                field={'looking_for_mf'}
                onPress={this.onPressSelectable.bind(this)}
                label={'Couples (MALE/FEMALE)'}
                values={values}
                selected={this.state.looking_for_mf}
              />}
              {this.props.user.relationship_status == 'single' && <Selectable
                field={'looking_for_mm'}
                onPress={this.onPressSelectable.bind(this)}
                label={'Couples (MALE/MALE)'}
                selected={this.state.looking_for_mm}
                values={values}
              />}
              {this.props.user.relationship_status == 'single' && <Selectable
                field={'looking_for_ff'}
                selected={this.state.looking_for_ff}

                onPress={this.onPressSelectable.bind(this)}
                label={'Couples (FEMALE/FEMALE)'}
                values={values}
              />}
              {this.props.user.relationship_status == 'couple' && <Selectable
                field={'looking_for_f'}
                onPress={this.onPressSelectable.bind(this)}
                label={'SINGLE FEMALES'}
                selected={this.state.looking_for_f}
                values={values}
              />}
              {this.props.user.relationship_status == 'couple' &&  <Selectable
                field={'looking_for_m'}
                selected={this.state.looking_for_m}
                onPress={this.onPressSelectable.bind(this)}
                label={'SINGLE MALES'}
                values={values}
              />
              }

              <View style={{paddingTop: 50}}>

                <AgePrefs
                  toggleScroll={this.toggleScroll.bind(this)}
                  user={this.props.user}
                  dispatch={this.props.dispatch}
                />

              <PermissionSwitches {...this.props} />
            </View>

          </ScrollView>
          </View>


    )
  }
}

SettingsPreferences.displayName = "SettingsPreferences"

const mapStateToProps = (state, ownProps) => {
  return {...ownProps, user:state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPreferences);
