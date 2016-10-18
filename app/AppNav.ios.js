import {StackNavigation, NavigationContext, NavigationProvider} from '@exponent/ex-navigation';
import React from 'react'
import {View,Dimensions} from 'react-native'
import colors from './utils/colors'
import Router from './Router'

const DeviceHeight = Dimensions.get('window').height;


export default class AppNav extends React.Component {
    render() {
        return (
        <View style={{height:DeviceHeight}}>
          <StackNavigation
              id="exnavigation"
              sceneStyle={{
                  overflow: 'visible',
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 6
              }}

              defaultRouteConfig={{
                  navigationBar: {
                      visible: true,
                      borderBottomWidth: 0,
                      translucent:true,
                      tintColor:'#fff',
                      backgroundColor:'rgba(0,0,0,0)',
                      titleStyle:{
                          color:'#fff',
                          fontFamily:'montserrat',
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
