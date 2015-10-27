
import _ from 'underscore'
import AppActions  from '../flux/actions/AppActions'
import {PropTypes} from 'react-native'

export default CheckPermissions =  {
  //
  // static propTypes = {
  //   _onPress:PropTypes.func.isRequired,
  //   PERMISSION_KEY: PropTypes.string.isRequired
  // }
  // static defaultProps = {
  //
  //
  // }


  constructor(props) {
    console.log(props)
    super();
    this.state = {
      hasPermission: props.AppState.permissions[props.PERMISSION_KEY]
    }
  }
  componentWillMount(){
    if(this.props.AppState.permissions[PERMISSION_KEY]){
      this.props.navigator.replace({
        component:CameraControl,
        passProps:{ }
      })
    }
  }
  componentDidMount(){
    if(this.state.hasPermission && this.state.hasPermission == true ){
      this.props.navigator.push({
        component:CameraControl,
        passProps:{ }
      })
    }
  }
  componentDidUpdate(prevProps,prevState){

    if( this.state.hasPermission && !prevState.hasPermission){
      this.props.navigator.replace( this.props.nextRoute )
    }

  }
  cancel(){
    this.props.navigator.pop()
  }
  handleTapYes(){
    this.handleSuccess()
  }
  handleFail(){
    this.setState({hasPermission: false})
    AppActions.denyPermission(PERMISSION_KEY)
  }
  handleSuccess(){
    this.setState({hasPermission: true})
    AppActions.grantPermission(PERMISSION_KEY)
  }

}
