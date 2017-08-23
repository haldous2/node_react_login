
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
            return invalid('User data is required');
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
                return true;
            },
            err => {
                return false;
            }
        );
    }else{
        return new Promise((valid, invalid) => {
            return invalid('Token is required');
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
                //return { success: res.data };
            },
            err => {
                return { error: err.response.data.message };
                //return { error: err.response.data };
            }
        );
    }else{
        return new Promise((valid, invalid) => {
            return invalid('Email is required');
        });
    }
}
