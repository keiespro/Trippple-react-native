import {StackNavigation, NavigationContext, NavigationProvider} from '@exponent/ex-navigation';
import React from 'react'
import {View} from 'react-native'
import colors from './utils/colors'
import Router from './Router'

export default class AppNav extends React.Component {
  render() {

    return (
        <View>
          <StackNavigation
            id="exnavigation"
            defaultRouteConfig={{
              navigationBar: {
                visible: true,
                borderBottomWidth: 0,
                translucent:true,
                tintColor:'#fff',
                backgroundColor:colors.outerSpaceAnimate,
                titleStyle:{
                  color:'#fff',
                  fontFamily:'Montserrat',
                  borderBottomWidth: 0,
                }
              },
            }}
            initialRoute={Router.getRoute('Potentials',{show:true})}
          />
        </View>
    )
  }
}
