
import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  Image,
  Animated,
  ScrollView,
  PanResponder
} from 'react-native';

import alt from '../flux/alt';
import MatchActions from '../flux/actions/MatchActions';
import ParallaxView from  '../controls/ParallaxScrollView'
import ParallaxSwiper from  '../controls/ParallaxSwiper'
import Mixpanel from '../utils/mixpanel';
import AltContainer from 'alt/AltNativeContainer';
import TimerMixin from 'react-timer-mixin';
import colors from '../utils/colors';
import Swiper from 'react-native-swiper';

import reactMixin from 'react-mixin';
import Dimensions from 'Dimensions';
import {BlurView,VibrancyView} from 'react-native-blur'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const THROW_OUT_THRESHOLD = 225;


@reactMixin.decorate(TimerMixin)
class UserProfile extends Component{

 constructor(props){
    super()
    this.state = {
      slideIndex: 0
    }
    console.log(props)
  }


    render(){

    var theirIds = Object.keys(this.props.match.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> this.props.match.users[id])

    var img_url = them[0].image_url
    var matchName = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },"")


      return (
      <View ref={'cardinside'} key={`${this.props.match.match_id}-inside`} style={ [styles.card, styles.shadowCard]}>

          <View style={[{
              margin:0,
              width:DeviceWidth,
height:DeviceHeight,

              padding:0,
              position:'relative'
             }]} key={`${this.props.match.match_id}-view`}>


          <ParallaxSwiper
            showsVerticalScrollIndicator={false}
            windowHeight={500}



            navigator={this.props.navigator}
            style={[{backgroundColor:'transparent',paddingTop:0, },{flex:1,width:DeviceWidth, height:DeviceHeight,top:0,position:'absolute' }]}
            swiper={<Swiper
              onMomentumScrollEnd={ (e, state, context) => {
                this.setState({slideIndex: state.index})
              }}

                index={this.state.slideIndex || 0}
                _key={`${this.props.match.match_id}-swiper`}
                loop={true}
                horizontal={false}

                vertical={true}
                showsPagination={true}
                showsButtons={false}
                dot={ <View style={styles.dot} />}
                activeDot={ <View style={styles.activeDot} /> }>

                <Image source={{uri: them[0].image_url}}
                  key={`${them[0].id}-cimg`}
                  style={[styles.imagebg,{ margin:0 }]}
                  resizeMode={Image.resizeMode.cover} />
                <Image source={{uri: them[1].image_url}}
                  key={`${them[1].id}-cimg`}
                  style={[styles.imagebg,{ margin:0 }]}
                  resizeMode={Image.resizeMode.cover} />

              </Swiper>}
            header={(



                <View style={{position:'absolute',top:30,left:20,width: 50, backgroundColor:'transparent',height: 50,alignSelf:'center',justifyContent:'center'}}>
                  <TouchableHighlight  onPress={this.props.hideProfile}>
                    <Image source={require('image!closeWithShadow')} resizeMode={Image.resizeMode.contain}/>
                  </TouchableHighlight>
                </View>

              )}>

              <BlurView blurType={'light'}
                key={`${this.props.match.match_id}-bottomview`}
                style={{
                  height:( 500),
                  backgroundColor:'transparent',
                  flex:1,
                  alignSelf:'stretch',
                  alignItems:'stretch',
                  left:0,
                  right:0,
                }} >
                  <View style={{
                    width: DeviceWidth ,
                    paddingVertical:20
                    }}>
                    <Text style={[styles.cardBottomText,{
                    width: DeviceWidth,

                    }]}>{
                      `${them[0].firstname.trim()} and ${them[1].firstname.trim()}`
                    }</Text>
                  </View>
                <View style={{
                    height:60,
                    top:-30,
                    position:'absolute',
                    width:135,
                    right:0,
                    backgroundColor:'transparent',
                    flexDirection:'row'}}>
                    <Image
                      source={{uri: them[0].image_url}}
                      key={them[0].id + 'img'}
                      style={[styles.circleimage, {marginRight:5}]}
                    />
                    <Image
                      source={{uri: them[1].image_url}}
                      key={them[1].id + 'img'}
                      style={styles.circleimage}
                      />
                </View>
                  <View style={{width: DeviceWidth, padding:20}}>

                      <View>
                        <Text>You are welcome to contribute comments, but they should be relevant to the conversation. We reserve the right to remove off-topic remarks in the interest of keeping the conversation focused and engaging. Shameless self-promotion is well, shameless, and will get canned.</Text>
                      </View>
                  </View>

              </BlurView>

           </ParallaxSwiper>

         </View>
        </View>

      )
    }
}
export default UserProfile



var styles = StyleSheet.create({

shadowStyles:{
  shadowColor:colors.darkShadow,
  shadowRadius:5,
  shadowOpacity:50,
  shadowOffset: {
    width:0,
    height: 5
  }
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
    borderRadius:3,
    backgroundColor: colors.dark,
      borderWidth: 1,
      borderColor:'rgba(0,0,0,.2)',
      overflow:'hidden',

    },
    bottomButtons: {
      height: 80,
      alignItems: 'center',
      flexDirection: 'row',
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
    borderRadius:3,
    backgroundColor: colors.dark,
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor:'rgba(0,0,0,.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden'

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
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: 'transparent',
    width: 20,
    height: 20,
    borderRadius: 10,
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


  cardBottomText:{
    marginLeft:15,
    fontFamily:'Montserrat',
    color: colors.shuttleGray,
    fontSize:22,
    marginTop:10
  }
});
