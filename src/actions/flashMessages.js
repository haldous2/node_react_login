// Flash Message Action

import {
    ADD_FLASH_MESSAGE,
    INCREMENT_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGES
} from './types';

export function addFlashMessage(message){
    return {
        type: ADD_FLASH_MESSAGE,
        message
    }
}

export function incrementFlashMessage(message){
    return {
        type: INCREMENT_FLASH_MESSAGE
    }
}

export function deleteFlashMessage(id){
    return {
        type: DELETE_FLASH_MESSAGE,
        id
    }
}

export function deleteFlashMessages(id){
    return {
        type: DELETE_FLASH_MESSAGES,
        id
    }
}
