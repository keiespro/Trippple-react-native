import React from 'react'
import { Text, View, Image, TouchableHighlight,Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { BlurView,VibrancyView } from 'react-native-blur'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import ParallaxSwiper from '../../controls/ParallaxSwiper'
import styles from './styles'
import XButton from '../../buttons/XButton'
import {pure} from 'recompose'
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)
import ActionMan from '../../../actions'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const CardLabel = ({potential,city,textColor,matchName}) => (
  <View>
    <Text
        style={[styles.cardBottomText, {color:textColor}]}
        key={`${potential.user.id}-names`}
    >{ matchName }</Text>
    <Text
        style={[styles.cardBottomOtherText, {color:textColor}]}
        key={`${potential.user.id}-matchn`}
    >{city}</Text>
  </View>
);


class NewCard extends React.Component {

    constructor(props){
        super()
        this.state = {
            isOpen: new Animated.Value(100),
        }
    }

    componentWillReceiveProps(nProps){
        if(this.props.profileVisible != nProps.profileVisible){
            Animated.spring(this.state.isOpen, {
                toValue: nProps.profileVisible ? 0 : 100
            }).start()
        }
    }

    reportModal(){
        const {potential} = this.props;

        this.props.dispatch(ActionMan.showInModal({
            component: 'ReportModal',
            passProps: {
                action: 'report',
                potential
            }
        }))
    }
    closeProfile() {
        this.props.dispatch({ type: 'CLOSE_PROFILE' });
    }
    openProfile() {
        this.props.dispatch({ type: 'OPEN_PROFILE' });
    }

