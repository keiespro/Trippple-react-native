import React, {
  PixelRatio,
  StatusBarIOS,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Dimensions
} from 'react-native'
import colors from '../utils/colors'
import {BlurView,VibrancyView} from 'react-native-blur'
import SettingsDebug from '../components/SettingsDebug'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'


const NavigationBar = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
  },

  /*
   * If there are no routes in the stack, `hidePrev` isn't provided or false,
   * and we haven't received `onPrev` click handler, return true
   */
  prevButtonShouldBeHidden() {
    const {
      onPrev,
      hidePrev,
      navigator
    } = this.props;

    const getCurrentRoutes = navigator.getCurrentRoutes;

    return (
      hidePrev ||
      (getCurrentRoutes && getCurrentRoutes().length <= 1 && !onPrev)
    );
  },

  /**
   * Describes how we get a left button in the navbar
   */
  getLeftButtonElement() {
    const {
      onPrev,
      navigator,
      route,
      buttonsColor,
      prevRoute,
      hidePrev,
      customPrev,
    } = this.props;

    var el;
    /*
     * If we have a `customPrev` component, then return
     * it's clone with additional attributes
     */
    if (customPrev) {
      el = React.cloneElement(customPrev, { navigator, route });
      return (
        <TouchableOpacity underlayColor={'white'} onPress={() => onPrev( navigator,route )}>
          <View style={[
              (!route || route.title == 'potentials' ? styles.navBarLeftButton : styles.navBarLeftX)
            ]}>
            {el}
          </View>
        </TouchableOpacity>
      )
    }

    /*
     * Check if we need to hide `prev` button
     */
    if (hidePrev) {
      return (
        <View style={styles.navBarLeftButton}/>
      )
    }

       /*
     * Apply custom background styles to button
     */
    const customStyle = buttonsColor ? { color: buttonsColor, } : {};

    /*
     * holds a ref to onPress which either be navigator.pop or a handler
     */
    let onPress = navigator.jumpBack;

    if (onPrev) {
      //we are passing navigator and route to onPrev handler
      onPress = () => onPrev(navigator, route);
    }

    return (
      <TouchableOpacity underlayColor={'white'} onPress={onPress}>
        <View style={styles.navBarLeftButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText, customStyle, ]}> ◀︎ Back </Text>
        </View>
      </TouchableOpacity>
    );
  },

  /*
   * Describe how we get a title for the navbar
   */
  getTitleElement() {
    const {
      title,
      titleColor,
      customTitle,
      navigator,
      route,
    } = this.props;
    var el;

    /*
     * Return `customTitle` component if we have it
     */
    if (customTitle) {
      if(__DEV__){
        let onPress = ()=>{
          navigator.push({
            component: SettingsDebug
          })
        }
        el = React.cloneElement(customTitle, { navigator, route, })
        return (
            <View style={styles.customTitle}>
              <TouchableOpacity underlayColor={'white'} onPress={onPress}>
              {el}
            </TouchableOpacity>
            </View>
        )
      }else{

        el = React.cloneElement(customTitle, { navigator, route, })
        return (
          <View style={styles.customTitle}>
            {el}
          </View>
        )
      }

    }


    const titleStyle = [
      styles.navBarText,
      styles.navBarTitleText,
      { color: titleColor, },
    ];

    if (title && title.length){
      return (
        <View style={styles.customTitle}>
          <Text style={titleStyle}> {this.props.title} </Text>
        </View>
      )
    }




  },

  getRightButtonElement() {
    const {
      onNext,
      nextTitle,
      navigator,
      route,
      hideNext,
      nextRoute,
      buttonsColor,
      customNext,
      unread

    } = this.props;
    var el;

    /*
     * Check if we need to hide `next` button
     */
    if (hideNext) {
      el = <View style={styles.navBarLeftButton}/>;
    }

    /*
     * If we have a `customNext` component, then return
     * it's clone with additional attributes
     */
    if (customNext) {
      el = React.cloneElement(customNext, { navigator, route, unread, onPress: onNext });
    }

    /*
     * If we haven't received `onNext` handler, then just return
     * a placeholder for button to keep markup consistant and
     * title aligned to the center
     */
    if (!onNext) {
      return null
    }

    /*
     * Apply custom background styles to button
     */
    const customStyle = buttonsColor ? { color: buttonsColor, } : {};

    return (
      <TouchableOpacity onPress={() => onNext(navigator,route)}>
        <View style={styles.navBarRightButton}>
          {el}
          {unread ? <View style={styles.unreadDot}/> : null}

        </View>
      </TouchableOpacity>
    );
  },

  render() {
    if (this.props.statusBar === 'lightContent') {
      StatusBarIOS.setStyle('light-content', false);
    } else if (this.props.statusBar === 'default') {
      StatusBarIOS.setStyle('default', false);
    }

    const { style, backgroundStyle, blur, insideStyle } = this.props;
      if(blur){
          return (
            <BlurView blurType={'light'}  style={[styles.navBarContainer, backgroundStyle, ]}>
              <View style={[styles.navBar, {alignSelf:'stretch'}, insideStyle ]}>
                  {this.getTitleElement()}
                {this.getLeftButtonElement()}
                {this.getRightButtonElement()}
              </View>
            </BlurView>
            );
          }else{
            return (
              <View style={[styles.navBarContainer, backgroundStyle, insideStyle ]}>
                <View style={[styles.navBar, {alignSelf:'stretch'}, ]}>
                  {this.getTitleElement()}
                  {this.getLeftButtonElement()}
                  {this.getRightButtonElement()}
                </View>
              </View>
             )
          }
  },
});

export default NavigationBar;

const NAV_BAR_HEIGHT = 54;
const STATUS_BAR_HEIGHT = 0;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
  navBarContainer: {
    width:DeviceWidth,
    height: NAV_HEIGHT,
    backgroundColor: 'transparent',
    paddingBottom: 6,
    position:'absolute',
    top:0,
    left:0,
  },
  navBarContainerBorder:{
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1 / React.PixelRatio.get(),
  },
  navBar: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customTitle: {
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    top:-2,
    left: 0,
    height:54,
    right: 0,
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 0,
    flex: 2,
    paddingTop:15,
    textAlign: 'center',
  },
  navBarTitleText: {
    color: colors.white,
    fontSize: MagicNumbers ? MagicNumbers.size18 : 18,
    fontFamily:'Montserrat-Bold',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
  },
  navBarLeftButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navBarLeftX: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    opacity:0.5,
  },
  navBarRightButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navBarButtonText: {

    color: colors.rollingStone,
  },
  unreadDot:{
    position:'absolute',
    top:8,
    right:18,
    backgroundColor:colors.mediumPurple,
    width:15,
    height:15,
    borderRadius:7.5,
    borderWidth:3,
    borderColor:colors.outerSpace
  }
});
