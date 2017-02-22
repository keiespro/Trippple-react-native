
import { View, Dimensions, Text,ScrollView, ListView, Platform, NativeModules, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import CardLabel from '../../CardLabel'
import ActionMan from '../../../actions'
import colors from '../../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class Browse extends React.Component{

  constructor(props) {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      users: props.users,
      dataSource: ds.cloneWithRows(props.users),
    };
  }
  componentWillReceiveProps(nProps){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      users: nProps.users,
      dataSource: ds.cloneWithRows(nProps.users),
   });

  }
  renderRow(rowData, sectionID, rowID, highlightRow){
    const {user,partner} = rowData;
    const isLiked = this.props.likes.indexOf(rowData.user.id+'') > -1;
    console.log(rowData.user.id,isLiked,this.props.likes);

    return (
      <View
        key={rowData.user.id}
        style={[{
          borderRadius: 9,
          width: MagicNumbers.screenWidth/2 - 5,
          height: 220,
          backgroundColor:'#fff',
          marginTop:20,
          shadowColor:colors.darkShadow,
          shadowRadius:1,
          shadowOpacity:100,
          shadowOffset: {
            width:0,
            height: 1
          }
        }]}
      >
        <TouchableOpacity
          style={{
            borderRadius: 9,
            overflow:'hidden'
          }}
          onPress={() => {
            this.props.dispatch(ActionMan.pushRoute('UserProfile', { potential: rowData, user: this.props.user,profileVisible: true}));
          }}
          >
        <Image
          source={user.image_url || partner.image_url ? {uri: user.image_url || partner.image_url} : require('./assets/defaultuser.png')}
          style={{
            borderTopLeftRadius: 9,
            borderTopRightRadius: 9,
            overflow:'hidden',
            height:170,width: MagicNumbers.screenWidth/2 - 5,
          }}
        />
        <View
          style={{
            padding:5
          }}
        >
          <CardLabel matchName={user.firstname} potential={rowData} textColor={colors.shuttleGray}/>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              width: 30,
              height:30,
              flexGrow:1,
              alignItems:'center',
              justifyContent:'center',
              position:'absolute',
              right:7,
              top: 12
            }}
            onPress={() => {
              this.props.dispatch(ActionMan.SwipeCard({
                likeUserId: rowData.user.id,
                likeStatus: isLiked ? 'deny' : 'approve',
                relStatus: this.props.user.relationship_status == 'single' ? 'couple' : 'single',
                rel: this.props.user.relationship_status,

              }));
            }}
          >
            <Icon name='check-circle' size={30} color={isLiked ? colors.mediumPurple : colors.shuttleGray20}/>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      </View>
    )
  }

  render(){
    const tabs = ['Newest','Popular','Nearby','22222','222222']
    return (
      <View style={{marginTop:66}}>
        <ScrollView
          style={{
            backgroundColor:colors.dark,
            height:50,
            marginTop:5,
          }}
          contentContainerStyle={{
            alignItems:'center',
            justifyContent:'space-between',
            minWidth:DeviceWidth
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {tabs.map(t => (
            <TouchableOpacity
              style={{
                borderRadius: 9,
                overflow:'hidden',
                paddingHorizontal: 20,
                height:45,
                flexGrow:1,
                alignItems:'center',
                justifyContent:'center'
              }}
              onPress={() => {
                this.setState({
                  currentFilter: t
                })
              }}
            >
              <Text style={{color:'#fff',opacity: t == this.state.currentFilter ? 1 : 0.6,fontFamily:'Montserrat'}}>{t.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ListView
          contentContainerStyle={{
            flexWrap:'wrap',
            flexGrow:1,
            flexDirection:'row',
            justifyContent:'space-between',
            width:MagicNumbers.screenWidth+14,
            alignSelf:'center',
          }}
          style={{flexWrap:'wrap',}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    )
  }
}



const mapStateToProps = (state, ownProps) => ({
  users: state.browse,
  user: state.user,
  likes: [...Object.keys(state.swipeHistory), ...Object.keys(state.swipeQueue)]
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Browse);
