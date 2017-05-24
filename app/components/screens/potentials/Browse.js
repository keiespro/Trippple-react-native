
import { View, Dimensions, Text, ScrollView, ListView, StyleSheet, Platform, RefreshControl, TouchableOpacity, Image } from 'react-native'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {BlurView} from 'react-native-blur'
import {
  TabNavigation,
  withNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import CardLabel from '../../CardLabel'
import ActionMan from '../../../actions'
import colors from '../../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const Tooltip = props => (
  <View style={{position: 'absolute', zIndex: 10000, left: 66, bottom: 35, }}>

    <TouchableOpacity onPress={props.onPress} >
      <View style={{padding: 10, borderRadius: 9, overflow: 'hidden', width: 180, height: 50, backgroundColor: colors.mediumPurple}}>
	<Text style={{color: colors.white, fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat'}}>TAP TO LIKE</Text>
      </View>

      <Image
	source={require('../chat/assets/TrianglePurple.png')} style={{
	  alignSelf: 'center',
	  top: -10,
	  width: 20,
	  height: 23,
	  transform: [
	    {rotate: '270deg'}
	  ]
	}}
      />
  </TouchableOpacity>
</View>
)

export class Browse extends React.Component{

  constructor(props) {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.liked != r2.liked});
    this.state = {
      users: props.users,
      dataSource: ds.cloneWithRows(props.users),

    };
    // console.log(props.users);
  }
  componentDidMount(){
    if(this.props.showBrowseTooltip){
      setTimeout(() => {
        this.props.dispatch({ type: 'TOGGLE_SHOW_BROWSE_TOOLTIP', payload: { }})
      }, 8000)
    }
    this.props.dispatch(ActionMan.fetchBrowse({coords: {lat: this.props.user.latitude, lng: this.props.user.longitude }, filter: this.props.currentFilter, page: 0}))

  }
  componentWillReceiveProps(nProps){
    if(nProps.users.length != this.props.users.length || this.props.likeCount != nProps.likeCount){
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.liked != r2.liked });
      this.setState({
        users: nProps.users,
        dataSource: ds.cloneWithRows(nProps.users),
      });
    }
  }

  _onRefresh() {
    if(this.props.refreshing) return;

    this.props.dispatch(ActionMan.fetchBrowse({coords: {lat: this.props.user.latitude, lng: this.props.user.longitude }, filter: this.props.currentFilter, page: this.props[`page${this.props.currentFilter}`]}))
  }

  _onEndReached(){
    if(this.props.refreshing) return;
    this.props.dispatch(ActionMan.fetchBrowse({coords: {lat: this.props.user.latitude, lng: this.props.user.longitude }, filter: this.props.currentFilter, page: this.props[`page${this.props.currentFilter}`] + 1}))
  }

  pressRow(rowData){
    this.props.dispatch(ActionMan.pushRoute('UserProfile', { potential: rowData, user: this.props.user, profileVisible: true}));
  }

  toggleLike(rowData){
    this.props.dispatch(ActionMan.sendLike({
      likeUserId: rowData.user.id,
      likeStatus: rowData.user.liked ? 'deny' : 'approve',
      relStatus: this.props.user.relationship_status == 'single' ? 'couple' : 'single',
      rel: this.props.user.relationship_status,
      filter: this.props.currentFilter
    }));

  }
  getRankingInfo(rowData){
    switch (this.props.currentFilter){
      case 'newest':
        return rowData.user.id
      case 'nearby':
        return rowData.user._rankingInfo.matchedGeoLocation.distance
      case 'popular':
        return rowData.user._rankingInfo.userScore
    }
  }
  renderRow(rowData, sectionID, rowID, highlightRow){
    const {user} = rowData;
    const isLiked = user ? user.liked : true;
    const img = (user && user.image_url);
    const imgSource = img ? {uri: img.replace('test/', '').replace('images/', '')} : require('./assets/defaultuser.png')
    return (
      <View
        key={rowData.user.id + this.props.currentFilter}
        style={[{
          borderRadius: 12,
	  zIndex: rowID == 0 ? 9999 : 1,
          width: (MagicNumbers.screenWidth / 2),
	  position:'relative',
          height: (DeviceHeight - 150) / 2,
          backgroundColor: '#fff',
          marginBottom: 20,
          shadowColor: colors.darkShadow,
          shadowRadius: 1,
          shadowOpacity: 5,
          shadowOffset: {
            width: 0,
            height: 1
          }
        }]}
      >

        {rowID == 0 && this.props.showBrowseTooltip && (
	  <Tooltip 
	    onPress={()=>{
	      this.props.dispatch({ type: 'TOGGLE_SHOW_BROWSE_TOOLTIP', payload: { }})
	    }} 
	  />
	)}

        <TouchableOpacity
          style={{
            borderRadius: 11,
	    overflow:'hidden'
          }}
          onPress={this.pressRow.bind(this, rowData)}
        >
          <Image
            source={imgSource}
            style={{
              borderTopLeftRadius: 11,
              borderTopRightRadius: 11,
              overflow: 'hidden',
              height: ((DeviceHeight - 150) / 2) - 52,
              width: (MagicNumbers.screenWidth / 2),
            }}
          />
          <View
            style={{
              padding: 5,
              height: 52
            }}
          >


            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 5,
                alignItems:'flex-start'
              }}
            >


              <CardLabel
                cacheCity={this.props.dispatch}
                matchName={user.firstname}
                potential={rowData}
                textColor={colors.shuttleGray}
                nameStyle={{fontSize:16}}
                cityStateStyle={{fontSize:12}}
                hideCityState={true}
                afterNameIcon={user.relationship_status == 'couple' ?
                  <Image
                    source={require('./assets/iconCouple.png')}
                    resizeMode="contain"
                    style={{
                      marginLeft: 5,
                      marginTop:4,
                      width: 20,
                      height: 12,
                    }}
                  /> : null
                }
              />



              {__DEV__ && (
                <View style={{position: 'absolute',top:-20,right:0}}>
                  <Text>{this.getRankingInfo(rowData)}</Text>
                </View>
              )}

            </View>

            <TouchableOpacity
              style={{
                borderRadius: 20,
                width: 35,
                height: 35,
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 7,
                top: 9
              }}
              onPress={this.toggleLike.bind(this, rowData)}
            >
              <Icon
                name="check-circle"
                size={35}
                color={isLiked ? colors.mediumPurple : '#CED3E0'}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render(){
    return (
      <View style={{marginTop: 64,backgroundColor: colors.outerSpace }}>


        <ListView
          contentContainerStyle={{
            flexWrap: 'wrap',
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: DeviceWidth,
            paddingHorizontal: 5,
            alignSelf: 'stretch',
            backgroundColor: colors.outerSpace,
          }}
          initialListSize={30}
          contentInset={{top: 50, left: 0, bottom: 0, right: 0}}
          contentOffset={{x: 0, y: 50}}
          pageSize={4}
          scrollRenderAheadDistance={1400}
          enableEmptySections
          style={{flexDirection: 'column', alignSelf: 'center', paddingTop: 20 }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={800}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    )
  }
}

