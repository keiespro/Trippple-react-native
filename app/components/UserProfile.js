
import React, {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicatorIOS,
  ScrollView,
  PixelRatio,
  Dimensions,
  PanResponder,
  Easing
} from 'react-native';

import FakeNavBar from '../controls/FakeNavBar';

import alt from '../flux/alt';
import MatchActions from '../flux/actions/MatchActions';
import UserDetails from '../UserDetails'
import TimerMixin from 'react-timer-mixin';
import colors from '../utils/colors';
import Swiper from '../controls/swiper';

import reactMixin from 'react-mixin';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'


@reactMixin.decorate(TimerMixin)
class UserProfile extends React.Component{

  static defaultProps = {
    cardWidth: DeviceWidth
  }
 constructor(props){
    super()
    this.state = {
      slideIndex: 0
    }
  }


    render(){

      var {  potential, user } = this.props,
      matchName = `${potential.user.firstname.trim()}`,// ${potential.user.age}
          distance = potential.user.distance || 0,
          city = potential.user.city_state || '';
      const rel = this.props.rel || this.props.user.relationship_status;

      if(rel == 'couple') {
        matchName += ` & ${potential.partner.firstname.trim()}`//${potential.partner.age}
      }


    return (
        <View
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={[ styles.card,{
            height:DeviceHeight,
            overflow:'hidden',
            left:0,
            flex:1,
            width:DeviceWidth,

            backgroundColor:colors.outerSpace,
            transform:[ {scale: 1}, ]
          },styles.shadowCard]}>

          <ScrollView
          style={[{
            margin:0,
            width:DeviceWidth,
            height:DeviceHeight,
            padding:0,
            position:'relative',
            flex:1,
          }]}
          canCancelContentTouches={true}
          horizontal={false}
          vertical={true}
          alwaysBounceHorizontal={false}
          scrollEnabled={true}
          contentInset={{top: 55, left: 0, bottom: 0, right: 0}}
          key={`${potential.id || potential.user.id}-view`}>

          <View key={`${potential.id || potential.user.id}bgopacity`} style={{
              position:'relative',
            }} ref={"incard"}>

            {rel == 'couple' ? <Swiper
            _key={`${potential.id || potential.user.id}-swiper`}
            loop={true}
            width={DeviceWidth}
            height={DeviceHeight}
            style={{width:DeviceWidth,overflow: 'hidden',}}
            horizontal={false}
            vertical={true}
            autoplay={false}
            showsPagination={true}
            showsButtons={false}
            paginationStyle={{position:'absolute',right:0,top: 5,height:100}}
            dot={ <View style={styles.dot} /> }
            activeDot={ <View style={styles.activeDot} /> }>

              <Image
                source={{uri: potential.user.image_url}}
                key={`${potential.user.id}-cimg`}

                 defaultSource={{uri:'../../newimg/defaultuser.png'}}
                style={[styles.imagebg,{
                  height: DeviceHeight,
                  marginTop:-20,
                  width:this.props.cardWidth,

                  }]}
                  />

            {rel == 'couple' && potential.partner &&
              <Image
                resizeMode={Image.resizeMode.cover}
                source={{uri: potential.partner.image_url}}
                key={`${potential.partner.id}-cimg`}
                defaultSource={{uri:'../../newimg/defaultuser.png'}}
                style={[styles.imagebg,{
                  height:DeviceHeight,
                  marginTop:-20,
                  width:this.props.cardWidth,
                }]}
                />
            }
            </Swiper> :
            <Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg, {
                      flex:1,
                      alignSelf:'stretch',
                      height:DeviceHeight,
                      width: DeviceWidth,
                    }]}
                    resizeMode={Image.resizeMode.cover}
                   />
              }

            <View
            key={`${potential.id || potential.user.id}-bottomview`}
            style={{
              height: 600,
              backgroundColor:colors.outerSpace,
              flex:1,
              alignSelf:'stretch',
              width:DeviceWidth,
              top:-250,
              alignItems:'stretch',
              left:0,
              right:0,

            }} >

