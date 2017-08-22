
import axios from 'axios';
import setAuthToken from '../utilities/setAuthToken';
import { SET_CURRENT_USER } from './types';
import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';

function setCookie(key, val){
    try{
        cookie.save(key, val, {path: "/"});
    }catch(err){
        console.log('cookie error:', err);
    }
}
function removeCookie(key){
    try{
        cookie.remove(key, {path: "/"});
    }catch(err){
        console.log('cookie error:', err);
    }
}

export function setCurrentUser(user){
    return {
        type: SET_CURRENT_USER,
        user
    };
}
export function authLogin(token){
    return dispatch => {
        //localStorage.setItem('jwtToken', token);
        setCookie('jwt', token);
        setAuthToken(token);
        dispatch(setCurrentUser(jwt_decode(token)));
    }
}
export function authLogout(){
    return dispatch => {
        //localStorage.removeItem('jwtToken');
        removeCookie('jwt');
        setAuthToken(false);
        dispatch(setCurrentUser({}));
    }
}

/*
 LoginForm credential checker
*/
export function authCredentials(userData){
    if (userData){
        return axios.post('/api/users/login', userData)
        .then(
            res => {
                //console.log('src.actions.authCredentials: credentials are good!');
                return { success: res.data };
            },
            err => {
                //console.log('src.actions.authCredentials: credentials are invalid');
                return { error: err.response.data}
            }
        );
    }else{
        return new Promise((valid, invalid) => {
            return valid({ error: 'Missing user data' });
        });
    }
}

/*
 Verify JWT
 going to verify via jsonwebtoken (node only) + config keys
*/
export function authToken(token){
    if (token){
        return axios.post('/api/users/token', { token: token })
        .then(
            res => {
                //console.log('src.actions.authActions: token is good!');
                return true;
            },
            err => {
                //console.log('src.actions.authActions: token is invalid');
                return false;
            }
        );
    }else{
        return new Promise((valid, invalid) => {
            return valid(false);
        });
    }
}

/*
 Forgot Password
*/
export function forgotPassword(email){
    if (email){
        return axios.post('/api/users/forgot', { email: email })
        .then(
            res => {
                return { success: res.data.message };
            },
            err => {
                return { error: err.response.data.message };
            }
        );
    }else{
        return new Promise((valid, invalid) => {
            return valid({ error: 'Email is required' });
        });
    }
}
