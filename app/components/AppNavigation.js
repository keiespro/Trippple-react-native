import {
  View,
  NavigationExperimental,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Easing
} from 'react-native';
import { actions } from 'react-native-navigation-redux-helpers';
import { connect } from 'react-redux';
import React, {Component} from 'react';

import Matches from './screens/matches/matches';
import Potentials from './screens/potentials/potentials';
import Settings from './screens/settings/settings';

import colors from '../utils/colors'
const {
  popRoute,
  pushRoute,
  jumpTo
} = actions;


const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack,
  Transitioner: NavigationTransitioner,
  Card: NavigationCard,
} = NavigationExperimental;

const {
  PagerPanResponder: NavigationPagerPanResponder,
  PagerStyleInterpolator: NavigationPagerStyleInterpolator,
} = NavigationCard;

class GlobalNavigation extends Component {
	constructor(props) {
		super(props);

	}

  _handleAction (action) {
    // this.props.dispatch(action)
    if(action.type == 'pop'){
      this.props.dispatch(popRoute("global"));
    }else if(action.type == 'push'){
      this.props.dispatch(pushRoute(action.route,"global"));

    }
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
      <NavigationTransitioner
        onNavigate={this._handleAction.bind(this)}
        style={{backgroundColor:colors.outerSpace}}
        onNavigateBack={this.handleBackAction.bind(this)}
        navigationState={this.props.navigation}
        renderHeader={this._renderHeader.bind(this)}
        gestureResponseDistance={20}

        render={ this._render.bind(this)}
        configureTransition={this._configureTransition.bind(this)}
      />
    );
  }

  _render( transitionProps) {
    // console.log('transitionProps',transitionProps);
    return transitionProps.scenes.map((scene) => {
      const sceneProps = {
        ...transitionProps,
        scene,
        gestureResponseDistance: 20,
      };
      return this._renderScene(sceneProps);
    });
  }

  _configureTransition() {
    const easing = Easing.inOut(Easing.ease);
    return {
      duration: 500,
      easing,
    };
  }

  _renderHeader(props) {
    const showHeader = props.scene.index == 0 ? !this.props.profileOpen : true;
    const label = props.scene.route.key || props.scene.route.title || props.scene.route.name || props.scene.route.id ||  '';
    // console.log('show header?',showHeader,label);
    if (showHeader) {
      return ( label.toLowerCase() == 'potentials' || label == 'p' || label == 'leftb') ? (
        <NavigationHeader
          style={{backgroundColor:colors.outerSpace,zIndex:10,flexDirection:'row',height:60, alignItems:'center',justifyContent:'flex-start',}}
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
                style={{height:60,backgroundColor: (props.scene.route.noHeader ? colors.outerSpace : colors.shuttleGray)}}
                {...props}
                renderTitleComponent={this._renderTitleComponent.bind(this)}
                renderLeftComponent={this._renderLeftComponent.bind(this)}
                renderRightComponent={this._renderRightComponent.bind(this)}
              />
            );
    }else{
      return <View/>

    }

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
  }

  _renderRightComponent(props) {
    return <View/>;
  }

	_renderScene(props) {

    const k = props.scene && props.scene.key || 'l';
    return (
      <NavScene header={this._renderHeader.bind(this,props)} navigate={this._handleAction.bind(this)} key={k} {...props} {...this.props} />
    )
	}
}

class NavScene extends React.Component{


  _getAnimatedStyle(sceneStyles={}) {
    const {
      layout,
      position,
      scene,
    } = this.props;

    const {
      index,
    } = scene;

    console.log(layout,position);

    const inputRange = [index - 1, index, index ];
    const width = layout.initWidth;
    const translateX = position.interpolate({
      inputRange,
      outputRange: ([width, 0, 0]),
    });

    return {
      transform: [
        { translateX },
      ],
    };
  }

  render(){

    const navigate = this.props.navigate;

    var route = this.props.scene.route;
    if(!route.component ){
      route.component = Potentials
    }
    console.log(NavigationPagerStyleInterpolator);
    const {dispatch} = this.props;
    const RI = route.index;
    // console.log(RI);
    const RouteComponent = route.component;
    const label = route.title || route.name || route.key || route.id || '';

         const panHandlers = (RI == 0 ? {} : NavigationPagerPanResponder.forHorizontal({
          ...this.props,
          gestureResponseDistance: 20,
          onNavigateBack: () => dispatch(popRoute("global")),
          onNavigateForward: this.props.navigate.bind(this,'')
        }));

        const style = [
          styles.scene,
          this._getAnimatedStyle(route.sceneStyles || {}),
          {backgroundColor: route.color || colors.shuttleGray},
//           NavigationPagerStyleInterpolator.forHorizontal(this.props),
        ];
    return (
      <Animated.View
        { ...panHandlers}
      style={[style]}>
      {this.props.header()}
        <View style={{ backgroundColor:colors.outerSpace,paddingTop:0 }} pointerEvents={'box-none'}>
          <RouteComponent
            navigator={{
              push: (route) => {
                const label = route.title || route.name || route.key || route.id
                dispatch(pushRoute({
            			title:  label,
            			showBackButton: true,
                  key: label.trim().toLowerCase(),
                  ...route,
      		      },"global"));
              },
              pop: () => {
                dispatch(popRoute("global"));
              }
            }}
            route={route}

            {...route.passProps}
          {...this.props}
          />
        </View>
      </Animated.View>
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
	},
  scene: {
    backgroundColor: 'red',
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    top: 0
  },
});
