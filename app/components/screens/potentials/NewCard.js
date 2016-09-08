import React  from 'react'
import { Text, View, Image, TouchableHighlight, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { BlurView } from 'react-native-blur'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors  from '../../../utils/colors'
import UserDetails  from '../../UserDetails'
import ParallaxSwiper  from '../../controls/ParallaxSwiper'
import Swiper  from '../../controls/swiper'
import ApproveIcon  from './ApproveIcon'
import DenyIcon  from './DenyIcon'
import styles  from './styles'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const CardLabel = (props) => (
  <View>
    <Text
      style={[styles.cardBottomText, {color:props.textColor}]}
      key={`${props.potential.user.id}-names`}
    >{ props.matchName }
    </Text>
    <Text
      style={[styles.cardBottomOtherText, {color:props.textColor}]}
      key={`${props.potential.user.id}-matchn`}
    >{
        props.city + props.seperator + (props.distance ? ` ${props.distance} ${props.distance == 1 ? 'mile' : 'miles'} away` : ``)
    }</Text>
  </View>
);


class NewCard extends React.Component {
  constructor(props){
    super()

    this.state ={}
  }
  render(){
    const {profileVisible, cardWidth, cardHeight, city, seperator, potential, activeIndex, user, isTopCard, matchName, distance} = this.props;

    const hasPartner = potential.partner && potential.partner.firstname && potential.partner.image_url && potential.partner.image_url !== "";
    const slideFrames = hasPartner ? [potential.user,potential.partner] : [potential.user]
    const tmpCardHeight = profileVisible ? cardHeight : cardHeight;
    const slides = slideFrames.map((p,i) => {
      return (
        <View
          key={`${p.id}slide${i}`}
          style={{backgroundColor:'transparent',flex:1,position:'relative',height:tmpCardHeight,width:cardWidth}}
        >
          <Image
            source={{uri: p.image_url }}
            resizeMode="cover"
            style={{flex:1,height:tmpCardHeight,width:cardWidth}}
          />
      </View>
      )
    });

    return (
      <View>

        <ParallaxSwiper
          contentContainerStyle={[{minHeight: profileVisible ? DeviceHeight : cardHeight,alignItems:'stretch',justifyContent:'center',flexDirection:'column',flex:1,width:cardWidth}]}
          scrollEnabled={profileVisible ? true : false}
          showsVerticalScrollIndicator={false}
          style={[{
            flex:1,
            height:(DeviceHeight*2),

           }]}
          header={<View/>}
          dispatch={this.props.dispatch}
          windowHeight={10}
          isTopCard={isTopCard}

          pan={this.props.pan}
          swiper={(
            <Swiper
              width={profileVisible ? DeviceWidth: cardWidth }
              pan={this.props.pan}
              isTopCard={isTopCard}
              profileVisible={profileVisible}
              height={DeviceHeight }
              dispatch={this.props.dispatch}
              style={{flex:0,zIndex:0,backgroundColor:'transparent', }}

            scrollEnabled={isTopCard && profileVisible}>
             {slides}
           </Swiper>
          )}
        >
          <BlurView
            key={'blurkey'+potential.user.id}
            blurType="dark"
            style={{
              backgroundColor:colors.outerSpace20,
              position:'relative',
              zIndex:100,
              height: profileVisible ? (this.state.h || DeviceHeight*1.5) : 0,
              opacity: profileVisible ? 1 : 0,
              overflow:'hidden',
              flex:10,
              bottom:0,
              alignSelf:'flex-end',
              width: DeviceWidth,
              top:-260,
            }}
          >
            <View style={{ paddingVertical: 20, width: DeviceWidth,flex: 1,}}>
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

              {potential.bio || potential.user.bio &&
                <Text style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth }}>
                  <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                      !hasPartner ? `About Me` : `About Us`
                  }</Text>
                  <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                      potential.user.bio
                  }</Text>
              </Text>
              }

              {potential.partner.bio &&
                <Text style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth }}>
                  <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                      potential.partner.bio
                  }</Text>
              </Text>
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
                style={{ height: 50, alignItems: 'center', width: 50, justifyContent: 'center',flex:0,alignSelf:'center' }}
                onPress={this.props.closeProfile}
              >
                <Image
                  resizeMode={Image.resizeMode.contain}
                  style={{ height: 12, width: 12, marginTop: 10 }}
                  source={{ uri: 'assets/close@3x.png' }}
                />
              </TouchableOpacity>
            </View>

          </BlurView>

             <TouchableHighlight
              style={{width:cardWidth,
                height: profileVisible ? 0 : 100,
                opacity:profileVisible ? 0 : 1,
                alignSelf:'flex-end',zIndex:10,flex:-1,position:'absolute',bottom:60}}
              underlayColor={colors.mediumPurple20}
              onPress={this.props.openProfileFromImage}
            >
              <View style={{width:cardWidth,height:100,flex:1}}>
                <BlurView key={'blurkey'+potential.user.id}
                  blurType="xlight"
                  style={{backgroundColor:colors.white20,width:cardWidth,height:100,padding:20}}
                >
                  <CardLabel
                    potential={potential}
                    seperator={seperator}
                    matchName={matchName}
                    city={city}
                    distance={distance}
                    textColor={colors.shuttleGray}
                  />
                </BlurView>
              </View>
            </TouchableHighlight>
      </ParallaxSwiper>

                {isTopCard ? <DenyIcon pan={this.props.pan}/> : null }

                {isTopCard ? <ApproveIcon pan={this.props.pan}/> : null }

    </View>
    )
  }
}

export default NewCard;
