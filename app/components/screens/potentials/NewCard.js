import React from 'react'
import { Text, View, Image, TouchableHighlight,Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { BlurView,VibrancyView } from 'react-native-blur'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import ParallaxSwiper from '../../controls/ParallaxSwiper'
import Swiper from '../../controls/swiper'
import styles from './styles'
import {pure} from 'recompose'

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


@pure
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

        this.props.dispatch(ActionMan.showInModal({
            component: 'ReportModal',
            passProps: {
                action: 'report',
                them: [this.props.potential.user, this.props.potential.partner],
            }
        }))


    }
    onLayout(e){
        const {layout} = e.nativeEvent

        if(!this.state.contentHeight){
            this.handleSize(layout.height)

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

        const slides = slideFrames.map((p,i) => {

            let {image_url} = p;
            if(!image_url || image_url.length == 0) image_url = null;

            return (
          <Image
              source={{uri: image_url || 'assets/defaultuser.png' }}
              key={`${p.id}slide${i}`}
              resizeMode="cover"
              style={{flex:10,
              alignItems:'center',
              justifyContent:'center',
              flexDirection:'column',
              backgroundColor:colors.darkPurple,
              marginLeft:profileVisible ? 0 : -40
            }}
          />
        )
        });

        return (
          <Animated.View
              key={'topkey'+potential.user.id}
              style={[{
                  flex:1,
                  overflow: this.props.profileVisible ? 'visible' : 'hidden',
                  transform: [{
                      scale: this.state.isOpen.interpolate({
                          inputRange: [ 0,100],
                          outputRange: [1,1]
                      })
                  }],
                  width: this.state.isOpen.interpolate({
                      inputRange: [ 0,250],
                      outputRange: [DeviceWidth,DeviceWidth-40]
                  }),
                  height: this.state.isOpen.interpolate({
                      inputRange: [ 0,200],
                      outputRange: [DeviceHeight,DeviceHeight-75]
                  })
              }]}
          >
            <ParallaxSwiper
                contentContainerStyle={[{
                    minHeight: profileVisible ? DeviceHeight : cardHeight,
                    alignItems:'center',
                    justifyContent:'center',
                    flexDirection:'column',
                    flex:1,
                }]}

                scrollEnabled={profileVisible ? true : false}
                showsVerticalScrollIndicator={false}
                style={[{
                    flex:1,
                    height:this.state.contentHeight+160,
                    width:cardWidth,
                }]}
                header={<View/>}
                dispatch={this.props.dispatch}
                windowHeight={10}
                isTopCard={isTopCard}
                pan={this.props.pan}
                killProfile={this.props.closeProfile}
                onLayout={this.onLayout.bind(this)}
                swiper={(
                      <Swiper
                          width={cardWidth }
                          pan={this.props.pan}
                          isTopCard={isTopCard}
                          profileVisible={profileVisible}
                          height={DeviceHeight }
                          dispatch={this.props.dispatch}
                          style={{flex:10,zIndex:0,backgroundColor:'transparent', }}
                          scrollEnabled={profileVisible}
                      >
                          {slides}
                      </Swiper>
                  )}
            >
            <TouchableHighlight
                style={{width:cardWidth,
                    position:'relative',
                    top:-200,
                    height: profileVisible ? 0 : 100,
                    opacity:profileVisible ? 0 : 1,
                    width:DeviceWidth,
                    alignSelf:'flex-end',zIndex:1000,flex:-1,position:'absolute',bottom:60
                }}
                underlayColor={colors.mediumPurple20}
                onPress={this.props.openProfileFromImage}
            >
                <View style={{width:cardWidth,height:100,flex:1}}>
                    <VibrancyView style={{flex:10,width:cardWidth,height:100,position:'absolute',left:0,zIndex:0}} blurType="xlight" />
                    <View
                        key={'blurkeyi'+potential.user.id}
                        style={{backgroundColor:colors.white20,width:cardWidth,height:100,position:'absolute',left:0,padding:20}}
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
                </View>
            </TouchableHighlight>

                  <View
                      key={'blurkey'+potential.user.id}
                      style={{
                          zIndex:100,
                          height: profileVisible ? this.state.contentHeight : 0,
                          opacity: profileVisible ? 1 : 0,
                          flex:10,
                          alignSelf:'flex-end',
                          overflow:'visible',
                          backgroundColor:'red'
                      }}
                  >


                      <View style={{ paddingVertical: 20, width: DeviceWidth,flex: 10,}}>

      <BlurView blurType="dark" style={{position:'absolute',left:0,width:DeviceWidth,height:this.state.contentHeight,bottom:-200}}/>
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

                          {potential.user.bio &&
                              <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth,flexDirection:'column' }}>
                                  <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                                      !hasPartner ? `Looking for` : `Looking for`
                                  }</Text>
                                  <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                                      potential.user.bio
                                  }</Text>
                              </View>
                          }

                          {hasPartner && potential.partner.bio &&
                              <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth }}>
                                  <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                                      potential.partner.bio
                                  }</Text>
                              </View>
                          }

                          <UserDetails
                              potential={potential}
                              user={this.props.user}
                              location={'card'}
                          />

                          <TouchableOpacity onPress={this.props.reportModal}>
                              <View style={{ marginTop: 20, paddingBottom: 50 }}>
                                  <Text style={{ color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
                              </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                              style={{
                                  height: 50, alignItems: 'center', width: 50, justifyContent: 'center',flex:0,alignSelf:'center'
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


              </ParallaxSwiper>
          </Animated.View>
    )
    }
}

export default NewCard;