            <View style={{ width: MagicNumbers.screenWidth , paddingVertical:20,marginLeft:MagicNumbers.screenPadding/2, }}>
              <Text style={[styles.cardBottomText,{color:colors.white,marginLeft:0,width:MagicNumbers.screenWidth}]}>
              {
                matchName
              }
              </Text>
              <Text style={[styles.cardBottomOtherText,{color:colors.white,marginLeft:0,width:MagicNumbers.screenWidth}]}>
              {
                distance ? `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away` : null
              }
              </Text>
            </View>

          {rel == 'couple' &&
            <View style={{
              height:60,
              top:-30,
              position:'absolute',
              width:135,
              right:0,
              backgroundColor:'transparent',
              flexDirection:'row'}}>
                <Image
                  source={{uri: potential.user.image_url}}
                  key={potential.user.id + 'img'}
                  style={[styles.circleimage, {marginRight:5,borderColor:colors.outerSpace}]}
                />
                <Image
                  source={{uri: potential.partner.image_url}}
                  key={potential.partner.id + 'img'}
                  style={[styles.circleimage,{borderColor:colors.outerSpace}]}
                />
              </View>
            }

            <View style={{width: MagicNumbers.screenWidth,
              paddingHorizontal:MagicNumbers.screenPadding/2
            }}>


            {potential.bio || potential.user.bio ?
              <View style={{padding:0,margin:0,alignSelf:'flex-start'}}>
                <Text style={[styles.cardBottomOtherText,{color:colors.white,marginBottom:15,marginLeft:0}]}>{
                    rel =='single' ? `About Me` : `About Us`
                }</Text>
                <Text style={{color:colors.white,fontSize:18,marginBottom:15}}>{
                    potential.bio || potential.user.bio
                }</Text>
              </View> : null}
              </View>
              <View style={{ paddingVertical:20,alignItems:'stretch' }}>
                <UserDetails potential={potential} user={this.props.user} location={'card'} />
              </View>

              <View style={{flex:1,marginTop:20}}>
                <Text style={{color:colors.mandy,textAlign:'center'}}>Report or Block this user</Text>
              </View>


          </View>

          </View>
        </ScrollView>
        <FakeNavBar
          hideNext={true}
          backgroundStyle={{backgroundColor:colors.outerSpace}}
          titleColor={colors.white}
          title={ matchName}
          titleColor={colors.white}
          onPrev={(nav,route)=> {this.props.navigator.pop()}}
          customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12,marginTop:10}} source={require('../../newimg/close.png')} />
          }
        />
      </View>

    )
    }
}
export default UserProfile

var CustomTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.object,
    tabs: React.PropTypes.array,
    pageNumber:React.PropTypes.number

  },

  renderTabOption(name, page) {
    var isTabActive = this.props.pageNumber === page;
    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{
              fontFamily:'Montserrat',fontSize:16,
              color: isTabActive ? colors.white : colors.shuttleGray}}>{name.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  },



  render() {
    var numberOfTabs = this.props.tabs.length;
    var w = MagicNumbers.screenWidth / numberOfTabs;

    var tabUnderlineStyle = {
      position: 'absolute',
      width: MagicNumbers.screenWidth / 2,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left:0,
      transform:[
        {translateX: this.props.activeTab ? this.props.activeTab.interpolate({
                inputRange: this.props.tabs.map((c,i) => (w * i) ),
                outputRange: [0,w]
              }) : 0
            }]
    };

    return (
      <View style={[styles.tabs,{marginHorizontal:MagicNumbers.screenPadding/2}]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={'TAB_UNDERLINE_REF'} />
      </View>
    );
  },
});


