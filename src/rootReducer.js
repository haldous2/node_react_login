// Global Reducer

import { combineReducers } from 'redux';
import flashMessages from './reducers/flashMessages';
import sessionData from './reducers/sessionData';

// Combine all functions (reduce) into one state object (reduced) a.k.a. the reducer
export default combineReducers({
    flashMessages,
    sessionData
})
