import Api from '../../utils/api'
import alt from '../alt'
import UserActions from '../actions/UserActions'
import AppActions from '../actions/AppActions'

console.log(UserActions)
const UserSource = {
  initUser: {
    remote(state) {
      return Api.getUserInfo()
    },

    success: UserActions.initSuccess,
    error: AppActions.remoteFail, // (required)

    shouldFetch(state) {
      return true
    }
  },
  // isLoading:
};

export default UserSource
