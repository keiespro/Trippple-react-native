'use strict';

import {Text, View, Dimensions, TouchableOpacity, Picker, Image, LayoutAnimation,ScrollView} from 'react-native';
import React, {Component} from 'react';

import ContinueButton from '../controls/ContinueButton';
import colors from '../../utils/colors';
import styles from './purpleModalStyles';


import ActionMan from '../../actions'
import Selectable from '../controls/Selectable'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {BlurView, VibrancyView} from 'react-native-blur';
import {MagicNumbers} from '../../utils/DeviceConfig';
const get_key_vals = (v) => v.toLowerCase();
var PickerItem = Picker.Item;
const our_choices = ['Single F', 'Single M', 'MM', 'MF', 'FF'];
const them_choices = {couple: ['F', 'M'], single: ['MM', 'MF', 'FF']};
import PurpleModal from './PurpleModal';

class OnboardModal extends Component {
  constructor(props) {
    super();
    this.state = {
      step: 0,
      selected_ours: null,
      selected_theirs:{
        mm:false,
        ff:false,
        mf:false,
        m:false,
        f:false
      },
      selected_relationship_status:null
    };
  }
  onboardUser(){
    let gender = this.state.selected_ours.slice(this.state.selected_ours.length-2,this.state.selected_ours.length).trim();

    this.props.dispatch(ActionMan.onboard({
      relationship_status: this.state.selected_relationship_status,
      name: this.props.user.firstname,
      email: this.props.user.email,
      facebook_user_id: this.props.user.facebook_user_id,
      gender
    }))
  }

  handleContinue(){
    if(this.state.selected_relationship_status == 'single'){
      this.onboardUser()
    }else{

      this.props.navigator.push(this.props.navigation.router.getRoute('Coupling',{
        onboardUser: this.onboardUser.bind(this)
      }))

    }
  }


  togglePref(p){
    const pref = p.toLowerCase()
    const selected_theirs = { ...this.state.selected_theirs}

    selected_theirs[pref] = !selected_theirs[pref];
    LayoutAnimation.easeInEaseOut()


    this.setState({
      selected_theirs
    })
  }


