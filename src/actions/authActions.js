
import axios from 'axios';
import setAuthToken from '../utilities/setAuthToken';
import { SET_CURRENT_USER } from './types';
import jwt_decode from 'jwt-decode';

export function setCurrentUser(user){
    // dispatch action, payload to reducer
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function authLogout(){
    return dispatch => {
        localStorage.removeItem('jwtToken');
        setAuthToken(false);
        dispatch(setCurrentUser({}));
    }
}

export function authLogin(userData){
    return dispatch => {
        return axios.post('/api/users/login', userData)
        .then(res => {
            const token = res.data.token;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            dispatch(setCurrentUser(jwt_decode(token)));
        });
    }
}

/*
 Verify JWT
 going to verify via jsonwebtoken (node only) + config keys
*/
export function authToken(token){
    return dispatch => {
        return axios.post('/api/users/token', { token: token })
        .then(
            res => {
                // set app local storage
                localStorage.setItem('jwtToken', token);
                // set ajax Authorization header
                setAuthToken(token);
                // set store.isAuthenticated, store.user
                dispatch(setCurrentUser(jwt_decode(token)));
                return true;
            },
            err => {
                localStorage.removeItem('jwtToken');
                setAuthToken(false);
                dispatch(setCurrentUser({}));
                return false;
            }
        );
    }
}

/*
 Forgot Password
*/
export function forgotPassword(email){
    return dispatch => {
        return axios.post('/api/users/forgot', { email: email })
        .then(
            res => {
                return { success: res.data.message };
            },
            err => {
                return { error: err.response.data.message };
            }
        );
    }
}
