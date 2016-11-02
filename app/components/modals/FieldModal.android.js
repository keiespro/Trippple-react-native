import React from 'react';
import reactMixin from 'react-mixin';
import colors from '../../utils/colors';
import {
  NavigationStyles,
} from '@exponent/ex-navigation';
import {connect} from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  TextInput,
  Picker,
  DatePicker,
  Image,
  AsyncStorage,
} from 'react-native'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import {MagicNumbers} from '../../utils/DeviceConfig'
import moment from 'moment'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import ActionMan from '../../actions/'

const PickerItem = Picker.Item;

function getMaxLength(fieldName){
  let len = 20
  switch (fieldName){
    case 'firstname':
      len = 10; break;
    case 'email':
      len = 30; break;
  }
  return len
}


class MultiLineInput extends React.Component{
  constructor(props){
    super()
    this.state = {
      bioHeight: 165,
    }
  }

  sizeChange(e){
    console.log(e.nativeEvent.contentSize.height);
    this.setState({bioHeight: e.nativeEvent.contentSize.height})
  }

  render(){
    return (
      <TextInput
        {...this.props}
        autofocus
        style={[{
          alignSelf: 'stretch',
          padding: 0,
          flexGrow:0,
          fontSize: MagicNumbers.size18 + 2,
          fontFamily: 'omnes',
          color: colors.white,
          width: DeviceWidth - MagicNumbers.screenPadding
        }, {}]}
        placeholder={''}
        autoGrow
        autoCapitalize={'sentences'}
        placeholderTextColor={colors.white}
        maxLength={300}
        autoCorrect
        numberOfLines={7}
        returnKeyType={'done'}
        multiline
        keyboardAppearance={'dark'}
        ref={t => (this._textArea = t)}
        textAlignVertical={'top'}
        clearButtonMode={'always'}
        onContentSizeChange={this.sizeChange.bind(this)}
      />
    )
  }
}

class FieldModal extends React.Component{

