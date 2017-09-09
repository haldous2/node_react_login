
import { SET_SESSION_DATA } from '../actions/types';

const initialState = {
    isAuthenticated: null,
    data: {}
}

export default (state = initialState, action = {}) => {
    switch(action.type){

        case SET_SESSION_DATA:
            return {
                isAuthenticated: action.data.authenticated,
                data: action.data.data
            };

        default: return state;
    }
}
