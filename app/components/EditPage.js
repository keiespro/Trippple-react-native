import React from "react";
import {Component} from "react";
import {View, StyleSheet, Text, TextInput, ScrollView, TouchableHighlight} from "react-native";
import colors from '../utils/colors'
import Dimensions from 'Dimensions';
import UserActions from '../flux/actions/UserActions'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class EditPage extends Component{

  constructor(props){
    super()
    this.state = {
      editedValue: ''
    }
  }
  handleCancel(){

    this.props.navigator.pop();
  }
  handleUpdate(){
    UserActions.updateUser({firstname: this.state.editedValue});
    // this.props.navigator.pop();

  }
  _onTextChange(text){
    this.setState({editedValue: text})
  }
  render(){

      return (
        <View style={[{flex: 1, height:DeviceHeight, paddingBottom: 0}]}>
          <ScrollView
            keyboardDismissMode={'on-drag'}
            contentContainerStyle={[styles.wrap, {left: 0}]}
            bounces={false}
            >
            <View style={[styles.inputWrap]}>
              <TextInput onChangeText={this._onTextChange.bind(this)} autofocus={true} defaultValue={this.props.val} style={styles.input}/>
            </View>

          </ScrollView>

          <View style={[styles.continueButtonWrap,
              ]}>
            <TouchableHighlight
               style={[styles.continueButton]}
               onPress={this.handleCancel.bind(this)}
               underlayColor="black">

               <Text style={styles.continueButtonText}>Cancel</Text>
             </TouchableHighlight>
             <TouchableHighlight
                style={[styles.continueButton]}
                onPress={this.handleUpdate.bind(this)}
                underlayColor="black">

                <Text style={styles.continueButtonText}>Update</Text>
              </TouchableHighlight>
          </View>


      </View>


    )

  }

}

export default EditPage


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    padding:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
  },
  wrap: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding:20

  },
  inputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 60,
    alignSelf: 'stretch'
  },
  inputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  input: {
    height: 60,
    padding: 8,
    fontSize: 30,
    fontFamily:'Montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    fontFamily:'Montserrat',
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'omnes'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  continueButtonWrap:{
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flexDirection:'row',
    height: 80,
    backgroundColor: colors.mediumPurple,
    flex:1,
    width:DeviceWidth
  },
  continueButton: {
    flex:1,
    height: 80,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButtonText: {
    padding: 4,
    fontSize: 30,
    fontFamily:'Montserrat',
    color: colors.white,
    textAlign:'center'
  }
});
