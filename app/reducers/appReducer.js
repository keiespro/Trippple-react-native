import {REHYDRATE,REHYDRATE_ERROR} from 'redux-persist/constants'

export default function appReducer(state = initialState, action) {

    switch (action.type) {
    case REHYDRATE_ERROR:
        return {...state, booted: true, hydrateError: true}
    case REHYDRATE:
        return {...state, booted: true}

    case 'GET_COUPLE_PIN_FULFILLED':
        return {...state, couplePin: action.payload.response.pin}

    case 'VERIFY_COUPLE_PIN_FULFILLED':
        return {...state, coupling: {...state.coupling, ...action.payload.response}}

    case 'SEND_TEXT_FULFILLED':
        return {...state, coupling: {...state.coupling, sentInvite: action.payload.success, inviteMethod: action.payload.method}}

    case 'TOGGLE_SENT_INVITE':
        return {...state, coupling: {...state.coupling, sentInvite: null, inviteMethod: null}}

    case 'CONNECTION_CHANGE':
        let newState = {};
        if(action.payload.hasOwnProperty('isConnected')){
            newState = action.payload
        }else if(action.payload.hasOwnProperty('connectionType')){
            newState = action.payload
        }
        return {...state, ...newState}

    case 'APP_STATE_CHANGE':

        return {...state, appState: action.payload}

    // explicitly know if response came back empty
    case 'GET_POTENTIALS_FULFILLED':
        const matches = action.payload.response;
        console.log(matches);
        if ( !matches ) return state;
        if ( !matches.length ){
            return {...state, potentialsReturnedEmpty: true}
        }else{
            const nstate = {...state};
            if(nstate['potentialsReturnedEmpty']){
                nstate['potentialsReturnedEmpty'] = null;
                delete nstate['potentialsReturnedEmpty'];
            }
            return {...nstate}
        }
        return state;

    default:

        return state;
    }
}


const initialState = {

    visibility: null,
    version: null,
    network: null,
    potentialsReturnedEmpty: false

};
