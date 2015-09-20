const React = require('react-native');
const {
  PixelRatio,
  StatusBarIOS,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} = React;
import colors from '../utils/colors'
import {BlurView,VibrancyView} from 'react-native-blur'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

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
        <TouchableOpacity onPress={() => onPrev( navigator,route )}>
          <View style={styles.navBarLeftButton}>
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
        <View style={styles.navBarLeftButton}></View>
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
      <TouchableOpacity onPress={onPress}>
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
      el = React.cloneElement(customTitle, { navigator, route, })
      return (
        <View style={styles.customTitle}>
          {el}
        </View>
      )
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
      customNext
    } = this.props;
    var el;

    /*
     * Check if we need to hide `next` button
     */
    if (hideNext) {
      el = <View style={styles.navBarLeftButton}></View>;
    }

    /*
     * If we have a `customNext` component, then return
     * it's clone with additional attributes
     */
    if (customNext) {
      el = React.cloneElement(customNext, { navigator, route, onPress: onNext });
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

    const { style, backgroundStyle, blur } = this.props;
      if(blur){
          return (
            <BlurView blurType={'light'}  style={[styles.navBarContainer, backgroundStyle, ]}>
              <View style={[styles.navBar, {alignSelf:'stretch'}, ]}>
                  {this.getTitleElement()}
                {this.getLeftButtonElement()}
                {this.getRightButtonElement()}
              </View>
            </BlurView>
            );
          }else{
            return (
              <View style={[styles.navBarContainer, backgroundStyle, ]}>
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

module.exports = NavigationBar;

const NAV_BAR_HEIGHT = 54;
const STATUS_BAR_HEIGHT = 0;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
  navBarContainer: {
    width:DeviceWidth,
    height: NAV_HEIGHT,
    backgroundColor: 'transparent',
    paddingBottom: 5,
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
    position: 'absolute',
    alignItems: 'center',
    bottom: 4,
    left: 0,
    right: 0,
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
    flex: 2,
    textAlign: 'center',
  },
  navBarTitleText: {
    color: colors.white,
    fontSize:22,
    fontFamily:'Montserrat-Bold',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
  },
  navBarLeftButton: {
    paddingLeft: 20,
    marginVertical: 15,
  },
  navBarRightButton: {
    marginVertical: 15,
    paddingRight: 20,
  },
  navBarButtonText: {
    color: colors.rollingStone,
  },
});