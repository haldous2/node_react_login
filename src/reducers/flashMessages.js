// Flash Message Reducer

import {
    ADD_FLASH_MESSAGE,
    INCREMENT_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGES
} from '../actions/types';
import shortid from 'shortid';

// Reducer reacting to action
export default (state = [], action = {}) => {

    let newState = [];
    let msg = {};
    let nbr_times = 0;

    switch(action.type){

        case ADD_FLASH_MESSAGE:
            return [
                ...state,
                {
                    id: shortid.generate(),
                    count: 1,
                    type: action.message.type,
                    text: action.message.text
                }
            ];

        /*
         Message count tracking
         number of times allowed to display on page
         default of 1 works best especially on logout directly from login
           the success message will disappear on logout
        */
        case INCREMENT_FLASH_MESSAGE:
            newState = [];
            nbr_times = 1;
            for (msg in state) {
                if (state[msg].count < nbr_times){
                    state[msg].count += 1;
                    newState.push(state[msg]);
                }
            }
            return newState;

        case DELETE_FLASH_MESSAGE:
            const index = state.findIndex(function(item, i){
                return item.id === action.id
            });
            if (index >= 0){
                return [
                    ...state.slice(0, index),
                    ...state.slice(index + 1)
                ];
            }
            return state;

        case DELETE_FLASH_MESSAGES:
            return [];

        default: return state;
    }
}
