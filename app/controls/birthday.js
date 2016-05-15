/**
 * @flow
 */

import React from "react";

import {Text, StyleSheet, View, PickerIOS} from "react-native";
const PickerItemIOS = PickerIOS.Item
import colors from '../utils/colors'

const monthList = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
];
const yearsList = [],
      currentyear = new Date().getFullYear();

for(var i = currentyear - 18; i >= currentyear - 65; i--){
  yearsList.push(i);
}

const Birthday = React.createClass({
  getInitialState() {
    return {
      bday_month: this.props.bdayMonth,
      bday_year: this.props.bdayYear,
    };
  },
  render() {
    return (
      <View style={styles.bdaycontainer}>
        <Text style={styles.header}>Birthday </Text>
        <Text style={styles.formLabel}>Month </Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.props.bdayMonth}
          onValueChange={(bday_month) => this.props.updateMonth(bday_month)}>
          {monthList.map( (month, index) => (
              <PickerItemIOS
                key={'month_' + index}
                value={index}
                label={month}
              />
            ))
          }
        </PickerIOS>

        <Text style={styles.formLabel}>Year </Text>

        <PickerIOS
          key={'yearpicker'}
          style={styles.picker}
          selectedValue={this.props.bdayYear}
          onValueChange={(bday_year) => this.props.updateYear(bday_year)}>
          {yearsList.map( (year, index) => (
              <PickerItemIOS
                key={'y_' + index}
                value={year}
                label={year+''}
              />
            ))
          }
        </PickerIOS>
      </View>
    );
  }
});



const styles = StyleSheet.create({

 formRow: {
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'center',
   paddingLeft: 15,
   paddingRight:15,
   backgroundColor:'#fff',
   height:60,
 },
 tallFormRow: {
   width: undefined,
   height:220,
   alignSelf:'stretch',
  //  alignItems: 'center',
  //  flexDirection: 'row',
  //  justifyContent: 'center'
 },
 sliderFormRow:{
   height:160,
   paddingLeft: 30,
   paddingRight:30
 },
 picker:{
   height:150,
   width:undefined,
   backgroundColor: colors.white,
   alignItems: 'stretch',
   flexDirection: 'column',
   alignSelf:'stretch',
   justifyContent:'center',
 },
 halfcell:{
   alignItems: 'center',
   alignSelf:'center',
  //  justifyContent:'space-around'


 },
 formLabel: {
   fontSize: 18,
   fontFamily:'omnes'
 },
 header:{
   fontSize:24,
   fontFamily:'omnes'

 },
 bdaycontainer:{
   height: 500,
   width: undefined
 }
});


export default Birthday;
