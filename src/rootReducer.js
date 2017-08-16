// Global Reducer

import { combineReducers } from 'redux';
import flashMessages from './reducers/flashMessages';
import authUser from './reducers/authUser';

// Combine all functions (reduce) into one state object (reduced) a.k.a. the reducer
export default combineReducers({
    flashMessages,
    authUser
})
