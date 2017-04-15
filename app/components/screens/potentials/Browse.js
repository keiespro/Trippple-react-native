
import { View, Dimensions, Text, ScrollView, ListView, Platform, RefreshControl, TouchableOpacity, Image } from 'react-native'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {BlurView} from 'react-native-blur'

import Icon from 'react-native-vector-icons/MaterialIcons'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import CardLabel from '../../CardLabel'
import ActionMan from '../../../actions'
import colors from '../../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const Tooltip = () => (
  <View style={{position: 'absolute', zIndex: 100, left: 60, top: 220, }}>
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
  </View>
)

export class Browse extends React.Component{

  constructor(props) {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 && r1.liked !== r2.liked });
    this.state = {
      users: props.users,
      dataSource: ds.cloneWithRows(props.users),

    };
    console.log(props.users);
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
    if(nProps.currentFilter != this.props.currentFilter || nProps.users.length != this.props.users.length){

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 && r1.liked !== r2.liked });
      this.setState({
        users: nProps.users,
        dataSource: ds.cloneWithRows(nProps.users),
      });
    }

    if(nProps.currentFilter != this.props.currentFilter){
      this.props.dispatch(ActionMan.fetchBrowse({coords: {lat: this.props.user.latitude, lng: this.props.user.longitude }, filter: this.props.currentFilter, page: this.props[`page${this.props.currentFilter}`]}))
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
    }));
  }

  renderRow(rowData, sectionID, rowID, highlightRow){
    console.log(rowData);
    const {user, partner} = rowData;
    const isLiked = user ? user.liked : true;
    const img = (user && user.image_url) || (partner && partner.image_url);
    const imgSource = img ? {uri: img.replace('test/', '').replace('images/', '')} : require('./assets/defaultuser.png')
    return (
      <View
        key={rowData.user.id}
        style={[{
          borderRadius: 12,
          width: (MagicNumbers.screenWidth / 2),
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


        <TouchableOpacity
          style={{
            borderRadius: 11,
            overflow: 'hidden'
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
                paddingLeft: 5
              }}
            >
              <CardLabel
                matchName={user.firstname}
                potential={rowData}
                textColor={colors.shuttleGray}
              />

              {partner && partner.id && partner.id !== 'NONE' &&
                <Image
                  source={require('./assets/iconCouple.png')}
                  resizeMode="contain"
                  style={{
                    marginLeft: 8,
                    marginTop: 3,
                    width: 20,
                    height: 15
                  }}
                />
              }
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
    console.log('render')
    const tabs = ['Newest', 'Popular', 'Nearby']
    return (
      <View style={{marginTop: 66}}>
        <BlurView
          blurType="dark"
          style={{
            backgroundColor: colors.shuttleGray70,
            zIndex: 9999,
            height: 50,
            width: DeviceWidth,
            top: 0,
            position: 'absolute'
          }}
        >
          <ScrollView
            style={{
              height: 50,
              width: DeviceWidth,
              backgroundColor: 'transparent'
            }}
            contentContainerStyle={{
              alignItems: 'stretch',
              minWidth: DeviceWidth,
              backgroundColor: 'transparent',

            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {tabs.map(t => (
              <TouchableOpacity
                key={`tab${t}`}
                style={{
                  overflow: 'hidden',
                  height: 45,
                  flexGrow: 1,
                  alignSelf: 'stretch',
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  this.props.dispatch({ type: 'CHANGE_BROWSE_FILTER', payload: t.toLowerCase() })
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    opacity: t.toLowerCase() == this.props.currentFilter ? 1 : 0.6,
                    fontFamily: 'Montserrat'
                  }}
                >{t.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BlurView>

        {this.props.users && this.props.users.length > 0 && this.props.showBrowseTooltip && <Tooltip />}

        <ListView
          contentContainerStyle={{
            flexWrap: 'wrap',
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: DeviceWidth,
            paddingHorizontal: 5,
            alignSelf: 'stretch',
          }}
          initialListSize={6}
          pageSize={6}
          scrollRenderAheadDistance={400}
          enableEmptySections
          style={{flexDirection: 'column', alignSelf: 'center', paddingTop: 65 }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={1800}
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

const mapStateToProps = (state, ownProps) => {

  console.log(state.browse.toJS());

  return ({
    ...ownProps,
    users: Object.values(state.browse.toJS()[state.ui.browseFilter]),
    currentFilter: state.ui.browseFilter,
    user: state.user,
    refreshing: state.ui.refreshingBrowse,
    pagenewest: state.ui.browsePagenewest,
    pagenearby: state.ui.browsePagenearby,
    pagepopular: state.ui.browsePagepopular,
    likes: {...state.swipeQueue, ...state.swipeHistory},
    showBrowseTooltip: state.user.showBrowseTooltip
  })
}
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Browse);