  render() {
    const has_theirs =  Object.keys(this.state.selected_theirs).reduce((acc,el)=>{
      if(this.state.selected_theirs[el]){
        acc = true
      }
      return acc
    },false)
    return (
        <BlurView blurType="dark">
        <View style={[styles.col, {width: DeviceWidth, height: DeviceHeight}]}>
          <ScrollView>
          <View style={[styles.col,{paddingBottom:160,paddingTop:40}]}>
            {MagicNumbers.is5orless ? null :  <Image
                style={{width: this.state.step == 0 ? 150 : 100, height: this.state.step == 0 ? 150 : 100}}
                key={'onboardpic'}
                source={{uri: this.props.user.image_url}}
                defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                resizeMode={Image.resizeMode.cover}
              />}

          <Text style={{
            color: colors.white,
            fontFamily: 'Montserrat-Bold',justifyContent:'space-between',
            fontSize: 18,
          }}>Welcome {this.props.user.firstname}</Text>

                    <Text style={{
                      color: colors.white,
                      fontFamily: 'Omnes',justifyContent:'space-between',
                      fontSize: 16,
                    }}>Let's get started</Text>

            <View style={[ {marginTop:20,alignItems: 'flex-start',justifyContent:'space-between'}]}>
              <TouchableOpacity
              style={{
                width: DeviceWidth-20,
                marginLeft: 20,
                paddingLeft: 20,
                height: 80,
                paddingRight:20,
                justifyContent: 'center',
                backgroundColor:  colors.transparent,
                borderBottomWidth:1,
                borderBottomColor: this.state.step == 1 ? colors.mediumPurple : colors.rollingStone
              }}
              onPress={() => {
                LayoutAnimation.spring()
                this.setState({step: 1});
              }}>
              <View style={[styles.rowtext, styles.bigtext, {

                marginVertical: 10,
                flexDirection:'row',
                justifyContent:'space-between'
              }]}>
                <Text style={{
                  fontFamily: 'Montserrat',
                  fontSize: 20,
                  color: this.state.step == 1 ? colors.white : colors.rollingStone,
                  textAlign: 'left'
                }}>I'M A...</Text>
                {this.state.selected_ours && <Text style={{
                  fontFamily: 'Montserrat',
                  fontSize: 20,
                  color: this.state.step == 1 ? colors.white : colors.rollingStone, }}>{this.state.selected_ours.toUpperCase()}</Text>}
                </View>
            </TouchableOpacity>

              <TouchableOpacity
              style={{
                width: DeviceWidth,
                marginLeft: 20,
                paddingLeft: 20,
                height: 80,
                justifyContent: 'center',
                backgroundColor: colors.transparent,
                borderBottomWidth:1,
                borderBottomColor: this.state.step == 2 ? colors.mediumPurple : colors.rollingStone
              }}
              onPress={() => {
                if (this.state.selected_ours) {
                  LayoutAnimation.spring()
                  this.setState({step: 2});
                }
              }}>
              <Text style={[styles.rowtext, styles.bigtext, {
                fontFamily: 'Montserrat',
                fontSize: 20,
                marginVertical: 10,
                textAlign: 'left',
                color: this.state.step == 2 ? colors.white : colors.rollingStone
              }]}>LOOKING FOR...</Text>
            </TouchableOpacity>
          </View>

        </View>
        </ScrollView>

      { this.state.step > 0 && <View
            style={{
              backgroundColor: 'rgba(0,0,0,.5)',
              width: DeviceWidth,
              height:200,
              position:'absolute',
              bottom:0,
              // alignSelf:'flex-end'
            }}>
            <View style={{height:80,position:'absolute',top:-80,left:0,right:0,width:DeviceWidth,overflow:'hidden'}}>
              <ContinueButton
                customText={ 'CONTINUE' }
                handlePress={this.handleContinue.bind(this)}
                canContinue={this.state.selected_ours && has_theirs}
              />
           </View>
           {   this.state.step == 1 &&
                  <Picker
                  onValueChange={(v, i) => {
                    if(!v) return false;
                    console.log(v);
                    this.setState({
                      selected_ours: v,
                      selected_relationship_status: v.toLowerCase().indexOf('single') > -1 ? 'single' : 'couple',
                      selected_theirs: {
                        mm:false,
                        ff:false,
                        mf:false,
                        m:false,
                        f:false
                      },
                    });
                  }}
                  style={{
                    alignSelf: 'center',
                    width: DeviceWidth,
                    backgroundColor: 'transparent',
                    marginHorizontal: 0,
                    alignItems: 'stretch',
                  }}
                  itemStyle={{
                    fontSize: 24,
                    color: colors.white,
                    textAlign: 'center',
                  }}
                  selectedValue={this.state.selected_ours || null}>
                  <PickerItem
                    key={'xn'}
                    value={null}
                    label={( '')}
                  />
                                    {our_choices.map((val) => {
                    return (<PickerItem
                      key={val}
                      value={get_key_vals(val) || val}
                      label={(val || '')}
                    />);
                  })}
         </Picker> }

     {   this.state.step == 2 &&
                    this.state.selected_ours &&
                    them_choices[this.state.selected_relationship_status].map((val) => {
                      const selected = this.state.selected_theirs[val.toLowerCase()]

                      return (
                        <Selectable
                          selected={selected}
                          key={val+'k'}
                          underlayColor={colors.mediumPurple20}
                          value={this.state.selected_theirs[val.toLowerCase()]}
                          onPress={this.togglePref.bind(this,val)}
                          field={val}
                          label={val}
                          values={them_choices[this.state.selected_relationship_status]}
                        />
                      )
                    })
                  }



          </View>}
        </View>
      </BlurView>

    );
  }
}

OnboardModal.displayName = 'OnboardModal';
export default OnboardModal;