    onLayout(e){
        const {layout} = e.nativeEvent

        if(!this.state.contentHeight){
            this.handleSize(layout.height + 1000)

        }
    }
    handleSize(contentHeight){
        this.setState({contentHeight})
    }
    render(){

        const {profileVisible, cardWidth, cardHeight, city, seperator, potential, activeIndex, user, isTopCard, matchName, distance} = this.props;

        const hasPartner = potential.partner && potential.partner.gender ? true : false;

        const slideFrames = hasPartner ? [potential.user,potential.partner] : [potential.user];

        const tmpCardHeight = profileVisible ? cardHeight : cardHeight;


        const anistyle = [{
            flex:1,
            top:0,
            overflow: this.props.profileVisible ? 'visible' : 'hidden',
            transform: [{
                scale: this.state.isOpen.interpolate({
                    inputRange: [ 0,100],
                    outputRange: [1,1],
                    extrapolate: 'clamp',

                })
            }],
            width: this.state.isOpen.interpolate({
                inputRange: [ 0,100],
                outputRange: [DeviceWidth,DeviceWidth-40],
                extrapolate: 'clamp',

            }),
            height: this.state.isOpen.interpolate({
                inputRange: [ 0,100],
                outputRange: [DeviceHeight,DeviceHeight-75],
                extrapolate: 'clamp',

            })
        }];
        const aniblurstyle = [ {
            backgroundColor:colors.outerSpace50,
            width:DeviceWidth,
            paddingbottom:120,
            flex:10,
            flexGrow:10,
            height:this.props.profileVisible ? this.state.contentHeight : 0,
            top:this.props.profileVisible ? -130 : DeviceHeight+300,
            position:'relative',
            alignSelf:'flex-end',
            overflow:'hidden',


        }]

        return (
          <Animated.View
              key={'topkey'+potential.user.id}
              style={anistyle}
              onLayout={this.onLayout.bind(this)}
          >
            
            <ParallaxSwiper
                contentContainerStyle={[{
                    minHeight: this.props.profileVisible ? DeviceHeight : cardHeight,
                    alignItems:'center',
                    justifyContent:'center',
                    flexDirection:'column',
                    flex:1,
                }]}
                slideFrames={slideFrames}
                scrollEnabled={profileVisible ? true : false}
                showsVerticalScrollIndicator={false}
                style={[{
                    flex:1,
                    position:'relative',
                    top:0,
                    width:cardWidth,
                }]}
                header={<View/>}
                dispatch={this.props.dispatch}
                windowHeight={0}
                width={cardWidth}
                isTopCard={isTopCard}
                pan={this.props.pan}
                profileVisible={profileVisible}
                killProfile={this.closeProfile.bind(this)}
            >
            <AnimatedBlurView
                blurType="dark"
                style={aniblurstyle}
            >

            {profileVisible && <View style={{marginVertical:8,
                  width:40,height:8,borderRadius:15,alignSelf:'center',
                  backgroundColor:'rgba(255,255,255,.2)',
                  position:'absolute',top:0,left:DeviceWidth/2-20
              }}/>}
                  <View
                      key={'blurkey'+potential.user.id}
                      style={{
                          zIndex:100,
                          height: profileVisible ? this.state.contentHeight : 0,
                          opacity: profileVisible ? 1 : 0,
                          flex:10,
                      }}
                  >


                      <View style={{ paddingVertical: 40, width: DeviceWidth,flex: 10,marginTop:0}}>


                          <View style={{marginHorizontal:MagicNumbers.screenPadding/2,marginBottom:20}}>
                              <CardLabel
                                  potential={potential}
                                  seperator={seperator}
                                  matchName={matchName}
                                  city={city}
                                  distance={distance}
                                  textColor={colors.white}
                              />
                          </View>

                          {potential.user.bio && potential.user.bio.length ?
                              <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth,flexDirection:'column' }}>
                                  <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                                      !hasPartner ? `Looking for` : `Looking for`
                                  }</Text>
                                  <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                                      potential.user.bio
                                  }</Text>
                              </View> : null
                          }

                          {hasPartner && potential.partner.bio && potential.partner.bio.length ?
                              <View
                                  style={{
                                      margin: MagicNumbers.screenPadding / 2,
                                      width: MagicNumbers.screenWidth
                                  }}
                              >
                                  <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>
                                    {potential.partner.bio}
                                  </Text>
                              </View> : null
                          }

                          <UserDetails
                              potential={potential}
                              user={this.props.user}
                              location={'card'}
                          />
                          <TouchableOpacity onPress={this.reportModal.bind(this)}>
                              <View style={{ marginTop: 20, paddingBottom: 50 }}>
                                  <Text style={{ color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
                              </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                              style={{
                                  height: 50,zIndex:9999, alignItems: 'center', width: 50, justifyContent: 'center',flex:0,alignSelf:'center',
                              }}
                              onPress={this.props.closeProfile}
                          >
                              <Image
                                  resizeMode={Image.resizeMode.contain}
                                  style={{ height: 12, width: 12, marginTop: 10 }}
                                  source={{ uri: 'assets/close@3x.png' }}
                              />
                          </TouchableOpacity>
                  </View>

                  </View>

                  </AnimatedBlurView>

              </ParallaxSwiper>

    <TouchableHighlight
        style={{
            width:cardWidth,
            height: 100,
            opacity:profileVisible ? 0 : 1,
            width:DeviceWidth,
            alignSelf:'flex-end',
            zIndex:1000,
            flex:-1,
            position:'absolute',
            bottom: profileVisible ? -230 : 0
        }}
        underlayColor={colors.mediumPurple20}
        onPress={this.openProfile.bind(this)}
    >
                      <View
                          key={'blurkeyi'+potential.user.id}
                          style={{
                              backgroundColor:colors.white,width:cardWidth,height:100,position:'absolute',left:0,padding:20
                          }}
                      >
                          <CardLabel
                              potential={potential}
                              seperator={seperator}
                              matchName={matchName}
                              city={city}
                              distance={distance}
                              textColor={colors.shuttleGray}
                          />
                      </View>
                  </TouchableHighlight>

          </Animated.View>
    )
    }
}

export default NewCard;
