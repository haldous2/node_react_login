
import { SET_CURRENT_USER } from '../actions/types';
import { isEmptyObj } from '../utilities/helper';

const initialState = {
    isAuthenticated: null,
    user: {}
}

export default (state = initialState, action = {}) => {

    switch(action.type){

        case SET_CURRENT_USER:
            return {
                isAuthenticated: !isEmptyObj(action.user),
                user: action.user
            };

        default: return state;
    }
}
