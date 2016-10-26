
export default function settingsReducer(state = initialState, action) {
  switch (action.type) {

    case 'TOGGLE_PERMISSION_SWITCH_LOCATION':

      return {
        ...state,
        permissionSwitches: {
          ...state.permissionSwitches,
          location: !state.permissionSwitches.location
        }
      };


    case 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS':

      return {
        ...state,
        permissionSwitches: {
          ...state.permissionSwitches,
          notifications: !state.permissionSwitches.notifications
        }
      };


    default:

      return state;
  }
}


const initialState = {

  permissionSwitches: {
    location: false,
    notifications: false
  }
};
