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



class NavHead extends NavigationHeader{


  render(){
    return (
      <Animated.View >
        {super.render()}
      </Animated.View>
    )
  }
}


class DefaultNavigationHeader extends Component {
	constructor(props) {
		super(props);

	}
  leftBtn(){
    return (
      <TouchableOpacity onPress={()=>{
        const route =  {
          component: Settings,
          config:{
            noHeader:true,
            inside:'pushFromBottom'
          },
          name:'SETTINGS',
          key:'leftbtn',
         }
        this.props.handleAction({route, type:'push'})
      }}>
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{width:28,top:0,height:30,marginLeft:15,tintColor: __DEV__ ? colors.daisy : colors.white}}
          source={{uri:'assets/gear@3x.png'}}
        />
      </TouchableOpacity>
    )
  }
  rightBtn(){
    return (
      <TouchableOpacity onPress={()=>{
        const route =  {
          component:Matches,
          key:'rbtnMatches',
          config:{
            inside:'pushFromRight'
          },
        }
        this.props.handleAction({route, type:'push'})
      }}>
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{opacity:1,width:30,marginRight:15,top:0,height:30,alignSelf:'flex-end',tintColor: __DEV__ ? colors.daisy : colors.white}}
          source={{uri:'assets/chat@3x.png'}}
        />
      </TouchableOpacity>
    )
  }
  title(){
    return (
      <View><Image
        resizeMode={Image.resizeMode.contain}
        style={{width:80,height:30,tintColor: __DEV__ ? colors.daisy : colors.white,alignSelf:'center'}}
        source={{uri:'assets/tripppleLogoText@3x.png'}}
      /></View>
    )
  }
  render(){
    return(
      <NavigationHeader
        style={{backgroundColor:colors.outerSpace,flexDirection:'row',height:60, alignItems:'center',justifyContent:'flex-start',zIndex:100}}
        {...this.props}
        renderTitleComponent={this.title.bind(this)}
        renderLeftComponent={this.leftBtn.bind(this)}
        renderRightComponent={this.rightBtn.bind(this)}
        key={'navhead'}

      />

    )
  }
}


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
        onNavigateBack={this.handleBackAction.bind(this)}
        navigationState={this.props.navigation}
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
    console.log(props.scene,props.scene.route);
    const config = props.scene.route || {}
    const showHeader = !config.noHeader || (props.scene.index == 0 ? !this.props.profileOpen : true);
    const label = `${props.scene.route.name || props.scene.key}`;
    console.log('show header?',showHeader,label);
    if (showHeader) {
      return ( label && label == 'scene_p' ) ? <DefaultNavigationHeader
      {...props} key={'navhead'} handleAction={this._handleAction.bind(this)} /> : (
        <NavigationHeader
        {...props}
        style={{backgroundColor:(config.bg ? 'transparent' : colors.shuttleGray),flexDirection:'row',height:60, alignItems:'center',justifyContent:'flex-start',zIndex:100}}
          renderTitleComponent={this._renderTitleComponent.bind(this)}
          renderLeftComponent={this._renderLeftComponent.bind(this)}
          renderRightComponent={this._renderRightComponent.bind(this)}
          key={'navhead'}
        />
      )
    }else{
      return <View/>

    }

  }

  _renderTitleComponent(props) {
    const title = props.scene.route.name
    return (
      <NavigationHeader.Title textStyle={{color:'#fff',fontFamily:'Montserrat-Bold',fontSize:20}}>
        {`${title || ''}`}
      </NavigationHeader.Title>
    );
  }

  _renderLeftComponent(props) {
    const { dispatch, navigation } = this.props;

    // if (props.scene.route.showBackButton) {
      return (
        <TouchableOpacity

          style={[styles.buttonContainer,{padding:10}]}
          onPress={()=>dispatch(popRoute('global'))}>
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
      <View key={k}  style={[{flex:1, ...StyleSheet.absoluteFillObject}]}>
        {this._renderHeader(props)}

        <NavScene {...this.props} navigate={this._handleAction.bind(this)} key={k} {...props}   />

      </View>
    )
	}
}

class NavScene extends React.Component{


  _getAnimatedStyle(config={}) {
    const {
      layout,
      position,
      scene,
    } = this.props;

    const {
      index,
    } = scene;

    const width = layout.initWidth;
    const height = layout.initHeight;
    const inside = `${config.inside}`;
    const transform = [];
    if(inside.toLowerCase().indexOf('right') > -1){
      transform.push({
        translateX: position.interpolate({
          inputRange: [index - 1, index, index ],
          outputRange: ([width, 0, 0]),
        })
      });
    }else if(inside.toLowerCase().indexOf('bottom') > -1){
      transform.push({
        translateY: position.interpolate({
          inputRange: [index - 1, index, index ],
          outputRange: ([height, 0, 0]),
        })
      });
    }
    return {
      transform,
    };
  }

  render(){

    const navigate = this.props.navigate;

    var route = this.props.scene.route;
    if(!route.component ){
      route.component = View;
      route.key = 'scene_p';
    }

    const {dispatch} = this.props;
    const RI = route.index;

    const RouteComponent = route.component;
    const label = `${route.name || route.key }`;

         const panHandlers = (RI == 0 ? {} : NavigationPagerPanResponder.forHorizontal({
          ...this.props,
          gestureResponseDistance: 20,
          onNavigateBack: () => dispatch(popRoute("global")),
          onNavigateForward: this.props.navigate.bind(this,'')
        }));

        const style = [
          styles.scene,
          this._getAnimatedStyle(route.config || {}),
          {backgroundColor: route.color || colors.transparent,
          top:30}
//           NavigationPagerStyleInterpolator.forHorizontal(this.props),
        ];
    return (

      <Animated.View
      style={[style]}>

          <RouteComponent
            navigator={{
              push: (route) => {
                const label = `${route.name || route.key }`;
                dispatch(pushRoute({
            			title:  label,
            			showBackButton: true,
                  key: label.toLowerCase(),
                  ...route,
      		      },"global"));
              },
              pop: () => {
                dispatch(popRoute("global"));
              }
            }}
            route={route}

            {...route.passProps}
          />
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
    backgroundColor: 'transparent',
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