const TabBar = (props) => (
  <BlurView
    blurType="dark"
    style={{
      backgroundColor: colors.shuttleGray70,
      zIndex: 9999,
      height: 50,
      width: DeviceWidth,
      alignSelf: 'flex-start',
      position:'absolute',
      top:60
    }}
  >
    <ScrollView
      style={{
        height: 50,
        width: DeviceWidth,
        backgroundColor: 'transparent'
      }}
      contentContainerStyle={{
        alignItems: 'center',
        minWidth: DeviceWidth,
        justifyContent:'center',
        backgroundColor: 'transparent',

      }}
      showsHorizontalScrollIndicator={false}
      horizontal
    >
      {props.tabs.map(t => (
        <TouchableOpacity
          key={`tab${t}`}
          style={{
            overflow: 'hidden',
            height: 50,
            flexGrow: 1,
            alignSelf: 'stretch',
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => {
            props.onPress(t)
            console.log(props)
          }}
        >
          <Text
            style={{
              color: '#fff',
              opacity: t.toLowerCase() == props.selectedTab ? 1 : 0.6,
              fontFamily: 'Montserrat'
            }}
          >{t.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </BlurView>
);

const mapStateToProps = (state, ownProps) => {

  function getSorted(users, filter){
    switch(filter){
      case 'newest':
        return users.reverse();
      case 'nearby':
        return users.reverse()

      case 'popular':
        return users.sort((a, b) => {
          if(!a.user._rankingInfo){ return 0; }
          if(!b.user._rankingInfo){ return 0; }

          if(a.user._rankingInfo.userScore < b.user._rankingInfo.userScore) { return 1; }
          if(a.user._rankingInfo.userScore > b.user._rankingInfo.userScore) { return -1; }
          if(a.user._rankingInfo.userScore === b.user._rankingInfo.userScore) { return 0; }

          return a.user._rankingInfo && b.user._rankingInfo && a.user._rankingInfo.userScore <= b.user._rankingInfo.userScore
        })
    }

  }
  function getCachedCityState(users){
    return users.map(p => {p.user.cityState = p.user.cityState || (state.cityState[p.user.id] && state.cityState[p.user.id]['cityState']) || null; return p})
  }
  const all = state.browse.get(ownProps.currentFilter)
  return ({
    ...ownProps,
    users: getCachedCityState(getSorted(Object.values(all.toJS()), ownProps.currentFilter)),
    user: state.user,
    refreshing: state.ui.refreshingBrowse,
    pagenewest: state.ui.browsePagenewest,
    pagenearby: state.ui.browsePagenearby,
    pagepopular: state.ui.browsePagepopular,
    likes: {...state.swipeQueue, ...state.swipeHistory},
    likeCount: state.likes.fullCount,
    showBrowseTooltip: state.user.showBrowseTooltip,
    currentFilter: ownProps.currentFilter
  })
}
const mapDispatchToProps = (dispatch) => ({ dispatch })

const BrowseTab = connect(mapStateToProps, mapDispatchToProps)(Browse);


@withNavigation
class BrowseNavigator extends React.Component {
  static route = {};


  render() {
    const tabs = ['Newest', 'Popular', 'Nearby']

    return (
      <View style={styles.container}>
        <TabNavigation
          id="browse-navigation"
          navigation={this.props.navigation}
          navigatorUID="browse-navigation"
          initialTab="newest"
          renderLabel={this._renderLabel}
          barBackgroundColor="transparent"
          indicatorStyle={styles.tabIndicator}
          renderTabBar={(props)=><TabBar {...props} tabs={tabs} onPress={title => {
            this.props.navigation.performAction(({ tabs, stacks }) => {
              tabs('browse-navigation').jumpToTab(title.toLowerCase());
            });
          }}/>}
        >
          {tabs.map((tab, i) => (
            <TabNavigationItem title={tab} key={tab + i} id={tab.toLowerCase()}>
              <BrowseTab currentFilter={tab.toLowerCase()} />
            </TabNavigationItem>
          ))}
        </TabNavigation>
      </View>
    );
  }
}

export default BrowseNavigator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.outerSpace

  },

  tabLabel: {
    margin: 8,
    fontSize: 13,
    fontFamily: 'Montserrat',
    color: '#fff',
  },

  tabTouchLabel: {
    zIndex: 9999,

  },
  tabIndicator: {
    backgroundColor: '#fff',
  },

})