  static route = {
    // styles: NavigationStyles.FloatVertical,
    navigationBar: {
      visible: false,
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        const fieldLabel = (params && params.title) || (params.field && params.field.label) || '';
        return fieldLabel.toUpperCase()
      }
    }
  };

  onDateChange = (date) => {
    this.setState({birthday: date, canContinue: true});
  };

  constructor(props){
    super(props);
    this.state = {
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      keyboardSpace: 0,
      birthday: props.fieldValue,
      value: props.fieldValue,
      phoneValue: props.fieldValue,
      canContinue: props.field.field_type == 'dropdown' ? !!props.fieldValue : false
    }
  }
  componentWillMount(){
    if(this.props.field.field_type == 'textarea'){
      this.setState({value: this.props.fieldValue ? `${this.props.fieldValue}\n` : ''})
    }
  }
  componentDidMount(){
    if(this.props.field.field_type == 'textarea' && this._textArea){
      this._textArea.focus()
      this._textArea.setNativeProps({value: this.props.fieldValue ? `${this.props.fieldValue}\n` : ''})
      // this._textArea.setSelectionRange((this.props.fieldValue ? this.props.fieldValue.length : this.state.value.length),(this.props.fieldValue ? this.props.fieldValue.length : this.state.value.length))
    }
  }
  onChange(val){
    console.log(val);

    if(!val) return
    let isValid = true;

    if(this.props.fieldName == 'email'){
      isValid = (/.+\@.+\..+/.test(val))
    }
    if(val.length > 0 && isValid){
      this.setState({
        canContinue: true,
        error: false,
        value: val.trim()
      })
    }else{
      this.setState({
        canContinue: false,
        error: true,
        value: val
      })
    }
  }
  onChangePhone({phone}){
    if(phone.length == 10){
      this.setState({
        canContinue: true,
        phoneValue: phone
      })
    }else{
      this.setState({
        canContinue: false,
        phoneValue: phone
      })
    }
  }

  getValueFromKey(data, key) {
    let value = null;
    Object.keys(data).forEach((i) => {
      if(i == key) {
        value = data[i];
      }
    });

    return { key, value};
  }

  // onDateChange(date){
  //
   // var isLegal = moment(date).diff(moment(), 'years') < -18;
  //   if(!isLegal){
  //    this.setState({
  //       error:true,
  //       inputFieldValue: date,
  //       date: date
  //
  //   })
  //
  //   }else{
  //     this._root.setNativeProps({date:date})
  //
  //     this.setState({
  //       error:false,
  //       date: date,
  //       canContinue:true
  //     })
  //   }
  // }
  submit(){
    if(!this.state.canContinue){ return false }
    if(this.props.field.field_type == 'date'){
      var payload = {};
      const v = moment(this.state.birthday).format('MM/DD/YYYY');

      payload[`${this.props.forPartner ? 'partner_' : ''}${this.props.fieldName}`] = v;
      this.props.updateOutside && this.props.updateOutside(v)
      this.props.dispatch(ActionMan.updateUser(payload))
      this.cancel()
    }else if(this.props.field.field_type == 'phone_input'){
      // this.props.navigator.push({
      //   component: PinScreen,
      //   title: '',
      //   id:'pinupdate',
      //   sceneConfig: CustomSceneConfigs.HorizontalSlide,
      //   passProps: {
      //     goBack: this.cancel,
      //     phone: this.state.phoneValue,
      //     initialKeyboardSpace: this.state.keyboardSpace
      //   }
      // })
    }else{
      var payload = {};

      payload[`${this.props.forPartner ? 'partner_' : ''}${this.props.fieldName}`] = this.state.value;
      this.props.updateOutside && this.props.updateOutside(this.state.value)
      this.props.dispatch(ActionMan.updateUser(payload))
      this.cancel()
    }
  }
  onChangeDate(d){
    console.log(d);

    this.setState({
      canContinue: true,
      birthday: d
    })
  }
  cancel(){
    this.props.dispatch(ActionMan.killModal())
  }
  renderButtons(){
    return (
      <View
        style={{
          bottom: 20,
          zIndex: 9999,
          flexDirection: 'row',
          height: 60,
          alignSelf: 'stretch',
          alignItems: 'center',
          width: DeviceWidth
        }}
      >
        <TouchableHighlight
          underlayColor={colors.dark}
          onPress={this.cancel.bind(this)}
          style={{ borderTopWidth: 1, borderColor: colors.rollingStone, flex: 1, paddingVertical: 20}}
        >
          <View>
            <Text style={{color: colors.white, fontSize: 20, fontFamily: 'montserrat', textAlign: 'center'}}>
              CANCEL
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.mediumPurple}
          onPress={this.submit.bind(this)}
          style={{
            borderTopWidth: 1,
            flex: 1,
            backgroundColor: this.state.canContinue ? colors.mediumPurple20 : 'transparent',
            borderColor: this.state.canContinue ? colors.mediumPurple : colors.rollingStone,
            borderLeftWidth: 1,
            alignItems: 'center',
            paddingVertical: 20
          }}
        >
          <View>
            <Text
              style={{
                color: this.state.canContinue ? colors.white : colors.rollingStone,
                fontSize: 20,
                fontFamily: 'montserrat',
                textAlign: 'center'
              }}
            >UPDATE</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render(){
    let {field, fieldValue} = this.props
    const get_values = (typeof this.props.field.values == 'object' && Object.keys(this.props.field.values).map(key => key)) || this.props.field.values;
    const get_key_vals = (typeof this.props.field.values == 'object' && this.props.field.values) || {};

    const displayField = (theField) => {
      switch (theField.field_type) {
        case 'MultiLineInput':
        case 'textarea':
          return (<MultiLineInput />)
        case 'input':
          return (
            <TextInput
              style={[styles.displayTextField, {fontSize: this.props.fieldName == 'email' ? 20 : 30 }]}
              onChangeText={(text) => this.setState({text})}
              placeholder={theField.placeholder ? theField.placeholder.toUpperCase() : fieldLabel.toUpperCase()}
              autoCapitalize={'words'}
              maxLength={10}
              placeholderTextColor={colors.white}
              autoCorrect={false}
              returnKeyType={'done'}
              autoFocus
              keyboardType={this.props.fieldName == 'email' ? 'email-address' : 'default'}
              keyboardAppearance={'dark'}
              ref={component => this._textInput = component}
              clearButtonMode={'always'}
            />
          );
        case 'phone_input':
          return (
            <PhoneNumberInput
              key={'updatephone'}
              style={styles.phoneInput}
            />
          )
        case 'birthday':
        case 'date':
          // always add an empty option at the beginning of the array

          return (
            <DatePickerIOS
              key={'bdayf'}
              label={'bday'}
              autoFocus
              forPartner={this.props.forPartner}
              mode={'date'}

              style={[{position: 'relative', bottom: 0, width: DeviceWidth }]}
              maximumDate={new Date(MAX_DATE)}
              minimumDate={new Date(MIN_DATE)}
            />

              );

        case 'dropdown':
          // always add an empty option at the beginning of the array

          return (
            <Picker
              style={{alignSelf: 'center', width: 330, backgroundColor: 'transparent', marginHorizontal: 0, alignItems: 'stretch'}}
              itemStyle={{fontSize: 24, color: colors.white, textAlign: 'center'}}
              selectedValue={this.state.selectedDropdown || theField.values[this.state.selectedDropdown] || null}
            >
              {get_values.map((val) => {
                return (<PickerItem
                  key={val}
                  value={get_key_vals[val] || val}
                  label={(theField.labelPrefix || '') + (get_key_vals[val] || val) + (theField.labelSuffix || '')}
                />
                )
              }
              )}
            </Picker>
          );

        default:
          return (
             null
          );
      }
    }
    const inputField = displayField(this.props.field)


    let purpleBorder
    if(field.field_type == 'phone_input'){
      purpleBorder = this.state.canContinue || (this.state.phoneValue && this.state.phoneValue.length == 0)
    }else{
      purpleBorder = this.state.canContinue || (this.state.value && this.state.value.length == 0)
    }
    let borderColor = purpleBorder ? colors.mediumPurple : colors.rollingStone
    if(this.state.error) borderColor = colors.mandy

    // console.info('init fieldmodal render:', {state:this.state, field:field, fieldValue:fieldValue, inputField:inputField});

    const fieldLabel = (fieldValue.label || fieldValue);
    fieldValue = (fieldValue.value || fieldValue);

    fieldValue = fieldValue ? fieldValue.toString() : '';

    let selectedFieldLabel = (this.state.value || fieldLabel || '');
    const selectedFieldValue = (this.state.value || fieldValue || this.props.fieldValue);

    if(typeof field.values == 'object' && selectedFieldValue) {
      selectedFieldLabel = this.getValueFromKey(field.values, selectedFieldValue).value || selectedFieldLabel;
    }

    let displayStateFieldValue = selectedFieldLabel.toString().toUpperCase();
    displayStateFieldValue = (field.labelPrefix || '') + displayStateFieldValue + (field.labelSuffix || '');

    const inside = () => {
      switch (field.field_type){
        case 'dropdown':
          return (
            <View style={{ alignSelf: 'stretch'}}>
              <View
                style={{
                  alignSelf: 'stretch',
                  width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                  marginHorizontal: MagicNumbers.screenPadding,
                  height: DeviceHeight - 260,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'stretch'
                  }}
                  >
                  <Text style={{
                    color: colors.rollingStone,
                    fontSize: 20,
                    textAlign: 'center',
                    textAlign: 'center',
                    fontFamily: 'omnes', alignSelf: 'stretch',
                    marginBottom: MagicNumbers.screenPadding,

                  }}
                  >{field.long_label ? field.long_label : field.label}</Text>
                  <Text style={{
                    padding: 8,
                    fontSize: 30,
                    width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                    marginHorizontal: MagicNumbers.screenPadding / 2,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.rollingStone,
                    textAlign: 'center',
                    fontFamily: 'montserrat',
                    color: colors.white}}
                  >{displayStateFieldValue}</Text>
                </View>
              </View>
              {this.renderButtons()}
              <View
                style={{
                  backgroundColor: colors.dark,
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 240,
                  width: DeviceWidth,
                  justifyContent: 'center',
                  padding: 0,
                  paddingBottom: 20
                }}
              >
                {React.cloneElement(inputField, {
                  onValueChange: this.onChange.bind(this),
                  selectedValue: (selectedFieldValue || null),
                  ref: (dropdown) => { this.dropdown = dropdown }
                }
            )}

              </View>
            </View>
        )

        case 'input':
          return (
            <View style={{ alignSelf: 'stretch', flex: 2, height: DeviceHeight, }}>
              <KeyboardAvoidingView
                style={{ alignSelf: 'stretch', flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}
                behavior={'padding'}
              >
                <View
                  style={{
                    alignSelf: 'stretch',
                    width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                    marginHorizontal: MagicNumbers.screenPadding,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'stretch',
                      flex: 1,
                      justifyContent: 'space-between',
                      flexDirection: 'column'
                    }}
                  >
                    <View
                      style={{
                        alignSelf: 'stretch',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        paddingVertical: 20
                      }}
                    >
                      <Text
                        style={{
                          color: colors.rollingStone,
                          fontSize: 20,
                          fontFamily: 'omnes',
                          textAlign: 'center',
                          marginBottom: MagicNumbers.is5orless ? 20 : 40,
                        }}
                      >{field.long_label ? field.long_label : field.label}</Text>

                      <View
                        style={{ borderBottomWidth: 1, borderBottomColor: borderColor, width: MagicNumbers.screenWidth }}
                      >
                        {React.cloneElement(inputField, {
                          maxLength: getMaxLength(this.props.fieldName),
                          selectionColor: colors.mediumPurple,
                          defaultValue: this.props.fieldName == 'firstname' ? (fieldValue ? fieldValue.slice(0, 10) : '') : fieldValue,
                          onChangeText: (value) => {
                            this.onChange(value.trim())
                          },
                          autoCapitalize: 'characters',
                          ref: (textField) => { this.textField = textField }
                        }
                      )}
                      </View>
                      {field.sub_label ?
                        <Text
                          style={{
                            color: colors.rollingStone,
                            fontSize: MagicNumbers.is5orless ? 14 : 18,
                            textAlign: 'center',
                            fontFamily: 'omnes',
                            marginTop: 15,
                          }}
                        >{field.sub_label}</Text> :
                        null
                      }
                      </View>

                    {/*
              this.state.error &&
                <View style={styles.bottomErrorTextWrap}>
                  <Text textAlign={'right'} style={[styles.bottomErrorText]}></Text>
                </View>
            */}


                  </View>
                </View>
                {this.renderButtons()}
              </KeyboardAvoidingView>
            </View>

      )

        case 'phone_input':
          return (
            <View style={{ alignSelf: 'stretch', flex: 1, justifyContent: 'space-between'}}>
              <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 0}}>
                {/* <Text style={{
                color: colors.rollingStone,
                fontSize: 20,textAlign:'center',
                fontFamily:'omnes',
                marginBottom:40,alignSelf:'stretch',
                marginHorizontal:10


              }}>{'PHONE NUMBER'}</Text> */}
                <View style={{ borderBottomWidth: 1, borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone }}>
                  {React.cloneElement(inputField, {
                    handleInputChange: (value) => {
                      this.onChangePhone(value)
                    },
                    renderButtons: this.renderButtons.bind(this),
                    ref: (phoneField) => { this.phoneField = phoneField }
                  }
            )}
                </View>

              </View>
              {this.renderButtons()}

            </View>
      )

        case 'date':
          return (
            <View style={{ alignSelf: 'stretch', }}>
              <View style={{ alignSelf: 'stretch',
              width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
              marginHorizontal: MagicNumbers.screenPadding,
           height: DeviceHeight - 260, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
              >
                <View style={{ alignSelf: 'stretch', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20}}>
                  <Text style={{
                    color: colors.rollingStone,
                    fontSize: 20, textAlign: 'center',
                    fontFamily: 'omnes',
                    marginBottom: 40, alignSelf: 'stretch'

                  }}
                  >{field.long_label ? field.long_label : field.label}</Text>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone, alignSelf: 'stretch', height: 50 }}>
                    <Text style={{
                      color: colors.white,
                      fontSize: 20, textAlign: 'center',
                      fontFamily: 'omnes',
                      marginBottom: 40, alignSelf: 'stretch'

                    }}
                    >{moment(this.state.birthday).format('MM/DD/YYYY')}</Text>
                  </View>
                </View>

              </View>
              {this.renderButtons()}

              <View style={{ height: 260, backgroundColor: colors.white }}>
                {React.cloneElement(inputField, {
                  onDateChange: this.onDateChange,
                  date: new Date(this.state.birthday),
                  ref: (dateField) => { this.dateField = dateField }
                }
            )}
              </View>


            </View>

        );
        case 'textarea':
          return (
            <View
              style={{
                flex: 1,
                flexGrow: 1,
                justifyContent: 'space-between',
                alignSelf: 'center',
                alignItems: 'center',
              }}
            >

              <Text
                style={{
                  color: colors.rollingStone,
                  fontSize: MagicNumbers.is5orless ? 18 : 20,
                  textAlign: 'center',
                  fontFamily: 'omnes',
                  marginTop: MagicNumbers.screenPadding,
                }}
              >{field.long_label ? field.long_label : field.label}</Text>

              <View style={{marginTop:-20}}>

                {React.cloneElement(inputField, {
                  defaultValue: fieldValue,
                  selectionColor: colors.mediumPurple,
                  autoFocus: true,
                  onChangeText: (value) => {
                    this.onChange(value)
                  }
                })}


              </View>

              {this.renderButtons()}

            </View>
        )

      }
    }
    return (

      <View style={{ flexGrow: 1}}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            flexGrow: 1,
            height: DeviceHeight-20,
            backgroundColor: colors.outerSpace,
            width: DeviceWidth
          }}
          behavior={'padding'}
        >
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              flexGrow: 1,

            }}
            style={{
              flex: 1,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps
            keyboardDismissMode={'interactive'}
          >

            {inside()}

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

reactMixin(FieldModal.prototype, TrackKeyboardMixin)

const mapStateToProps = (state, ownProps) => ({...ownProps })

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(FieldModal)


const styles = StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace
  //  overflow:'hidden'
  },
  inner: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.outerSpace,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },

  blur: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 40,

  },
  closebox: {
    height: 40,
    width: 40,
    backgroundColor: 'blue'
  },

  formHeader: {
    marginTop: 40
  },
  formHeaderText: {
    color: colors.rollingStone,
    fontFamily: 'omnes'
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',

    alignSelf: 'stretch',
    paddingTop: 0,
    height: 50,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.rollingStone

  },
  tallFormRow: {
    width: 250,
    left: 0,
    height: 220,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow: {
    height: 160,
    paddingLeft: 30,
    paddingRight: 30
  },
  picker: {
    height: 200,
    alignItems: 'stretch',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  halfcell: {
    width: DeviceWidth / 2,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around'


  },

  formLabel: {
    flex: 8,
    fontSize: 18,
    fontFamily: 'omnes'
  },
  header: {
    fontSize: 24,
    fontFamily: 'omnes'

  },
  textfield: {
    color: colors.white,
    fontSize: 20,
    alignItems: 'stretch',
    flex: 1,
    textAlign: 'left',
    fontFamily: 'montserrat',
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'omnes',
  },
  bottomErrorTextWrap: {

  },
  bottomErrorText: {
    marginTop: 0,
    color: colors.mandy,
    fontSize: 16,
    fontFamily: 'omnes',

  },
  pinInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 60,
    alignSelf: 'stretch'
  },
  pinInputWrapSelected: {
    borderBottomColor: colors.mediumPurple,
  },
  pinInputWrapError: {
    borderBottomColor: colors.mandy,
  },
  pinInput: {
    height: 60,
    padding: 8,
    fontSize: 30,
    fontFamily: 'montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 20,
    fontFamily: 'omnes',
  },
});
