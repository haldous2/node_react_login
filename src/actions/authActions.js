
import axios from 'axios';
import setAuthToken from '../utilities/setAuthToken';
import { SET_CURRENT_USER } from './types';
import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';

export function setCurrentUser(user){
    return {
        type: SET_CURRENT_USER,
        user
    };
}
export function authLogin(token){
    return dispatch => {
        //localStorage.setItem('jwtToken', token);
        cookie.save('jwt', token, {path: "/"});
        setAuthToken(token);
        dispatch(setCurrentUser(jwt_decode(token)));
    }
}
export function authLogout(){
    return dispatch => {
        //localStorage.removeItem('jwtToken');
        cookie.remove('jwt', {path: "/"});
        setAuthToken(false);
        dispatch(setCurrentUser({}));
    }
}

/*
 LoginForm credential checker
*/
export function authCredentials(userData){
    return axios.post('/api/users/login/', userData);
}

/*
 JSON Web Tokens (JWT) - verification
*/
export function authToken(token){
    return axios.post('/api/users/token', { token: token });
}

/*
 LoginForm - forgot password
*/
export function forgotPassword(email){
    return axios.post('/api/users/forgot', { email: email });
}

/*
 LoginPasswordForm password updater
*/
export function authPassword(token, password){
    return axios.post('/api/users/forgot/password', {token: token, password: password});
}
