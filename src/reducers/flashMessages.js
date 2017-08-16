// Flash Message Reducer

import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from '../actions/types';
import shortid from 'shortid';
//import findIndex from 'lodash/findIndex';

// Reducer reacting to action
export default (state = [], action = {}) => {
    //console.log('action.type:', action.type);
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
            //console.log('delete_flash_message - action.id:', action.id);
            const index = state.findIndex(function(item, i){
                return item.id === action.id
            });
            //console.log('index to remove:', index);
            if (index >= 0){
                return [
                    ...state.slice(0, index),
                    ...state.slice(index + 1)
                ];
            }
            return state;

        default: return state;
    }
}