const styles = StyleSheet.create({

shadowCard:{
  shadowColor:colors.darkShadow,
  shadowRadius:5,
  shadowOpacity:50,
  shadowOffset: {
    width:0,
    height: 5
  }
},
tab: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  width:DeviceWidth,

},
singleTab:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: MagicNumbers.screenPadding/2,
  width:MagicNumbers.screenWidth,

},
tabs: {
  height: 60,
  flexDirection: 'row',
  marginTop: 0,
  borderWidth: 1,
  width:DeviceWidth,
  flex:1,
  marginHorizontal:0,
  borderTopWidth: 1,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth:1,
  overflow:'hidden',
  justifyContent:'center',
  alignItems:'center',
  borderColor: colors.shuttleGray,
},
animatedIcon:{
  height:60,
  width:60,
  borderRadius:30,
  alignItems:'center',
  justifyContent:'center',
  top:DeviceHeight/2 - 80,
  left:DeviceWidth/2 - 50,
  position:'absolute',
  // shadowColor:colors.darkShadow,
  backgroundColor:'transparent',
  // shadowRadius:5,
  // shadowOpacity:50,
  overflow:'hidden',
  // shadowOffset: {
  //   width:0,
  //   height: 5
  // }
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow:'hidden',
    top:50
  },
  absoluteText:{
    position:'absolute',
    color:'#ffffff',
    backgroundColor:'transparent',
    fontSize:20
  },
  absoluteTextTop:{
    top:0
  },
  absoluteTextBottom:{
    bottom:0
  },
  basicCard:{
    borderRadius:8,
    backgroundColor: 'transparent',
      borderWidth: 1 / PixelRatio.get(),
      borderColor:'rgba(0,0,0,.2)',
      overflow:'hidden',

    },
    bottomButtons: {
      height: 80,
      alignItems: 'center',
      flexDirection: 'row',
      top:-40,
      justifyContent:'space-around',
      alignSelf:'stretch',
      width: undefined
    },
    topButton: {
      height: 80,
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 0,
      borderRadius: 0,
      marginBottom: 0,
      marginTop: 0,
      alignSelf: 'stretch',
      alignItems:'center',
      justifyContent: 'center'
    },
  card: {
    borderRadius:8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor:'rgba(0,0,0,.2)',
    overflow:'hidden'

  },

  closeProfile:{
    position:'absolute',
    top:10,
    left:5,
    width: 50,

    backgroundColor:'transparent',

    height: 50,
    alignSelf:'center',

    overflow:'hidden',

    justifyContent:'center',
    alignItems:'center',
    padding:20,
    borderRadius:25
  },
  dashedBorderImage:{
    marginHorizontal:0,
    marginTop:65,
    marginBottom:20,
    padding:0,
    width:DeviceWidth,
    height:DeviceHeight-100,
    flex:1,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
     padding:0,
    alignItems:'stretch',
    flexDirection:'column',
    width:DeviceWidth,
    height:DeviceHeight,

  },

  dot: {
    backgroundColor: 'transparent',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: colors.mediumPurple20,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  wrapper:{

  },
  scrollSection:{
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    padding:0,
    margin:0,
    alignItems: 'center',
    flexDirection: 'column'
  },
  circleimage:{
    backgroundColor: colors.shuttleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor:colors.white,
    borderWidth: 3
  },
  cardStackContainer:{
    width:DeviceWidth,
    height:DeviceHeight,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    backgroundColor:'transparent'
  },

  cardBottomText:{
    marginLeft:20,
    fontFamily:'Montserrat-Bold',
    color: colors.shuttleGray,
    fontSize:18,
    marginTop:0
  },
  cardBottomOtherText:{
    marginLeft:20,
    fontFamily:'omnes',
    color: colors.rollingStone,
    fontSize:16,
    marginTop:0,
    opacity:0.5
  }
});

var animations = {
  layout: {
    spring: {
      duration: 250,
      create: {
        duration: 250,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0,
      },
      update: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0,
        property: LayoutAnimation.Properties.scaleXY
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY

      },
      update: {

        duration: 2000,
        // property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut,

      }
    }
  }
}
