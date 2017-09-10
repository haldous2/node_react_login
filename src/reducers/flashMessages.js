// Flash Message Reducer

import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE, DELETE_FLASH_MESSAGES } from '../actions/types';
import shortid from 'shortid';

// Reducer reacting to action
export default (state = [], action = {}) => {

    switch(action.type){

        case ADD_FLASH_MESSAGE:
            return [
                ...state,
                {
                    id: shortid.generate(),
                    type: action.message.type,
                    text: action.message.text
                }
            ];

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
