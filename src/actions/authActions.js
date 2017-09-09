
import { SET_SESSION_DATA } from './types';
import cookie from 'react-cookies';
import { performRequest } from '../utilities/ajaxRequest';

export function setSessionData(data){
    return {
        type: SET_SESSION_DATA,
        data
    }
}
export function authSession(authenticated=null, data={}){
    /*
     called from component (LoginForm)
     should be wrapped inside <Provider> for dispatch to work correctly
     Note: calling outside <Provider> via 'store.dispatch( reducer )'
    */
    return dispatch => {
        dispatch(setSessionData({ authenticated: authenticated, data: data }));
    }
}
export function authLogin(token){
    cookie.save('jwt', token, {path: "/"});
}
export function authLogout(){
    cookie.remove('jwt', {path: "/"});
}

/*
 token initializer
 /App.js on page load to set axios header
 /components/LoginForm.js on querystring ?token to log in from social sites etc.
                          to set axios header and set cookie jwt
*/
export function initAuthToken(token){
    return new Promise((valid, invalid) => {
        if (token){
            authToken(token)
            .then(
                res => {
                    return valid(true);
                },
                err => {
                    return valid(false);
                }
            );
        }else{
            return valid(false);
        }
    });
}

/*
 LoginForm credential checker
*/
export function authCredentials(data){
    //return axios.post('/api/users/login/', data);
    return performRequest('post', '/api/users/login', data);
}

/*
 JSON Web Tokens (JWT) - verification
*/
export function authToken(token){
    //return axios.post('/api/users/token', { token: token });
    return performRequest('post', '/api/users/token', { token: token });
}

/*
 LoginForm - forgot password
*/
export function forgotPassword(email){
    //return axios.post('/api/users/forgot', { email: email });
    return performRequest('post', '/api/users/forgot', { email: email });
}

/*
 LoginPasswordForm password updater
*/
export function authPassword(token, password){
    //return axios.post('/api/users/forgot/password', {token: token, password: password});
    return performRequest('post', '/api/users/forgot/password', { token: token, password: password });
}
