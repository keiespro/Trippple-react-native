import uuid from 'uuid'

export default function notificationsReducer(state = initialState, action) {

  switch (action.type) {
      case 'DISMISS_ALL_NOTIFICATIONS':

        return state.map(n => {
          __DEV__ && console.log(n);
          if(n && !n.viewedAt){
            n.viewedAt = Date.now()
          }
          return n
        })
      case 'DISMISS_NOTIFICATION':
        return state.slice(1,state.length)
      case 'CLEAR_ALL_NOTIFICATIONS':
        return initialState;
      case 'RECEIVE_NOTIFICATION_FULFILLED':

        const moreNotificationAttributes = {
          uuid: uuid.v4(),
          receivedAt: Date.now(),
          viewedAt: null,
          interactedWith: false,
        }
        const newNotification = {...action.meta, ...action.payload, ...moreNotificationAttributes }
        return [newNotification, ...state]

      default:

        return state;
  }
}


const initialState = [];
