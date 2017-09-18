
import { SET_SESSION_DATA } from '../actions/types';

/*
 Initialize isAuthenticated as null so that receiveProps of various components can have a chance
 to wait for a true or false answer
*/
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
