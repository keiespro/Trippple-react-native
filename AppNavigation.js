
import { View, NavigationExperimental,StyleSheet,Platform,Image,Text,TouchableOpacity,TouchableHighlight } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import Potentials from './app/components/potentials'
const NavigationHeaderBackButton = require('NavigationHeaderBackButton');
import Settings from './app/components/settings'
import Matches from './app/components/matches'
import SettingsDebug from './app/components/SettingsDebug'

// import appNavReducer from './reducers/appNavReducer'
import colors from './app/utils/colors'
const {
  popRoute,
  pushRoute,
  jumpTo
} = actions;


const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

class GlobalNavigation extends Component {
	constructor(props) {
		super(props);

	}

  _handleAction (action) {
    this.props.dispatch(action)
    if(action.type == 'pop'){
      this.props.dispatch(popRoute("global"));
    }else if(action.type == 'push'){
      this.props.dispatch(pushRoute(action.route,"global"));

    }
    // const newState = appNavReducer(this.state.navState, action);
    // if (newState == this.state.navState) {
    //   return false;
    // }
    // this.props.dispatch({
    //   action:
    //   navState: newState
    // })
    return true;
  }

  handleBackAction() {

    if(this.props.navigation.index == 0){
      this.props.goBack();
      return
    }
    return this._handleAction({ type: 'pop' });
  }

	render() {
		return (
      <NavigationCardStack
        onNavigate={this._handleAction.bind(this)}
        style={{backgroundColor:colors.outerSpace}}
        onNavigateBack={this.handleBackAction.bind(this)}
        direction={'vertical'}
        navigationState={this.props.navigation}
        renderScene={this._renderScene.bind(this)}
        renderHeader={this._renderHeader.bind(this)}

      />
		);
	}

	_renderHeader(props) {
		const showHeader = !this.props.profileOpen;
      const label = props.scene.route.key || props.scene.route.title || props.scene.route.name || props.scene.route.id ||  '';
		if (showHeader) {
			return  label.toLowerCase() == 'potentials' || label == 'p' || label == 'leftb' ? (
				<NavigationHeader
          style={{backgroundColor:colors.outerSpace,flexDirection:'row',height:30, alignItems:'center',justifyContent:'flex-start',}}
  				{...props}
  				renderTitleComponent={() => <Image
                resizeMode={Image.resizeMode.contain}
                style={{width:80,height:30,tintColor: __DEV__ ? colors.daisy : colors.white,alignSelf:'center'}}
                source={{uri:'assets/tripppleLogoText@3x.png'}}
              />
          }
  				renderLeftComponent={() => <TouchableOpacity onPress={()=>{this._handleAction({route: {component:Settings,noHeader:true,key:'rightb',index:1}, type:'push'})}}>
            <Image
                resizeMode={Image.resizeMode.contain}
                style={{width:28,top:0,height:30,marginLeft:15,alignSelf:'flex-start',tintColor: __DEV__ ? colors.daisy : colors.white}}
                source={{uri:'assets/gear@3x.png'}}
              />
            </TouchableOpacity>
          }
  				renderRightComponent={ () => <TouchableOpacity onPress={()=>{this._handleAction({route: {component:Matches, key:'tittie',index:1},type:'push'})}}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={{opacity:1,width:30,marginRight:15,top:0,height:30,alignSelf:'flex-end',tintColor: __DEV__ ? colors.daisy : colors.white}}
              source={{uri:'assets/chat@3x.png'}}
            />
          </TouchableOpacity>
        }
        />
        ) : ( <NavigationHeader
                style={{backgroundColor: (props.scene.route.noHeader ? colors.outerSpace : colors.shuttleGray)}}
        				{...props}
        				renderTitleComponent={this._renderTitleComponent.bind(this)}
        				renderLeftComponent={this._renderLeftComponent.bind(this)}
        				renderRightComponent={this._renderRightComponent.bind(this)}
      				/>
            );
		}

		return null;
	}

	_renderTitleComponent(props) {

		return (
			<NavigationHeader.Title>
			  {props.scene.route.title || ''}
      </NavigationHeader.Title>
		);
	}

	_renderLeftComponent(props) {
		const { dispatch, navigation } = this.props;

		// if (props.scene.route.showBackButton) {
			return (
        <TouchableOpacity

          style={[styles.buttonContainer,{padding:10}]}
          onPress={()=>dispatch(popRoute(navigation.key))}>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{opacity:1,width:15,marginLeft:15,top:0,padding:0,height:15,alignSelf:'flex-start',tintColor: __DEV__ ? colors.daisy : colors.white}}
            source={{uri: 'assets/close@3x.png'}}
           />
         </TouchableOpacity>
			);
		// }

		// return null;
	}

	_renderRightComponent(props) {
		if (props.scene.route.key === 'list') {
			return (
				<TouchableHighlight
					style={styles.buttonContainer}
					onPress={this._onAddItem.bind(this)}>
					<Image
						style={styles.button}
						source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}} />
				</TouchableHighlight>
			);
		}

		return null;
	}

	_renderScene(props) {

    const navigate = this.props.onNavigate;

    var route = props.scene.route;
    if(!route.component ){
      route.component = Potentials
    }
    const RouteComponent = route.component;


    return (
      <View style={{ backgroundColor:colors.outerSpace }} pointerEvents={'box-none'}>
        <RouteComponent
          navigator={{
            push: (route) => {
              const label = route.title || route.name || route.key || route.id
              this.props.dispatch(pushRoute({
          			title:  label,
          			showBackButton: true,
                key: label.trim().toLowerCase(),
                ...route,
    		      },"global"));
            },
            pop: () => {
              this.props.dispatch(popRoute("global"));
            }
          }}
          route={route}

          {...route.passProps}
          user={this.props.user}
        />
      </View>
    );
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		onNavigate: function(action) {
      const r = action.route
      r.key = r.key || r.id || r.title || r.displayName || 'fwdf';
      if(action.type == 'push'){
        dispatch(pushRoute({...action, route: r},'global'))

      }else if(action.type == 'pop'){
        dispatch(popRoute('global'))
      }
		}
	};
}

function mapStateToProps(state,ownProps) {
	return {
		navigation: state.appNav,
    ...ownProps,
    user: state.user,
    profileOpen: state.ui.profileVisible
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalNavigation);

const styles =  StyleSheet.create({
	tabContent: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 0
	}
});
